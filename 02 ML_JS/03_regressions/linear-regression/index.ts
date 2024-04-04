import * as tf from "@tensorflow/tfjs-node";

const loadCSV = require("../load-csv");
import LinearRegression from "./linear-regression";

let {
  features,
  labels,
  testFeatures,
  testLabels,
}: { features: number[][]; labels: number[][]; testFeatures: number[][]; testLabels: number[][] } = loadCSV("./cars.csv", {
  shuffle: true,
  splitTest: 50, //* Usually ~50%
  dataColumns: ["horsepower", "weight", "displacement"],
  labelColumns: ["mpg"],
});
// console.log({ features, labels, testFeatures, testLabels });
// console.log("LinearRegression:", LinearRegression, typeof LinearRegression);

const linearRegression = new LinearRegression(features, labels, {
  learningRate: 0.001,
  iterations: 1,
});
// console.log("linearRegression:", linearRegression);

linearRegression.train();
console.log(`Updated M is: ${linearRegression.m}, updated B is: ${linearRegression.b}`);
