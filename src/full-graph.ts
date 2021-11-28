import { DataSet } from 'vis-data';
import moment from 'moment';
import { Graph2d } from 'vis-timeline/standalone';

const DELAY = 1000; // delay in ms to add new data points

// create a graph2d with an (currently empty) dataset
const container = document.getElementById('visualization');
const dataset = new DataSet();

const options = {
  start: moment().add(-30, 'seconds').valueOf, // changed so its faster
  end: moment().valueOf,
  dataAxis: {
    left: {
      range: {
        min: -10,
        max: 10,
      },
    },
  },
  drawPoints: {
    style: 'circle', // square, circle
  },
  shaded: {
    orientation: 'bottom', // top, bottom
  },
};
const graph2d = new Graph2d(
  container,
  dataset as unknown as DataItem[],
  options as unknown as Graph2dOptions
);

// a function to generate data points
function y(x: number) {
  return (Math.sin(x / 2) + Math.cos(x / 4)) * 5;
}

function renderStep() {
  // move the window (you can think of different strategies).
  const now = moment().valueOf();
  console.log('now is: ', now);
  const range = graph2d.getWindow();
  const interval = range.end.getTime() - range.start.getTime();
  graph2d.setWindow(now - interval, now, { animation: false });
  setTimeout(renderStep, DELAY);
}
renderStep();

/**
 * Add a new datapoint to the graph
 */
function addDataPoint() {
  // add a new data point to the dataset
  const now = moment();
  dataset.add({
    x: now.valueOf,
    y: y(now.valueOf / 1000),
  });

  // remove all data points which are no longer visible
  const range = graph2d.getWindow();
  const interval = range.end.getTime() - range.start.getTime();
  const oldIds = dataset.getIds({
    filter: function (item: { x: number }) {
      return item.x < range.start.getTime() - interval;
    },
  });
  dataset.remove(oldIds);

  setTimeout(addDataPoint, DELAY);
}
addDataPoint();
