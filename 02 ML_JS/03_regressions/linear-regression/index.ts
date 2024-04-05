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
  dataColumns: ["horsepower"],
  labelColumns: ["mpg"],
});
// console.log({ features, labels, testFeatures, testLabels });
// console.log("LinearRegression:", LinearRegression, typeof LinearRegression);

const linearRegression = new LinearRegression(features, labels, {
  learningRate: 0.0001,
  iterations: 100,
});
// console.log("linearRegression:", linearRegression);

linearRegression.train();
// console.log(
//   `Updated M is: ${(linearRegression as any).weights.arraySync()[1]}, updated B is: ${
//     (linearRegression as any).weights.arraySync()[0]
//   }`
// );

linearRegression.test(testFeatures, testLabels);
