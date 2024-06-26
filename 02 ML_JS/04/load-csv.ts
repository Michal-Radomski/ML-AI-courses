import fs from "fs";
import _ from "lodash";
const shuffleSeed = require("shuffle-seed");

function extractColumns(data: string[][], columnNames: string[]) {
  const headers = _.first(data) as string[];

  const indexes = _.map(columnNames, (column) => headers.indexOf(column));
  const extracted = _.map(data, (row) => _.pullAt(row, indexes));
  // console.log("extracted:", extracted);

  return extracted;
}

interface Converters {
  [key: string]: (value: string) => string | number | boolean;
}

const loadCSV = (
  filename: string,
  {
    dataColumns = [] as string[],
    labelColumns = [] as string[],
    converters = {} as Converters,
    shuffle = false,
    splitTest = false as boolean | number,
  }
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
  }) as string[][];
  // console.log("data4:", data4);

  let labels = extractColumns(data4, labelColumns) as string[][];
  let dataToReturn = extractColumns(data4, dataColumns) as string[][];
  // console.log({ labels, dataToReturn });

  dataToReturn.shift();
  labels.shift();

  if (shuffle) {
    dataToReturn = shuffleSeed.shuffle(data, "phrase");
    labels = shuffleSeed.shuffle(labels, "phrase");
  }

  if (splitTest) {
    const trainSize = _.isNumber(splitTest) ? splitTest : Math.floor(dataToReturn?.length / 2);
    // console.log({ trainSize });

    return {
      features: dataToReturn?.slice(0, trainSize),
      labels: labels?.slice(0, trainSize),
      testFeatures: dataToReturn?.slice(trainSize),
      testLabels: labels?.slice(trainSize),
    };
  } else {
    return { features: data, labels };
  }
};

const { features, labels, testFeatures, testLabels } = loadCSV("./data.csv", {
  shuffle: false,
  splitTest: 1,
  dataColumns: ["id", "height", "value"],
  labelColumns: ["passed"],
  converters: { passed: (val) => (val === "TRUE" ? 1 : 0) },
});

console.log({ features, labels, testFeatures, testLabels });
