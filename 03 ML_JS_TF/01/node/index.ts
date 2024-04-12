import * as tf from "@tensorflow/tfjs-node";

// console.log("tf.version", tf.version);
// console.log("tf.getBackend():", tf.getBackend());

// Define a simple model.
// const model = tf.sequential();
// model.add(tf.layers.dense({ units: 100, activation: "relu", inputShape: [10] }));
// model.add(tf.layers.dense({ units: 1, activation: "linear" }));
// model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

// const xs = tf.randomNormal([100, 10]);
// const ys = tf.randomNormal([100, 1]);

// // Train the model.
// model.fit(xs, ys, {
//   epochs: 100,
//   callbacks: {
//     onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log?.loss}`),
//   },
// });

// const scalar = tf.scalar(87);
// const scalar2 = tf.tensor(87);
// const scalar3 = tf.tensor([87]);

// scalar.print();
// scalar2.print();
// scalar3.print();

// tf.tensor1d([1, 2, 3]).print();

// tf.tensor2d([
//   [1, 2, 3],
//   [4, 5, 6],
// ]).print(); //* The same
// tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]).print(); //* The same

// tf.tensor3d([
//   [
//     [1, 2],
//     [3, 4],
//     [5, 6],
//   ],
// ]).print(); //* The same
// tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]).print(); //* The same

// const a = tf.tensor1d([1, 2, 3, 4]);
// const b = tf.tensor1d([10, 20, 30, 40]);
// a.add(b).print(); // or tf.add(a, b)

// const x = tf.tensor1d([1, 2, 4, -1]);
// x.sqrt().print(); // or tf.sqrt(x)

// const a1 = tf.tensor1d([1, 2]);
// const b1 = tf.tensor2d([
//   [1, 2],
//   [3, 4],
// ]);
// const c1 = tf.tensor2d([
//   [1, 2, 3],
//   [4, 5, 6],
// ]);

// //* Tensor operations
// a1.dot(b1).print(); // or tf.dot(a, b)
// b1.dot(a1).print();
// b1.dot(c1).print();

// //* Memory management
// const y = tf.tidy(() => {
//   // a, b, and one will be cleaned up when the tidy ends.
//   const one = tf.scalar(1);
//   const a = tf.scalar(2);
//   const b = a.square();

//   console.log("numTensors (in tidy): " + tf.memory().numTensors);

//   // The value returned inside the tidy function will return through the tidy, in this case to the variable y.
//   return b.add(one);
// });

// console.log("numTensors (outside tidy): " + tf.memory().numTensors);
// y.print();

// console.log("tf.memory():", tf.memory());

//* Exercises
const xs = tf.tensor1d([1, 2, 3]);
const ys = xs.mul(tf.scalar(5));
ys.print();

function getYs(xs: tf.Tensor1D, m: number, c: number) {
  const tensorToReturn = tf
    .tensor([2, 2, 2])
    .mul(xs)
    .add(tf.tensor([1, 1, 1]));
  return tensorToReturn;
}
const t1 = tf.tensor1d([1, 5, 10]);
const t2 = getYs(t1, 2, 1);
t2.print();

const t3 = tf.tensor1d([25, 76, 4, 23, -5, 22]);
const max = t3.max(); //* 76
const min = t3.min(); //* -5
max.print();
min.print();

const original = 23;
const minAsNumber = min.dataSync()[0];
const maxAsNumber = max.dataSync()[0];
const normalized = (original - minAsNumber) / (maxAsNumber - minAsNumber);
console.log({ normalized });

//* https://medium.com/@edoh.dev/data-processing-with-tensorflow-js-b42175e0e86e
function normalize(data: tf.Tensor1D): tf.Tensor1D {
  const dataMax = data.max();
  const dataMin = data.min();
  return data.sub(dataMin).div(dataMax.sub(dataMin));
}
const t4 = normalize(t3);
t4.print();

for (let i = 0; i < 100; i++) {
  const createdTensor = tf.tensor1d([1, 2, 3]);
  createdTensor.dispose();
}
for (let i = 0; i < 100; i++) {
  tf.tidy(() => {
    tf.tensor1d([4, 5, 6]);
    // Be careful not to return the tensor, unless you want it to stay in memory!
  });
}
console.log(tf.memory());
