import { DataSet } from 'vis-data';
import moment from 'moment';
import { Graph2d } from 'vis-timeline/standalone';

const DELAY = 1000;

// create a graph2d with an (currently empty) dataset
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
  // shaded: {
  //   orientation: 'bottom' // top, bottom
  // }
};

const graph2d = new Graph2d(container, dataset, options);


export function renderStep(strategy = 'staticcc') {
  // move the window (you can think of different strategies).
  const now = moment().valueOf();
  const range = graph2d.getWindow();
  const interval = range.end - range.start;
  switch (strategy.value) {
    case 'continuous':
      // continuously move the window
      graph2d.setWindow(now - interval, now, { animation: false });
      requestAnimationFrame(renderStep);
      break;

    case 'discrete':
      graph2d.setWindow(now - interval, now, { animation: false });
      setTimeout(renderStep, DELAY);
      break;

    default: // 'static'
      // move the window 90% to the left when now is larger than the end of the window
      if (now > range.end) {
        graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
      }
      setTimeout(renderStep, DELAY);
      break;
  }
}

/**
 * Add a new data-point to the graph
 */
export function addDataPoint(x, y) {
  dataset.add({
    x,
    y
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
}