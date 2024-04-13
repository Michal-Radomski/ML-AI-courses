import React from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

const Plot = (): JSX.Element => {
  const [csvData, setCsvData] = React.useState<CsvLocal[]>([]);

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

    const optimizer = tf.train.sgd(0.1);
    model.compile({
      loss: "meanSquaredError",
      optimizer,
    });

    return model;
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
      const data = await csvData.take(-1);

      //* V1
      // const dataArray = (await data.toArray()) as unknown as CsvData[];
      // console.log("dataArray:", dataArray);

      //* V2 - recommended!
      const dataArray = [] as CsvData[];
      await data.forEachAsync((elem) => {
        return dataArray.push(elem as unknown as CsvData);
      });
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
      const model = createModel();
      console.log("model:", model);
      tfvis.show.modelSummary({ name: "Model summary" }, model);
    }
  }, [csvData]);

  return (
    <>
      <div ref={chartRef}></div>
    </>
  );
};

export default Plot;
