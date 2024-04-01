import * as tf from "@tensorflow/tfjs-node";

// const test = [{ value: 20 }, { value: 30 }, { value: 15 }, { value: 5 }];
// const testSorted = test.sort((a, b) => a.value - b.value);
// console.log(testSorted); //* [ { value: 5 }, { value: 15 }, { value: 20 }, { value: 30 } ]
// const testSorted2 = test.sort((a, b) => {
//   return a.value > b.value ? 1 : -1;
// });
// console.log(testSorted2); //* [ { value: 5 }, { value: 15 }, { value: 20 }, { value: 30 } ]

const features = tf.tensor([
  [-121, 47],
  [-121.2, 46.5],
  [-122, 46.4],
  [-120.9, 46.7],
]);

const labels = tf.tensor([[200], [250], [215], [240]]);

const predictionPoint = tf.tensor([[-121, 47]]);

const distances = features.sub(predictionPoint).pow(2).sum(1).pow(0.5);
distances.print();

const tsData = distances
  .expandDims(1)
  .concat(labels, 1)
  .unstack()
  .sort((a, b) => (a.arraySync() as number[])[0] - (b.arraySync() as number[])[0]);

console.log("tsData:", tsData);
