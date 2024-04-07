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
  dataColumns: ["horsepower", "displacement", "weight"],
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
  batchSize: 50,
  decisionBoundary: 0.5,
});

logisticRegression.train();
// logisticRegression.predict([[130, 307, 1.75]]).print();
// logisticRegression.predict([[88, 97, 1.065]]).print();

console.log(logisticRegression.test(testFeatures, testLabels));

plot({
  x: logisticRegression.costHistory.reverse(),
});
