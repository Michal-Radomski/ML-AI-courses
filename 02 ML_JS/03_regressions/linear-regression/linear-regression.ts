import * as tf from "@tensorflow/tfjs-node";

interface Options {
  iterations: number;
}

class LinearRegression {
  features: number[][];
  labels: number[][];
  options: Options;
  constructor(features: number[][], labels: number[][], options: Options) {
    this.features = features;
    this.labels = labels;
    this.options = Object.assign({ learningRate: 0.1, iterations: 1000 }, options);
  }

  train() {
    for (let i = 0; i < this.options.iterations; i++) {
      this.gradientDescent();
    }
  }
  gradientDescent() {
    console.log("gradientDescent");
  }
}

export default LinearRegression;
