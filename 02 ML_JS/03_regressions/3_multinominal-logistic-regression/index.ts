import * as _ from "lodash";
// const plot = require("node-remote-plot");

const loadCSV = require("../load-csv");
import MultinominalLogisticRegression from "./multinominal-logistic-regression";

let {
  features,
  labels,
  testFeatures,
  testLabels,
}: { features: number[][]; labels: number[][][]; testFeatures: number[][]; testLabels: number[][] } = loadCSV("./cars.csv", {
  shuffle: true,
  splitTest: 50, //* Usually ~50%
  dataColumns: ["horsepower", "displacement", "weight"],
  labelColumns: ["mpg"],
  converters: {
    mpg: (value: string) => {
      const mpg = parseFloat(value);
      if (mpg < 15) {
        return [1, 0, 0];
      } else if (mpg < 30) {
        return [0, 1, 0];
      } else {
        return [0, 0, 1];
      }
    },
  },
});
// console.log("_.flatMap(labels):", _.flatMap(labels));

const multinominalLogisticRegression = new MultinominalLogisticRegression(features, _.flatMap(labels), {
  learningRate: 0.5,
  iterations: 100,
  batchSize: 10,
});

multinominalLogisticRegression.weights.print();

multinominalLogisticRegression.train();
// multinominalLogisticRegression.predict([[215, 440, 2.16]]).print();
multinominalLogisticRegression.predict([[150, 200, 2.223]]).print();
