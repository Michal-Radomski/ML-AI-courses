const plot = require("node-remote-plot");

const loadCSV = require("../load-csv");
import BinaryLogisticRegression from "./binary_logistic-regression";

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

const binaryLogisticRegression = new BinaryLogisticRegression(features, labels, {
  learningRate: 0.5,
  iterations: 100,
  batchSize: 50,
  decisionBoundary: 0.5,
});

binaryLogisticRegression.train();
// binaryLogisticRegression.predict([[130, 307, 1.75]]).print();
// binaryLogisticRegression.predict([[88, 97, 1.065]]).print();

console.log(binaryLogisticRegression.test(testFeatures, testLabels));

plot({
  x: binaryLogisticRegression.costHistory.reverse(),
});
