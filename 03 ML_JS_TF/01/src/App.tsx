import * as tf from "@tensorflow/tfjs";

import "./App.scss";
import Plot from "./Plot";

interface CustomTensor extends tf.Tensor<tf.Rank> {
  print: () => void;
}

const App = (): JSX.Element => {
  // console.log("tf.version:", tf.version);

  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // Train the model using the data.
  model.fit(xs, ys, { epochs: 10 }).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    const output = model.predict(tf.tensor2d([5], [1, 1])) as CustomTensor;
    //  console.log("output:", output, typeof output);
    output.print();
  });

  // console.log("tf.getBackend():", tf.getBackend());

  return (
    <>
      {/* <h1 className="text-center py-3">Hello Tensorflow</h1> */}
      <Plot />
    </>
  );
};

export default App;
