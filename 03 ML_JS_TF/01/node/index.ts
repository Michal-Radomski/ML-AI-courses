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
