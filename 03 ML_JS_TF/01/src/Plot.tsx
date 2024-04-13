import React from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

const Plot = (): JSX.Element => {
  const [csvData, setCsvData] = React.useState<CsvLocal[]>([]);

  const chartRef = React.useRef(null);

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
    }
  }, [csvData]);

  return (
    <>
      {csvData?.length}
      <div ref={chartRef}></div>
    </>
  );
};

export default Plot;
