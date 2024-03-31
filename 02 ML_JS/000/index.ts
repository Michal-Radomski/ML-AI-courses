import _ from "lodash";

// const numbersArray = [
//   [10, 5],
//   [17, 2],
//   [34, 1],
//   [60, -5],
// ];

// const sortedArrays = _.sortBy(numbersArray, (row) => row[1]);
// console.log("sortedArrays:", sortedArrays);

// const mappedArrays = _.map(sortedArrays, (row) => row[1]);
// console.log("mappedArrays:", mappedArrays);

// const mappedArrays2 = _.chain(numbersArray)
//   .sortBy((row) => row[1])
//   .map((row) => row[1])
//   .value();
// console.log("mappedArrays2:", mappedArrays2);

//* KNN Algorithm
const outputs = [
  [10, 0.5, 16, 1],
  [200, 0.5, 16, 4],
  [350, 0.5, 16, 4],
  [600, 0.5, 16, 5],
];

const predictionPoint = 300;

function distance(point: number): number {
  return Math.abs(point - predictionPoint);
}

const calculatedRes = _.chain(outputs)
  .map((row) => [distance(row[0]), row[3]])
  .sortBy((row) => row[0])
  .slice(0, 3)
  .value();
console.log("calculatedRes:", calculatedRes);
