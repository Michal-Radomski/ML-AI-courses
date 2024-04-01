require("@tensorflow/tfjs-node");
const tf = require("@tensorflow/tfjs");

const loadCSV = require("./load-csv");

let { features, labels, testFeatures, testLabels } = loadCSV("kc_house_data.csv", {
  shuffle: true,
  splitTest: 10,
  dataColumns: ["lat", "long", "sqft_lot", "sqft_living"],
  labelColumns: ["price"],
});

features = tf.tensor(features);
labels = tf.tensor(labels);
// console.log({ features }, { labels });
console.log({ testFeatures }, { testLabels });
