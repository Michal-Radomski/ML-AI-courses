import * as tf from "@tensorflow/tfjs-node";

class LinearRegression {
  features: number[][];
  labels: number[][];
  options: {};
  constructor(features: number[][], labels: number[][], options: {}) {
    this.features = features;
    this.labels = labels;
    this.options = options;
  }
}

export default LinearRegression;
