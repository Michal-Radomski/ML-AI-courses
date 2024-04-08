import * as tf from "@tensorflow/tfjs-node";

import { Options } from "../1_linear-regression/linear-regression";

class MultinominalLogisticRegression {
  features: tf.Tensor<tf.Rank>;
  labels: tf.Tensor<tf.Rank>;
  options: Options;
  weights: tf.Tensor<tf.Rank>;
  mean: tf.Tensor<tf.Rank> | undefined;
  variance: tf.Tensor<tf.Rank> | undefined;
  costHistory: number[]; //* Cross Entropy

  constructor(features: number[][], labels: number[][], options: Options) {
    this.labels = tf.tensor(labels) as tf.Tensor<tf.Rank>;
    this.features = this.processFeatures(features);

    this.options = Object.assign({ learningRate: 0.1, iterations: 1000, decisionBoundary: 0.5 }, options);
    this.weights = tf.zeros([this.features.shape[1]!, this.labels.shape[1]!], "float32");

    this.costHistory = [];
  }

  gradientDescent(features: tf.Tensor<tf.Rank>, labels: tf.Tensor<tf.Rank>): void {
    // const currentGuesses = features.matMul(this.weights).sigmoid();
    const currentGuesses = features.matMul(this.weights).softmax();
    const differences = currentGuesses.sub(labels);

    const slopes = features.transpose().matMul(differences).div(features.shape[0]);

    this.weights = this.weights.sub(slopes.mul(this.options.learningRate));
  }

  train(): void {
    const batchQuantity = Math.floor(this.features.shape[0] / this.options.batchSize);

    for (let i = 0; i < this.options.iterations; i++) {
      for (let j = 0; j < batchQuantity; j++) {
        const startIndex = j * this.options.batchSize;
        const { batchSize } = this.options;

        const featureSlice = this.features.slice([startIndex, 0], [batchSize, -1]);
        const labelSlice = this.labels.slice([startIndex, 0], [batchSize, -1]);

        this.gradientDescent(featureSlice, labelSlice);
      }

      this.recordCost();
      this.updateLearningRate();
    }
  }

  //* V1 -> sigmoid, V2 -> softmax !
  predict(observations: number[][]): tf.Tensor<tf.Rank> {
    return (
      this.processFeatures(observations)
        .matMul(this.weights)
        // .sigmoid()
        .softmax()
        .greater(this.options.decisionBoundary!)
        .cast("float32")
    );
  }

  test(testFeatures: number[][], testLabels: number[][]): number {
    const predictions = this.predict(testFeatures);
    const testLabels2 = tf.tensor(testLabels) as tf.Tensor<tf.Rank>;

    const incorrect = predictions.sub(testLabels2).abs().sum().arraySync() as number;

    return (predictions.shape[0] - incorrect) / predictions.shape[0];
  }

  processFeatures(features: number[][]): tf.Tensor<tf.Rank> {
    let features2 = tf.tensor(features) as tf.Tensor<tf.Rank>;

    if (this.mean && this.variance) {
      features2 = features2.sub(this.mean).div(this.variance.pow(0.5).add(1e-7));
    } else {
      features2 = this.standardize(features2);
    }

    features2 = tf.ones([features2.shape[0], 1], "float32").concat(features2, 1) as tf.Tensor<tf.Rank>;

    return features2;
  }

  standardize(features: tf.Tensor<tf.Rank>) {
    const { mean, variance } = tf.moments(features, 0);
    this.mean = mean;
    this.variance = variance;

    return features.sub(mean).div(variance.pow(0.5).add(1e-7));
  }

  recordCost(): void {
    // const guesses = this.features.matMul(this.weights).sigmoid();
    const guesses = this.features.matMul(this.weights).softmax();
    const termOne = this.labels.transpose().matMul(guesses.log());
    const termTwo = this.labels.mul(-1).add(1).transpose().matMul(guesses.mul(-1).add(1).log());
    const cost = termOne.add(termTwo).div(this.features.shape[0]).mul(-1);
    const costToReturn = (cost as any).arraySync()[0][0] as number;
    this.costHistory.unshift(costToReturn);
  }

  updateLearningRate(): void {
    if (this.costHistory.length < 2) {
      return;
    }

    if (this.costHistory[0] > this.costHistory[1]) {
      this.options.learningRate /= 2;
    } else {
      this.options.learningRate *= 1.05;
    }
  }
}

export default MultinominalLogisticRegression;
