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

  constructor(features: number[][], labels: number[][], options: Options) {
    this.features = tf.tensor(features) as tf.Tensor<tf.Rank>;
    this.labels = tf.tensor(labels) as tf.Tensor<tf.Rank>;
    this.features = tf.ones([this.features.shape[0], 1], "float32").concat(this.features, 1);

    this.options = Object.assign({ learningRate: 0.1, iterations: 1000 }, options);
    this.weights = tf.zeros([2, 1], "float32");
  }

  gradientDescent(): void {
    const currentGuesses = this.features.matMul(this.weights);
    const differences = currentGuesses.sub(this.labels);

    const slopes = this.features.transpose().matMul(differences).div(this.features.shape[0]);

    this.weights = this.weights.sub(slopes.mul(this.options.learningRate));
  }

  train(): void {
    for (let i = 0; i < this.options.iterations; i++) {
      this.gradientDescent();
    }
  }

  test(testFeatures: number[][], testLabels: number[][]): number {
    let testFeatures2 = tf.tensor(testFeatures) as tf.Tensor<tf.Rank>;
    let testLabels2 = tf.tensor(testLabels) as tf.Tensor<tf.Rank>;

    testFeatures2 = tf.ones([testFeatures2.shape[0], 1]).concat(testFeatures2, 1);

    const predictions = testFeatures2.matMul(this.weights);
    // predictions.print();

    const res = testLabels2.sub(predictions).pow(2).sum().arraySync() as number;
    const tot = testLabels2.sub(testLabels2.mean()).pow(2).sum().arraySync() as number;

    return 1 - res / tot;
  }
}

export default LinearRegression;
