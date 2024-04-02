import * as tf from "@tensorflow/tfjs-node";

const loadCSV = require("./load-csv");

function knn(
  features: tf.Tensor<tf.Rank>,
  labels: tf.Tensor<tf.Rank>,
  predictionPoint: tf.Tensor<tf.Rank>,
  k: number
): number {
  // const { mean, variance } = tf.moments(features, 0);
  // const scaledPrediction = predictionPoint.sub(mean).div(variance.pow(0.5));

  return (
    features
      .sub(predictionPoint)
      .pow(2)
      .sum(1)
      .pow(0.5)
      .expandDims(1)
      .concat(labels, 1)
      .unstack()
      .sort((a, b) => (a.arraySync() as number[])[0] - (b.arraySync() as number[])[0])
      .slice(0, k)
      .reduce((acc, pair) => acc + (pair.arraySync() as number[])[1], 0) / k
  );
}

let { features, labels, testFeatures, testLabels } = loadCSV("kc_house_data.csv", {
  shuffle: true,
  splitTest: 10,
  dataColumns: ["lat", "long", "sqft_lot", "sqft_living"],
  labelColumns: ["price"],
});

features = tf.tensor(features);
labels = tf.tensor(labels);
// console.log({ features }, { labels });
// console.log({ testFeatures }, { testLabels });

const result = knn(features, labels, tf.tensor(testFeatures[0]), 10);
console.log("result:", result, testLabels[0][0]);
