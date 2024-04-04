import * as tf from "@tensorflow/tfjs-node";

const loadCSV = require("../load-csv");

let { features, labels, testFeatures, testLabels } = loadCSV("./cars.csv", {
  shuffle: true,
  splitTest: 50,
  dataColumns: ["horsepower", "weight", "displacement"],
  labelColumns: ["mpg"],
});
// console.log({ features, labels, testFeatures, testLabels });
