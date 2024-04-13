import React from "react";
import * as tf from "@tensorflow/tfjs";

const Plot = (): JSX.Element => {
  React.useEffect(() => {
    (async function run() {
      const csvUrl = "/data.csv";
      const csvData = await tf.data.csv(csvUrl, {});
      // console.log("csvData:", csvData);
      const data = await csvData.take(10);
      const dataArray = await data.toArray();
      console.log("dataArray:", dataArray);
    })();
  }, []);

  return <React.Fragment>Plot</React.Fragment>;
};

export default Plot;
