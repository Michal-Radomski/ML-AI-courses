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

const a: tf.Tensor<tf.Rank> = tf.tensor([
  [1, 2, 3, 4],
  [5, 6, 7, 8],
]);
a.transpose().print(); // or tf.transpose(a)

const b = a.sum().arraySync() as number;
console.log("b:", b);

const c: tf.Tensor<tf.Rank> = a.mean();
c.print();

{
  //* Standardization
  const features = tf.tensor([[10], [20], [35], [95]]);
  const { mean, variance } = tf.moments(features, 0);
  const testTensor: tf.Tensor<tf.Rank> = features.sub(mean).div(variance.pow(0.5));
  testTensor.print();

  const testFeatures = tf.tensor([[15], [25]]);
  const testTensor2: tf.Tensor<tf.Rank> = testFeatures.sub(mean).div(variance.pow(0.5));
  testTensor2.print();

  const testTensor3 = tf.tensor([1, 1]).add(1e-7);
  testTensor3.print();

  const test4 = tf.ones([10, 1]);
  test4.print();
  const testTensor4: tf.Tensor<tf.Rank> = test4.sub(mean).div(variance.pow(0.5));
  testTensor4.print();
  testTensor4.add(1e-7).print();
}

//* Slice
const test5 = tf.tensor([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
  [16, 17, 18],
]);
const test6 = test5.slice([0, 0], [3, -1]);
const test7 = test5.slice([3, 0], [3, -1]);
test6.print();
test7.print();

{
  //* Sigmoid
  const weights = tf.tensor([[1], [1]]);
  const features = tf.tensor([
    [1, 95],
    [1, 120],
    [1, 135],
    [1, 175],
  ]);

  const sigmoidTensor = features.matMul(weights).sigmoid();
  sigmoidTensor.print();
}

const prob = tf.tensor([[0.1], [0.2], [0.4], [0.8], [0.95]]);
prob.greater(0.5).print();

//* Log
const y = tf.tensor1d([1, 15, 38, Math.E]);
y.log().print();

{
  //* Softmax + argMax/argMin
  const weights = tf.tensor([[1], [1]]);
  const features = tf.tensor([
    [1, 95],
    [1, 120],
    [1, 135],
    [1, 175],
  ]);

  const softmaxTensor = features.matMul(weights).softmax();
  softmaxTensor.print();

  const resMax = features.argMax(0);
  resMax.print();
  const resMin = features.argMin(0);
  resMin.print();
}
