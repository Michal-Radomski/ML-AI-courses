import * as tf from "@tensorflow/tfjs-node";

// const test = [{ value: 20 }, { value: 30 }, { value: 15 }, { value: 5 }];
// const testSorted = test.sort((a, b) => a.value - b.value);
// console.log(testSorted); //* [ { value: 5 }, { value: 15 }, { value: 20 }, { value: 30 } ]
// const testSorted2 = test.sort((a, b) => {
//   return a.value > b.value ? 1 : -1;
// });
// console.log(testSorted2); //* [ { value: 5 }, { value: 15 }, { value: 20 }, { value: 30 } ]
// const testSum = test.reduce((acc, obj) => acc + obj.value, 0);
// console.log("testSum/test.length:", testSum / test.length);

//* The k-nearest neighbors (KNN) algorithm
const k = 2;
const features = tf.tensor([
  [-121, 47],
  [-121.2, 46.5],
  [-122, 46.4],
  [-120.9, 46.7],
]);

const labels = tf.tensor([[200], [250], [215], [240]]);

const predictionPoint = tf.tensor([[-121, 47]]);

const distances = features.sub(predictionPoint).pow(2).sum(1).pow(0.5);
// distances.print();

const tsData =
  distances
    .expandDims(1)
    .concat(labels, 1)
    .unstack()
    .sort((a, b) => (a.arraySync() as number[])[0] - (b.arraySync() as number[])[0])
    .slice(0, k)
    .reduce((acc, pair) => acc + (pair.arraySync() as number[])[1], 0) / k;

console.log("tsData:", tsData);

//* Standardization
const numbers = tf.tensor([
  [1, 2],
  [3, 4],
  [5, 6],
]);

const { mean, variance } = tf.moments(numbers, 0);
// mean.print();
// variance.print();
numbers.sub(mean).div(variance.pow(0.5)).print();
//    [[-1.2247448, -1.2247448],
//    [0         , 0         ],
//    [1.2247448 , 1.2247448 ]]

const onesTensor = tf.ones([2, 2], "int32");
onesTensor.print();
const zerosTensor = tf.zeros([2, 2], "float32");
zerosTensor.print();

const tensor1 = tf.tensor([1, 2, 3, 4, 5]);
tensor1.div(5).print();

const a = tf.tensor([
  [1, 2, 3, 4],
  [5, 6, 7, 8],
]);
a.transpose().print(); // or tf.transpose(a)

const b = a.sum().arraySync() as number;
console.log("b:", b);

const c = a.mean();
c.print();
