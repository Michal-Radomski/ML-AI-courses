import _ from "lodash";

const loadData = (): number[] => {
  const randoms = _.range(0, 999999);
  return randoms;
};

const data = loadData();
console.log("data:", data, data.length);

console.log("_.range(0,11):", _.range(0, 11));
