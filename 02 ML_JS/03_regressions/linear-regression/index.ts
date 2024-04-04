import * as tf from "@tensorflow/tfjs-node";

const loadCSV = require("../load-csv");
import LinearRegression from "./linear-regression";

let { features, labels, testFeatures, testLabels } = loadCSV("./cars.csv", {
  shuffle: true,
  splitTest: 50, //* Usually ~50%
  dataColumns: ["horsepower", "weight", "displacement"],
  labelColumns: ["mpg"],
});
// console.log({ features, labels, testFeatures, testLabels });
console.log("LinearRegression:", LinearRegression, typeof LinearRegression);
