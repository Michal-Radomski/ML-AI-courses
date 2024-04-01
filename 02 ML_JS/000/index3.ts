import * as tf from "@tensorflow/tfjs-node";

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
