import * as tf from "@tensorflow/tfjs-node";
// console.log("tf:", tf);

const data = tf.tensor([
  [1, 2, 3],
  [4, 5, 6],
]);
// console.log("data:", data);
// console.log("data.shape:", data.shape);
const data2 = tf.tensor([
  [4, 5, 6],
  [1, 2, 3],
]);
const data3 = data.add(data2);
data3.print();

const data4 = data.sub(data2);
data4.print();
const data5 = data.mul(data2);
data5.print();
const data6 = data.div(data2);
data6.print();
