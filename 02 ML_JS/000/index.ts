import _ from "lodash";

//* Lodash intro
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
  // position, bounciness, ball size, bucket
  [10, 0.5, 16, 1],
  [200, 0.5, 16, 4],
  [350, 0.5, 16, 4],
  [600, 0.5, 16, 5],
];

const predictionPoint = 300;
const k = 3;

function distance(point: number): number {
  return Math.abs(point - predictionPoint);
}

const calculatedRes: number = _.chain(outputs)
  .map((row) => [distance(row[0]), row[3]])
  .sortBy((row) => row[0])
  .slice(0, k)
  .countBy((row) => row[1])
  .toPairs()
  .sortBy((row) => row[1])
  .last()
  .first()
  .parseInt()
  .value();
console.log("calculatedRes:", calculatedRes); // Bucket no 4

//* N-Dimension Distance
const pointA = [1, 1, 1];
const pointB = [5, 5, 5];

const dist =
  _.chain(pointA)
    .zip(pointB)
    .map(([a, b]: [a: number, b: number]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
console.log("dist:", dist);
