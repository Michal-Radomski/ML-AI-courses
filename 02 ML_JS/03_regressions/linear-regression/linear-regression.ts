import * as tf from "@tensorflow/tfjs-node";
// import _ from "lodash";

interface Options {
  learningRate: number;
  iterations: number;
}

//* V1 - traditional calculation
// class LinearRegression {
//   features: number[][];
//   labels: number[][];
//   options: Options;
//   m: number;
//   b: number;
//   constructor(features: number[][], labels: number[][], options: Options) {
//     this.features = features;
//     this.labels = labels;
//     this.options = Object.assign({ learningRate: 0.1, iterations: 1000 }, options);
//     this.m = 0; //* can be 1
//     this.b = 0; //* can be 1
//   }

//   gradientDescent(): void {
//     const currentGuessesForMPG: number[] = this.features.map((row: number[]) => {
//       return this.m * row[0] + this.b;
//     });
//     const bSlope: number =
//       (_.sum(
//         currentGuessesForMPG.map((guess: number, i: number) => {
//           return guess - this.labels[i][0];
//         })
//       ) *
//         2) /
//       this.features.length;

//     const mSlope: number =
//       (_.sum(
//         currentGuessesForMPG.map((guess: number, i: number) => {
//           return -1 * this.features[i][0] * (this.labels[i][0] - guess);
//         })
//       ) *
//         2) /
//       this.features.length;

//     this.m = this.m - mSlope * this.options.learningRate;
//     this.b = this.b - bSlope * this.options.learningRate;
//   }

//   train(): void {
//     for (let i = 0; i < this.options.iterations; i++) {
//       this.gradientDescent();
//     }
//   }
// }

//* V2 - tensorflow
class LinearRegression {
  features: tf.Tensor<tf.Rank>;
  labels: tf.Tensor<tf.Rank>;
  options: Options;
  weights: tf.Tensor<tf.Rank>;
  mean: tf.Tensor<tf.Rank> | undefined;
  variance: tf.Tensor<tf.Rank> | undefined;
  mseHistory: number[];
  bHistory: number[];

  constructor(features: number[][], labels: number[][], options: Options) {
    this.labels = tf.tensor(labels) as tf.Tensor<tf.Rank>;
    this.features = this.processFeatures(features);

    this.options = Object.assign({ learningRate: 0.1, iterations: 1000 }, options);
    this.weights = tf.zeros([this.features.shape[1]!, 1], "float32");

    this.mseHistory = [];
    this.bHistory = [];
  }

  gradientDescent(): void {
    const currentGuesses = this.features.matMul(this.weights);
    const differences = currentGuesses.sub(this.labels);

    const slopes = this.features.transpose().matMul(differences).div(this.features.shape[0]);

    this.weights = this.weights.sub(slopes.mul(this.options.learningRate));
  }

  train(): void {
    for (let i = 0; i < this.options.iterations; i++) {
      // console.log("this.options.learningRate:", this.options.learningRate, { i });
      this.bHistory.push((this.weights.arraySync() as number[][])[0][0]);
      // console.log("this.weights.arraySync():", this.weights.arraySync());
      this.gradientDescent();
      this.recordMSE();
      this.updateLearningRate();
    }
  }

  test(testFeatures: number[][], testLabels: number[][]): number {
    const testFeatures2 = this.processFeatures(testFeatures);
    const testLabels2 = tf.tensor(testLabels) as tf.Tensor<tf.Rank>;

    const predictions = testFeatures2.matMul(this.weights);
    // predictions.print();

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

    // console.log("mse:", mse);
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

export default LinearRegression;
