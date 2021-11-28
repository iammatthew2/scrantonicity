import { DataSet } from 'vis-data';
import moment from 'moment';
import { Graph2d } from 'vis-timeline/standalone';

const DELAY = 1000; // delay in ms to add new data points

// create a graph2d with an (currently empty) dataset
// eslint-disable-next-line no-undef
const container = document.getElementById('visualization');
const dataset = new DataSet();

const options = {
  start: moment().add(-30, 'seconds'), // changed so its faster
  end: moment(),
  dataAxis: {
    left: {
      range: {
        min: -10, max: 10
      }
    }
  },
  drawPoints: {
    style: 'circle' // square, circle
  },
  shaded: {
    orientation: 'bottom' // top, bottom
  }
};

const graph2d = new Graph2d(container, dataset, options);

// a function to generate data points
function y(x) {
  return (Math.sin(x / 2) + Math.cos(x / 4)) * 5;
}

export function renderStep() {
  // move the window (you can think of different strategies).
  const now = moment();
  const range = graph2d.getWindow();
  const interval = range.end - range.start;
  graph2d.setWindow(now - interval, now, { animation: false });
  // eslint-disable-next-line no-undef
  setTimeout(renderStep, DELAY);
}
// renderStep();

/**
 * Add a new data-point to the graph
 */
export function addDataPoint() {
  // add a new data point to the dataset
  const now = moment();
  dataset.add({
    x: now,
    y: y(now / 1000)
  });

  // remove all data points which are no longer visible
  const range = graph2d.getWindow();
  const interval = range.end - range.start;
  const oldIds = dataset.getIds({
    filter: function (item) {
      return item.x < range.start - interval;
    }
  });
  dataset.remove(oldIds);

  // eslint-disable-next-line no-undef
  setTimeout(addDataPoint, DELAY);
}
// addDataPoint();