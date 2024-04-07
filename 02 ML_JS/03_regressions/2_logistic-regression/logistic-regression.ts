import * as tf from "@tensorflow/tfjs-node";

import { Options } from "../1_linear-regression/linear-regression";

class LogisticRegression {
  features: tf.Tensor<tf.Rank>;
  labels: tf.Tensor<tf.Rank>;
  options: Options;
  weights: tf.Tensor<tf.Rank>;
  mean: tf.Tensor<tf.Rank> | undefined;
  variance: tf.Tensor<tf.Rank> | undefined;
  mseHistory: number[];

  constructor(features: number[][], labels: number[][], options: Options) {
    this.labels = tf.tensor(labels) as tf.Tensor<tf.Rank>;
    this.features = this.processFeatures(features);

    this.options = Object.assign({ learningRate: 0.1, iterations: 1000 }, options);
    this.weights = tf.zeros([this.features.shape[1]!, 1], "float32");

    this.mseHistory = [];
  }

  gradientDescent(features: tf.Tensor<tf.Rank>, labels: tf.Tensor<tf.Rank>): void {
    const currentGuesses = features.matMul(this.weights);
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

      this.recordMSE();
      this.updateLearningRate();
    }
  }

  predict(observations: number[][]): tf.Tensor<tf.Rank> {
    return this.processFeatures(observations).matMul(this.weights);
  }

  test(testFeatures: number[][], testLabels: number[][]): number {
    const testFeatures2 = this.processFeatures(testFeatures);
    const testLabels2 = tf.tensor(testLabels) as tf.Tensor<tf.Rank>;

    const predictions = testFeatures2.matMul(this.weights);

    const res = testLabels2.sub(predictions).pow(2).sum().arraySync() as number;
    const tot = testLabels2.sub(testLabels2.mean()).pow(2).sum().arraySync() as number;

    return 1 - res / tot;
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

  recordMSE(): void {
    const mse = this.features
      .matMul(this.weights)
      .sub(this.labels)
      .pow(2)
      .sum()
      .div(this.features.shape[0])
      .arraySync() as number;

    this.mseHistory.unshift(mse);
    this.updateLearningRate();
  }

  updateLearningRate(): void {
    if (this.mseHistory.length < 2) {
      return;
    }

    if (this.mseHistory[0] > this.mseHistory[1]) {
      this.options.learningRate /= 2;
    } else {
      this.options.learningRate *= 1.05;
    }
  }
}

export default LogisticRegression;
