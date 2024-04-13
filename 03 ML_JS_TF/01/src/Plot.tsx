import React from "react";
import * as tf from "@tensorflow/tfjs";

const Plot = (): JSX.Element => {
  const [csvData, setCsvData] = React.useState<CsvLocal[]>([]);

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
    if (csvData && csvData.length) {
      console.log("csvData:", csvData);
    }
  }, [csvData]);

  return <React.Fragment>{csvData?.length}</React.Fragment>;
};

export default Plot;
