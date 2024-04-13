import React from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

const Plot = (): JSX.Element => {
  const [csvData, setCsvData] = React.useState<CsvLocal[]>([]);

  const chartRef = React.useRef(null);

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

  const denormalize = (tensor: tf.Tensor<tf.Rank>, min: tf.Tensor<tf.Rank>, max: tf.Tensor<tf.Rank>): tf.Tensor<tf.Rank> => {
    const denormalizedTensor = tensor.mul(max.sub(min)).add(min);
    return denormalizedTensor;
  };

  React.useEffect(() => {
    (async function takeCsvData() {
      const csvUrl = "/data.csv";
      const csvData = await tf.data.csv(csvUrl, {});
      // console.log("csvData:", csvData);
      const data = await csvData.take(-1);
      const dataArray = (await data.toArray()) as unknown as CsvData[];
      // console.log("dataArray:", dataArray);

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
      normalizedFeature?.tensor.print();
      normalizedLabel?.tensor.print();

      // Denormalize test
      const denormalizeTest: tf.Tensor<tf.Rank> = denormalize(
        normalizedFeature.tensor,
        normalizedFeature.min,
        normalizedFeature.max
      );
      denormalizeTest.print();
    }
  }, [csvData]);

  return (
    <>
      <div ref={chartRef}></div>
    </>
  );
};

export default Plot;
