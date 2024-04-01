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
// const data5 = data.mul(data2); //* Hadamard Product
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

// const data = tf.tensor([
//   [1, 1, 1],
//   [2, 2, 2],
// ]);
// const otherData: tf.Tensor<tf.Rank> = tf.tensor([[1, 1, 1]]);
// const newData = data.add(otherData);
// console.log("newData:", newData);
// newData.print();

//* Multiplication
// const A = tf.tensor([
//   [1, 2, 3],
//   [4, 5, 6],
// ]);
// const B = tf.tensor([
//   [1, 2],
//   [3, 1],
//   [2, 3],
// ]);
// const result = tf.matMul(A, B);
// result.print()

//* Tensor Accessors
// const data1 = tf.tensor([10, 20, 30]);
// const data1array = data1.arraySync() as number[];
// console.log("data1array[0]:", data1array[0]);

// const data2 = tf.tensor([
//   [1, 2, 3],
//   [4, 5, 6],
// ]);
// const data2array = data2.arraySync() as number[][];
// console.log("data2array[0][0]:", data2array[0][0]);

//* Slices of Data
// const data2 = tf.tensor([
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
//   [10, 11, 12],
//   [13, 14, 15],
//   [16, 17, 18],
// ]);
// const data2Slice = data2.slice([0, 1], [6, 1]); //* Give the same results!
// const data2SliceV2 = data2.slice([0, 1], [-1, 1]); //* Give the same results!
// console.log("data2.shape:", data2.shape); // [6,3]
// data2Slice.print();
// data2SliceV2.print();

//* Tensor Concatenation
const A = tf.tensor([
  [1, 2, 3],
  [4, 5, 6],
]);
const B = tf.tensor([
  [13, 14, 15],
  [16, 17, 18],
]);
const C = A.concat(B, 0);
console.log("C.shape:", C.shape); // [4,3]
// [[1 , 2 , 3 ],
// [4 , 5 , 6 ],
// [13, 14, 15],
// [16, 17, 18]]

C.print();
const D = A.concat(B, 1);
console.log("C.shape:", D.shape); // [2,6]
D.print();
// [[1, 2, 3, 13, 14, 15],
// [4, 5, 6, 16, 17, 18]]
