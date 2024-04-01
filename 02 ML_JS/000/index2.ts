import * as tf from "@tensorflow/tfjs-node";
// console.log("tf:", tf);

// const data = tf.tensor([
//   [1, 2, 3],
//   [4, 5, 6],
// ]);
// // console.log("data:", data);
// // console.log("data.shape:", data.shape);
// const data2 = tf.tensor([
//   [4, 5, 6],
//   [1, 2, 3],
// ]);
// const data3 = data.add(data2);
// data3.print();

// const data4 = data.sub(data2);
// data4.print();
// const data5 = data.mul(data2);
// data5.print();
// const data6 = data.div(data2);
// data6.print();

// const data1 = tf.tensor([1, 2, 3]);
// const data2 = tf.tensor([4]);
// const data3 = data1.add(data2);
// data3.print();

// const data = tf.tensor([1, 1]);
// const otherData = tf.tensor([1]);
// data.sub(otherData).print();

const data = tf.tensor([
  [1, 1, 1],
  [2, 2, 2],
]);
const otherData: tf.Tensor<tf.Rank> = tf.tensor([[1, 1, 1]]);
const newData = data.add(otherData);
console.log("newData:", newData);
newData.print();
