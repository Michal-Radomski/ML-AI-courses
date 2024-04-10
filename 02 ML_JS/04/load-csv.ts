import fs from "fs";
import _ from "lodash";
const shuffleSeed = require("shuffle-seed");

function extractColumns(data: any, columnNames: any) {
  const headers = _.first(data);

  const indexes = _.map(columnNames, (column) => (headers as any).indexOf(column));
  const extracted = _.map(data, (row) => _.pullAt(row, indexes));

  return extracted;
}

export const loadCSV = (
  filename: string,
  { dataColumns = [], labelColumns = [], converters = {} as any, shuffle = false, splitTest = false }
) => {
  const data = fs.readFileSync(filename, { encoding: "utf-8" }) as string;

  const data2 = _.map(data.split("\n"), (d) => d.split(",")) as string[][];
  // console.log("data2:", data2);

  const data3 = _.dropRightWhile(data2, (val) => _.isEqual(val, [""]));
  const headers = _.first(data3) as string[];
  // console.log("headers:", headers);

  const data4 = _.map(data3, (row, index) => {
    if (index === 0) {
      return row;
    }
    return _.map(row, (element, index) => {
      if (converters[headers[index]]) {
        const converted = converters[headers[index]](element);
        // console.log("converted:", converted);
        return _.isNaN(converted) ? element : converted;
      }

      const result = parseFloat(element.replace('"', ""));
      return _.isNaN(result) ? element : result;
    });
  });
  console.log("data4:", data4);

  // let labels = extractColumns(data, labelColumns);
  // data = extractColumns(data, dataColumns);

  // data.shift();
  // labels.shift();

  // if (shuffle) {
  //   data = shuffleSeed.shuffle(data, "phrase");
  //   labels = shuffleSeed.shuffle(labels, "phrase");
  // }

  // if (splitTest) {
  //   const trainSize = _.isNumber(splitTest) ? splitTest : Math.floor(data.length / 2);

  //   return {
  //     features: data.slice(trainSize),
  //     labels: labels.slice(trainSize),
  //     testFeatures: data.slice(0, trainSize),
  //     testLabels: labels.slice(0, trainSize),
  //   };
  // } else {
  //   return { features: data, labels };
  // }
};

loadCSV("./data.csv", {});