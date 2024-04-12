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

const scalar = tf.scalar(87);
const scalar2 = tf.tensor(87);
const scalar3 = tf.tensor([87]);

scalar.print();
scalar2.print();
scalar3.print();

tf.tensor1d([1, 2, 3]).print();

tf.tensor2d([
  [1, 2, 3],
  [4, 5, 6],
]).print(); //* The same
tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]).print(); //* The same

tf.tensor3d([
  [
    [1, 2],
    [3, 4],
    [5, 6],
  ],
]).print(); //* The same
tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]).print(); //* The same

const a = tf.tensor1d([1, 2, 3, 4]);
const b = tf.tensor1d([10, 20, 30, 40]);
a.add(b).print(); // or tf.add(a, b)

const x = tf.tensor1d([1, 2, 4, -1]);
x.sqrt().print(); // or tf.sqrt(x)

const a1 = tf.tensor1d([1, 2]);
const b1 = tf.tensor2d([
  [1, 2],
  [3, 4],
]);
const c1 = tf.tensor2d([
  [1, 2, 3],
  [4, 5, 6],
]);

//* Tensor operations
a1.dot(b1).print(); // or tf.dot(a, b)
b1.dot(a1).print();
b1.dot(c1).print();

//* Memory management
const y = tf.tidy(() => {
  // a, b, and one will be cleaned up when the tidy ends.
  const one = tf.scalar(1);
  const a = tf.scalar(2);
  const b = a.square();

  console.log("numTensors (in tidy): " + tf.memory().numTensors);

  // The value returned inside the tidy function will return through the tidy, in this case to the variable y.
  return b.add(one);
});

console.log("numTensors (outside tidy): " + tf.memory().numTensors);
y.print();

console.log("tf.memory():", tf.memory());
