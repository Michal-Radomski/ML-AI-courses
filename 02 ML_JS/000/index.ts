import _ from "lodash";

const numbersArray = [
  [10, 5],
  [17, 2],
  [34, 1],
  [60, -5],
];

const sortedArrays = _.sortBy(numbersArray, (row) => row[1]);
console.log("sortedArrays:", sortedArrays);

const mappedArrays = _.map(sortedArrays, (row) => row[1]);
console.log("mappedArrays:", mappedArrays);

const mappedArrays2 = _.chain(numbersArray)
  .sortBy((row) => row[1])
  .map((row) => row[1])
  .value();
console.log("mappedArrays2:", mappedArrays2);
