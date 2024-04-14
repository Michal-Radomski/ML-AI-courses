declare module "tfjs-model-view";

interface CsvData {
  bathrooms: 1;
  bedrooms: 3;
  condition: 3;
  date: string;
  floors: number;
  grade: number;
  id: number;
  lat: number;
  long: number;
  price: number;
  sqft_above: number;
  sqft_basement: number;
  sqft_living: number;
  sqft_living15: number;
  sqft_lot: number;
  sqft_lot15: number;
  view: number;
  waterfront: number;
  yr_built: number;
  yr_renovated: number;
  zipcode: number;
}

interface CsvLocal {
  x: number;
  y: number;
}
