import * as _ from "lodash";
const plot = require("node-remote-plot");
const mnist = require("mnist-data");

import MultinominalLogisticRegression from "./multinominal-logistic-regression";

function loadData(): {
  features: number[][];
  labels: number[][];
} {
  const mnistData = mnist.training(0, 60000);

  const features = mnistData.images.values.map((image: number[][]) => {
    // console.log("image:", image);
    return _.flatMap(image);
  }) as number[][];
  // console.log("features:", features);

  const encodedLabels = mnistData.labels.values.map((label: number) => {
    const row = new Array(10).fill(0);
    row[label] = 1;
    return row;
  }) as number[][];

  return { features, labels: encodedLabels }; //* To trigger Garbage Collection!
}

const { features, labels } = loadData();

const multinominalLogisticRegression = new MultinominalLogisticRegression(features, labels, {
  learningRate: 1,
  iterations: 40,
  batchSize: 500,
});

multinominalLogisticRegression.train();

const testMnistData = mnist.testing(0, 10000);
const testFeatures = testMnistData.images.values.map((image: number[][]) => _.flatMap(image));
const testEncodedLabels = testMnistData.labels.values.map((label: number) => {
  const row = new Array(10).fill(0);
  row[label] = 1;
  return row;
});

const accuracy = multinominalLogisticRegression.test(testFeatures, testEncodedLabels);
console.log("Accuracy is", accuracy);

plot({
  x: multinominalLogisticRegression.costHistory.reverse(),
});
