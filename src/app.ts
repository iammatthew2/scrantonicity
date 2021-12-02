import moment from 'moment';
import { webSocketPayload } from './types';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { DataSet } from 'vis-data';
import { DataItem, Graph2d, Graph2dOptions } from 'vis-timeline/standalone';

const container = document.getElementById('visualization');
const dataset = new DataSet();

const options: Graph2dOptions = {
  start: moment().add(-30, 'seconds').valueOf(),
  end: moment().valueOf(),
  dataAxis: {
    left: {
      range: {
        min: -10,
        max: 10,
      },
    },
  },
  drawPoints: {
    style: 'circle',
  },
};

const graph2d = new Graph2d(container, dataset as any as DataItem[], options);

function renderStep(strategy = 'static') {
  const now = moment().valueOf();
  const range = graph2d.getWindow();
  const interval = range.end.getMilliseconds() - range.start.getMilliseconds();
  switch (strategy) {
    case 'continuous':
      // continuously move the window
      graph2d.setWindow(now - interval, now, { animation: false });
      // requestAnimationFrame(() => renderStep);
      break;

    case 'discrete':
      graph2d.setWindow(now - interval, now, { animation: false });
      // setTimeout(renderStep, DELAY);
      break;

    default:
      if (now > range.end.getMilliseconds()) {
        graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
      }
      // setTimeout(renderStep, DELAY);
      break;
  }
}
renderStep();

function handleWebSocketResponse(data: webSocketPayload) {
  dataset.add(data.graphDataPoints[0].x, data.graphDataPoints[0].y);
  renderStep(data.viewState);
}

const ws = new WebSocket('ws://localhost:8030');
ws.onopen = () => {
  console.log('Now connected');
};
ws.onmessage = (event) => {
  console.log('msg received');
  const wsResponse = JSON.parse(event.data);
  handleWebSocketResponse(wsResponse);
};
renderStep();
// const red = (item: number) => {
//   return (Math.sin(item / 2) + Math.cos(item / 4)) * 5;
// };

// setInterval(() => {
//   const now = moment().valueOf();
//   addDataPoint(now, red(now / 1000));
// }, 1000);

//  start web sockets - now receiving data here
// init the graph
// wait for new socket data, add new graph point and/or adjust graph view

// const container = document.getElementById('visualization');
// const dataset = new DataSet();
// const options: Graph2dOptions = {
//   start: moment().add(-30, 'seconds').valueOf(), // changed so its faster
//   end: moment().valueOf(),
//   dataAxis: {
//     left: {
//       range: {
//         min: -10,
//         max: 10,
//       },
//     },
//   },
//   drawPoints: {
//     style: 'circle', // square, circle
//   },
//   shaded: {
//     orientation: 'bottom', // top, bottom
//   },
// };
// const graph2d = new Graph2d(container, dataset as any as DataItem[], options);
// const graph2dx = new Graph2d(container, dataset, options);
// const temp: DataItem = { x: 3, y: 44 };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// dataset.add(temp as any as DataItem[]);
// dataset.add(temp);
// addDataPoint();

// const ws = new WebSocket('ws://localhost:3030');
// ws.onopen = () => {
//   console.log('Now connected');
// };
// ws.onmessage = (event) => {
//   console.log('msg received');
//   const messages = JSON.parse(event.data);
//   messages.forEach(addMessage);
// };
// a function to generate data points
