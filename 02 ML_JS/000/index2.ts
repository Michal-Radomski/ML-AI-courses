import * as tf from "@tensorflow/tfjs-node";
// console.log("tf:", tf);

const data = tf.tensor([1, 2, 3]);
// console.log("data:", data);
// console.log("data.shape:", data.shape);
const data2 = tf.tensor([4, 5, 6]);
const data3 = data.add(data2);
data3.print();
