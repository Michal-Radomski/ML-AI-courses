import * as tf from "@tensorflow/tfjs-node";
import _ from "lodash";

interface Options {
  learningRate: number;
  iterations: number;
}

class LinearRegression {
  features: number[][];
  labels: number[][];
  options: Options;
  m: number;
  b: number;
  constructor(features: number[][], labels: number[][], options: Options) {
    this.features = features;
    this.labels = labels;
    this.options = Object.assign({ learningRate: 0.1, iterations: 1000 }, options);
    this.m = 0; //* can be 1
    this.b = 0; //* can be 1
  }

  gradientDescent(): void {
    const currentGuessesForMPG: number[] = this.features.map((row: number[]) => {
      return this.m * row[0] + this.b;
    });
    const bSlope: number =
      (_.sum(
        currentGuessesForMPG.map((guess: number, i: number) => {
          return guess - this.labels[i][0];
        })
      ) *
        2) /
      this.features.length;

    const mSlope: number =
      (_.sum(
        currentGuessesForMPG.map((guess: number, i: number) => {
          return -1 * this.features[i][0] * (this.labels[i][0] - guess);
        })
      ) *
        2) /
      this.features.length;

    this.m = this.m - mSlope * this.options.learningRate;
    this.b = this.b - bSlope * this.options.learningRate;
  }

  train(): void {
    for (let i = 0; i < this.options.iterations; i++) {
      this.gradientDescent();
    }
  }
}

export default LinearRegression;
