async function plotClasses(pointsArray, classKey, size = 400, equalizeClassSizes = false) {
  const allSeries = {};
  // Add each class as a series
  pointsArray.forEach((p) => {
    // Add each point to the series for the class it is in
    const seriesName = `${classKey}: ${p.class}`;
    let series = allSeries[seriesName];
    if (!series) {
      series = [];
      allSeries[seriesName] = series;
    }
    series.push(p);
  });

  if (equalizeClassSizes) {
    // Find smallest class
    let maxLength = null;
    Object.values(allSeries).forEach((series) => {
      if (maxLength === null || (series.length < maxLength && series.length >= 100)) {
        maxLength = series.length;
      }
    });
    // Limit each class to number of elements of smallest class
    Object.keys(allSeries).forEach((keyName) => {
      allSeries[keyName] = allSeries[keyName].slice(0, maxLength);
      if (allSeries[keyName].length < 100) {
        delete allSeries[keyName];
      }
    });
  }
  //     let csv = "";
  //     Object.values(allSeries).forEach(s => s.forEach(v => csv += `${v.x}, ${v.y}, ${v.class}\n`));
  // console.log(csv);
  tfvis.render.scatterplot(
    {
      name: `Square feet vs House Price`,
      styles: { width: "100%" },
    },
    {
      values: Object.values(allSeries),
      series: Object.keys(allSeries),
    },
    {
      xLabel: "Square feet",
      yLabel: "Price",
      height: size,
      width: size * 1.5,
    }
  );
}

async function plot(pointsArray, featureName, predictedPointsArray = null) {
  const values = [pointsArray.slice(0, 1000)];
  const series = ["original"];
  if (Array.isArray(predictedPointsArray)) {
    values.push(predictedPointsArray);
    series.push("predicted");
  }

  tfvis.render.scatterplot(
    { name: `${featureName} vs House Price` },
    { values, series },
    {
      xLabel: featureName,
      yLabel: "Price",
      height: 300,
    }
  );
}

async function plotPredictionHeatmap(name = "Predicted class", size = 400) {
  const [valuesPromise, xTicksPromise, yTicksPromise] = tf.tidy(() => {
    const gridSize = 50;
    const predictionColumns = [];
    for (let colIndex = 0; colIndex < gridSize; colIndex++) {
      // Loop for each column, starting from the left
      const colInputs = [];
      const x = colIndex / gridSize;
      for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
        // Loop for each row, starting from the top
        const y = (gridSize - rowIndex) / gridSize;
        colInputs.push([x, y]);
      }

      const colPredictions = model.predict(tf.tensor2d(colInputs));
      predictionColumns.push(colPredictions);
    }
    const valuesTensor = tf.stack(predictionColumns);

    const normalisedTicksTensor = tf.linspace(0, 1, gridSize);
    const xTicksTensor = denormalise(normalisedTicksTensor, normalisedFeature.min[0], normalisedFeature.max[0]);
    const yTicksTensor = denormalise(normalisedTicksTensor.reverse(), normalisedFeature.min[1], normalisedFeature.max[1]);

    return [valuesTensor.array(), xTicksTensor.array(), yTicksTensor.array()];
  });

  const values = await valuesPromise;
  const xTicks = await xTicksPromise;
  const yTicks = await yTicksPromise;
  const xTickLabels = xTicks.map((v) => (v / 1000).toFixed(1) + "k sqft");
  const yTickLabels = yTicks.map((v) => "$" + (v / 1000).toFixed(0) + "k");
  const data = {
    values,
    xTickLabels,
    yTickLabels,
  };

  tfvis.render.heatmap(
    {
      name: `${name} (local)`,
      tab: "Predictions",
    },
    data,
    { height: size }
  );
  tfvis.render.heatmap(
    {
      name: `${name} (full domain)`,
      tab: "Predictions",
    },
    data,
    { height: size, domain: [0, 1] }
  );
}

function normalise(tensor, previousMin = null, previousMax = null) {
  const featureDimensions = tensor.shape.length > 1 && tensor.shape[1];

  if (featureDimensions && featureDimensions > 1) {
    // More than one feature

    // Split into separate tensors
    const features = tf.split(tensor, featureDimensions, 1);

    // Normalise and find min/max values for each feature
    const normalisedFeatures = features.map((featureTensor, i) =>
      normalise(featureTensor, previousMin ? previousMin[i] : null, previousMax ? previousMax[i] : null)
    );

    // Prepare return values
    const returnTensor = tf.concat(
      normalisedFeatures.map((f) => f.tensor),
      1
    );
    const min = normalisedFeatures.map((f) => f.min);
    const max = normalisedFeatures.map((f) => f.max);

    return { tensor: returnTensor, min, max };
  } else {
    // Just one feature
    const min = previousMin || tensor.min();
    const max = previousMax || tensor.max();
    const normalisedTensor = tensor.sub(min).div(max.sub(min));
    return {
      tensor: normalisedTensor,
      min,
      max,
    };
  }
}

function denormalise(tensor, min, max) {
  const featureDimensions = tensor.shape.length > 1 && tensor.shape[1];

  if (featureDimensions && featureDimensions > 1) {
    // More than one feature

    // Split into separate tensors
    const features = tf.split(tensor, featureDimensions, 1);

    const denormalised = features.map((featureTensor, i) => denormalise(featureTensor, min[i], max[i]));

    const returnTensor = tf.concat(denormalised, 1);
    return returnTensor;
  } else {
    // Just one feature
    const denormalisedTensor = tensor.mul(max.sub(min)).add(min);
    return denormalisedTensor;
  }
}

let model;
function createModel() {
  model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 10,
      useBias: true,
      activation: "sigmoid",
      inputDim: 2,
    })
  );
  model.add(
    tf.layers.dense({
      units: 10,
      useBias: true,
      activation: "sigmoid",
    })
  );
  model.add(
    tf.layers.dense({
      units: 1,
      useBias: true,
      activation: "sigmoid",
    })
  );

  const optimizer = tf.train.adam();
  model.compile({
    loss: "binaryCrossentropy", //* For Binary Classification
    optimizer,
  });

  return model;
}

async function trainModel(model, trainingFeatureTensor, trainingLabelTensor) {
  const { onBatchEnd, onEpochEnd } = tfvis.show.fitCallbacks({ name: "Training Performance" }, ["loss"]);

  return model.fit(trainingFeatureTensor, trainingLabelTensor, {
    batchSize: 32,
    epochs: 2000,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd,
      onEpochBegin: async function () {
        await plotPredictionHeatmap();
        const layer = model.getLayer(undefined, 0);
        tfvis.show.layer({ name: "Layer 1" }, layer);
      },
    },
  });
}

async function predict() {
  const predictionInputOne = parseInt(document.getElementById("prediction-input-1").value);
  const predictionInputTwo = parseInt(document.getElementById("prediction-input-2").value);
  if (isNaN(predictionInputOne) || isNaN(predictionInputTwo)) {
    alert("Please enter a valid number");
  } else if (predictionInputOne < 200) {
    alert("Please enter a value above 200 sqft");
  } else if (predictionInputTwo < 75000) {
    alert("Please enter a value above $75,000");
  } else {
    tf.tidy(() => {
      const inputTensor = tf.tensor2d([[predictionInputOne, predictionInputTwo]]);
      const normalisedInput = normalise(inputTensor, normalisedFeature.min, normalisedFeature.max);
      const normalisedOutputTensor = model.predict(normalisedInput.tensor);
      const outputTensor = denormalise(normalisedOutputTensor, normalisedLabel.min, normalisedLabel.max);
      const outputValue = outputTensor.dataSync()[0];
      const outputValuePercent = (outputValue * 100).toFixed(1);
      document.getElementById("prediction-output").innerHTML =
        `The likelihood of being a waterfront property is <br>` +
        `<span style="font-size: 2em">${outputValuePercent}%</span>`;
    });
  }
}

const storageID = "kc-house-price-binary";
async function save() {
  const saveResults = await model.save(`localstorage://${storageID}`);
  document.getElementById("model-status").innerHTML = `Trained (saved ${saveResults.modelArtifactsInfo.dateSaved})`;
}

async function load() {
  const storageKey = `localstorage://${storageID}`;
  const models = await tf.io.listModels();
  const modelInfo = models[storageKey];
  if (modelInfo) {
    model = await tf.loadLayersModel(storageKey);

    await plotPredictionHeatmap();
    tfvis.show.modelSummary({ name: "Model summary" }, model);
    const layer = model.getLayer(undefined, 0);
    tfvis.show.layer({ name: "Layer 1" }, layer);

    document.getElementById("model-status").innerHTML = `Trained (saved ${modelInfo.dateSaved})`;
    document.getElementById("predict-button").removeAttribute("disabled");
  } else {
    alert("Could not load: no saved model found");
  }
}

async function test() {
  const lossTensor = model.evaluate(testingFeatureTensor, testingLabelTensor);
  const loss = (await lossTensor.dataSync())[0];
  console.log(`Testing set loss: ${loss}`);

  document.getElementById("testing-status").innerHTML = `Testing set loss: ${loss.toPrecision(5)}`;
}

async function train() {
  // Disable all buttons and update status
  ["train", "test", "load", "predict", "save"].forEach((id) => {
    document.getElementById(`${id}-button`).setAttribute("disabled", "disabled");
  });
  document.getElementById("model-status").innerHTML = "Training...";

  const model = createModel();
  tfvis.show.modelSummary({ name: "Model summary" }, model);
  const layer = model.getLayer(undefined, 0);
  tfvis.show.layer({ name: "Layer 1" }, layer);

  const result = await trainModel(model, trainingFeatureTensor, trainingLabelTensor);
  await plotPredictionHeatmap();
  console.log(result);
  const trainingLoss = result.history.loss.pop();
  console.log(`Training set loss: ${trainingLoss}`);
  const validationLoss = result.history.val_loss.pop();
  console.log(`Validation set loss: ${validationLoss}`);

  document.getElementById("model-status").innerHTML =
    "Trained (unsaved)\n" + `Loss: ${trainingLoss.toPrecision(5)}\n` + `Validation loss: ${validationLoss.toPrecision(5)}`;
  document.getElementById("test-button").removeAttribute("disabled");
  document.getElementById("save-button").removeAttribute("disabled");
  document.getElementById("predict-button").removeAttribute("disabled");
}

async function plotParams(weight, bias) {
  model.getLayer(null, 0).setWeights([
    tf.tensor2d([[weight]]), // Kernel (input multiplier)
    tf.tensor1d([bias]), // Bias
  ]);
  await plotPredictionLine();
  const layer = model.getLayer(undefined, 0);
  tfvis.show.layer({ name: "Layer 1" }, layer);
}

async function toggleVisor() {
  tfvis.visor().toggle();
}

let points;
let normalisedFeature, normalisedLabel;
let trainingFeatureTensor, testingFeatureTensor, trainingLabelTensor, testingLabelTensor;
(async function run() {
  // Ensure backend has initialized
  await tf.ready();

  // Import from CSV
  const fetchUrl = "http://localhost:8080/data.csv";

  // Import from CSV
  const houseSalesDataset = tf.data.csv(fetchUrl, {});

  // Extract x and y values to plot
  const pointsDataset = houseSalesDataset.map((record) => ({
    x: record.sqft_living,
    y: record.price,
    class: record.waterfront,
  }));
  points = await pointsDataset.toArray();
  if (points.length % 2 !== 0) {
    // If odd number of elements
    points.pop(); // remove one element
  }
  console.log(points);
  tf.util.shuffle(points);
  plotClasses(points, "Waterfront");

  // Extract Features (inputs)
  const featureValues = points.map((p) => [p.x, p.y]);
  const featureTensor = tf.tensor2d(featureValues);

  // Extract Labels (outputs)
  const labelValues = points.map((p) => p.class);
  const labelTensor = tf.tensor2d(labelValues, [labelValues.length, 1]);

  // Normalise features and labels
  normalisedFeature = normalise(featureTensor);
  normalisedLabel = normalise(labelTensor);
  featureTensor.dispose();
  labelTensor.dispose();

  [trainingFeatureTensor, testingFeatureTensor] = tf.split(normalisedFeature.tensor, 2);
  [trainingLabelTensor, testingLabelTensor] = tf.split(normalisedLabel.tensor, 2);

  // Update status and enable train button
  document.getElementById("model-status").innerHTML = "No model trained";
  document.getElementById("train-button").removeAttribute("disabled");
  document.getElementById("load-button").removeAttribute("disabled");
})();
