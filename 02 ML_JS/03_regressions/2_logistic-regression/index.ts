const plot = require("node-remote-plot");

const loadCSV = require("../load-csv");
import LogisticRegression from "./logistic-regression";

let {
  features,
  labels,
  testFeatures,
  testLabels,
}: { features: number[][]; labels: number[][]; testFeatures: number[][]; testLabels: number[][] } = loadCSV("./cars.csv", {
  shuffle: true,
  splitTest: 50, //* Usually ~50%
  dataColumns: ["horsepower", "weight", "displacement"],
  labelColumns: ["passed_emissions"],
  converters: {
    passed_emissions: (value: string) => {
      return value === "TRUE" ? 1 : 0;
    },
  },
});
// console.log({ features, labels, testFeatures, testLabels });

const logisticRegression = new LogisticRegression(features, labels, {
  learningRate: 0.5,
  iterations: 100,
  batchSize: 10,
});

logisticRegression.train();

console.log(logisticRegression.test(testFeatures, testLabels));

// plot({
//   x: logisticRegression.costHistory.reverse(),
// });
