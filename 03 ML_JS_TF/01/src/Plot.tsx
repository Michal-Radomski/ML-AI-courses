import React from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
// import * as ModelView from "tfjs-model-view";

const Plot = (): JSX.Element => {
  const [csvData, setCsvData] = React.useState<CsvLocal[]>([]);
  // const [tensorModel, setTensorModel] = React.useState<tf.Sequential>();

  const chartRef = React.useRef(null);

  //* Normalize data
  const normalize = (
    tensor: tf.Tensor2D
  ): {
    tensor: tf.Tensor<tf.Rank>;
    min: tf.Tensor<tf.Rank>;
    max: tf.Tensor<tf.Rank>;
  } => {
    const min = tensor.min();
    const max = tensor.max();
    const normalizedTensor = tensor.sub(min).div(max.sub(min));
    return {
      tensor: normalizedTensor,
      min,
      max,
    };
  };

  //* Denormalize Data
  // const denormalize = (tensor: tf.Tensor<tf.Rank>, min: tf.Tensor<tf.Rank>, max: tf.Tensor<tf.Rank>): tf.Tensor<tf.Rank> => {
  //   const denormalizedTensor = tensor.mul(max.sub(min)).add(min);
  //   return denormalizedTensor;
  // };

  //* Create a Model
  const createModel = (): tf.Sequential => {
    const model: tf.Sequential = tf.sequential();

    model.add(
      tf.layers.dense({
        units: 1,
        useBias: true,
        activation: "linear",
        inputDim: 1,
      })
    );

    const optimizer: tf.SGDOptimizer = tf.train.sgd(0.1); //* Stochastic Gradient Descent (SGD)
    model.compile({
      loss: "meanSquaredError",
      optimizer: optimizer,
    });

    return model;
  };

  const trainModel = async (
    model: tf.Sequential,
    trainingFeatureTensor: tf.Tensor<tf.Rank>,
    trainingLabelTensor: tf.Tensor<tf.Rank>
  ): Promise<tf.History> => {
    const { onBatchEnd, onEpochEnd } = tfvis.show.fitCallbacks({ name: "Training Performance" }, ["loss"]) as any;

    return model.fit(trainingFeatureTensor, trainingLabelTensor, {
      batchSize: 32,
      epochs: 20,
      validationSplit: 0.2,
      callbacks: {
        // onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: los = ${logs?.loss}`),
        onEpochEnd,
        onBatchEnd,
        // onEpochBegin: function () {
        //   tfvis.show.layer({ name: `Layer 1` }, model.getLayer(undefined as any, 0));
        // },
        // onBatchBegin(batch, logs) {
        //   console.log(`Epoch ${batch}: los = ${logs?.loss}`);
        // },
      },
    });
  };

  //* Import data from data.csv and set local state
  React.useEffect(() => {
    // tf.ready().then(() => {
    //   console.log("tf.backend():", tf.backend());
    // });

    (async function takeCsvData() {
      const csvUrl = "/data.csv";
      const csvData = await tf.data.csv(csvUrl, {});
      // console.log("csvData:", csvData);
      // const data = await csvData.take(-1); //* The whose set
      const data = await csvData.take(1000); //* 1k elems

      //* V1
      const dataArray = (await data.toArray()) as unknown as CsvData[];
      // console.log("dataArray:", dataArray);

      //* V2 - recommended!
      // const dataArray = [] as CsvData[];
      // await data.forEachAsync((elem) => {
      //   return dataArray.push(elem as unknown as CsvData);
      // });
      // console.log("dataArray:", dataArray);

      if (dataArray.length % 2 !== 0) {
        dataArray.pop();
      }

      //* Shuffle data
      tf.util.shuffle(dataArray);

      const points: CsvLocal[] = await dataArray.map((elem: CsvData) => {
        return {
          x: elem.sqft_living,
          y: elem.price,
        };
      });
      // console.log("points:", points);
      setCsvData(points);
    })();
  }, []);

  //* Print scatter chart
  React.useEffect(() => {
    if (!chartRef) return;
    if (chartRef?.current && csvData && csvData.length) {
      const featureName = "Square feet";
      tfvis.render.scatterplot(
        { name: `${featureName} vs House Price` },
        { values: [csvData], series: ["original"] },
        {
          xLabel: featureName,
          yLabel: "Price",
        }
      );

      // Extract Features (inputs)
      const featureValues = csvData.map((elem) => elem.x) as number[];
      const featureTensor = tf.tensor2d(featureValues, [featureValues.length, 1]) as tf.Tensor2D;

      // Extract Labels (outputs)
      const labelValues = csvData.map((elem) => elem.y) as number[];
      const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]) as tf.Tensor2D;
      // featureTensor.print();
      // labelTensor.print();

      // Normalize features and labels
      const normalizedFeature = normalize(featureTensor);
      const normalizedLabel = normalize(labelTensor);
      // normalizedFeature?.tensor.print();
      // normalizedLabel?.tensor.print();

      const [trainingFeatureTensor, testingFeatureTensor] = tf.split(normalizedFeature.tensor, 2);
      const [trainingLabelTensor, testingLabelTensor] = tf.split(normalizedLabel.tensor, 2);

      //* Denormalize test only!
      // const denormalizeTest: tf.Tensor<tf.Rank> = denormalize(
      //   normalizedFeature.tensor,
      //   normalizedFeature.min,
      //   normalizedFeature.max
      // );
      // denormalizeTest.print();

      //* Scatter Plot: denormalized data
      // (async function () {
      //   const normalizedDataX = Array.from(normalizedFeature.tensor.dataSync()).flat(1);
      //   const normalizedDataY = Array.from(normalizedLabel.tensor.dataSync()).flat(1);
      //   // console.log(normalizedDataX.length === normalizedDataY.length);
      //   const arrayLength = Math.min(normalizedDataX.length, normalizedDataY.length);
      //   // console.log({ arrayLength });
      //   const normalizedData = [] as CsvLocal[];
      //   for (let i = 0; i < arrayLength; i++) {
      //     const obj = {
      //       x: normalizedDataX[i],
      //       y: normalizedDataY[i],
      //     };
      //     normalizedData.push(obj);
      //   }

      //   normalizedData.length &&
      //     tfvis.render.scatterplot(
      //       { name: `${featureName}Normalized vs House Price` },
      //       { values: [normalizedData], series: ["normalized"] },
      //       {
      //         xLabel: featureName + "Normalized",
      //         yLabel: "Price",
      //       }
      //     );
      // })();

      //* Model

      const model: tf.Sequential = createModel();
      // setTensorModel(model);
      // console.log("model:", model);
      // model.summary();

      tfvis.show.modelSummary({ name: "Model summary" }, model);

      const layer = model.getLayer(undefined as any, 0);
      tfvis.show.layer({ name: "Layer 1" }, layer);

      (async function () {
        const result = await trainModel(model, trainingFeatureTensor, trainingLabelTensor);
        console.log("result:", result);
        const trainingLoss = result.history.loss.pop();
        console.log(`Training set loss: ${trainingLoss}`);
        const validationLoss = result.history.val_loss.pop();
        console.log(`Validation set loss: ${validationLoss}`);

        const lossTensor = model.evaluate(testingFeatureTensor, testingLabelTensor);
        // console.log("lossTensor:", lossTensor);
        const loss = await lossTensor.toString();
        console.log(`Testing set loss: ${loss}`);
      })();
    }
  }, [csvData]);

  //* Model Visualization - doesn't work!
  // React.useEffect(() => {
  //   if (!tensorModel) return;
  //   if (tensorModel) {
  //     // console.log("tensorModel:", tensorModel);
  //     const modelView = new ModelView(tensorModel, {
  //       printStats: true,
  //       radius: 25,
  //       renderLinks: true,
  //       xOffset: 100,
  //       renderNode(ctx: CanvasRenderingContext2D, node: { x: number; y: number; value: number }) {
  //         const { x, y, value } = node;
  //         ctx.font = "10px Arial";
  //         ctx.fillStyle = "#000";
  //         ctx.textAlign = "center";
  //         ctx.textBaseline = "middle";
  //         ctx.fillText(String(Math.round(value * 100) / 100), x, y);
  //       },
  //       onBeginRender: (renderer: { width?: any; renderContext?: any }) => {
  //         const { renderContext } = renderer;
  //         renderContext.fillStyle = "#000";
  //         renderContext.textAlign = "end";
  //         renderContext.font = "12px Arial";
  //         renderContext.fillText("Sepal Length (cm)", 110, 110);
  //         renderContext.fillText("Sepal Width (cm)", 110, 136);
  //         renderContext.fillText("Petal Length (cm)", 110, 163);
  //         renderContext.fillText("Petal Width (cm)", 110, 190);

  //         renderContext.textAlign = "start";
  //         renderContext.fillText("Setosa", renderer.width - 60, 95);
  //         renderContext.fillText("Versicolor", renderer.width - 60, 150);
  //         renderContext.fillText("Virginica", renderer.width - 60, 205);
  //       },
  //       layer: {
  //         dense_Dense1_input: {
  //           domain: [0, 8],
  //           color: [165, 130, 180],
  //         },
  //         "dense_Dense1/dense_Dense1": {
  //           color: [125, 125, 125],
  //         },
  //         "dense_Dense2/dense_Dense2": {
  //           color: [125, 125, 125],
  //         },
  //         "dense_Dense3/dense_Dense3": {
  //           nodePadding: 30,
  //         },
  //       },
  //     });
  //     console.log("modelView:", modelView, typeof modelView);
  //   }
  // }, [tensorModel]);

  return (
    <>
      <div ref={chartRef}></div>
    </>
  );
};

export default Plot;
