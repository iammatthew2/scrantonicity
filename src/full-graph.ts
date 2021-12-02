// import { DataSet } from 'vis-data';
// import moment from 'moment';
// import { DataItem, Graph2d } from 'vis-timeline/standalone';

// const DELAY = 1000; // delay in ms to add new data points

// // create a graph2d with an (currently empty) dataset
// const container = document.getElementById('visualization');
// const dataset = new DataSet();

// const options = {
//   start: moment().add(-30, 'seconds').valueOf, // changed so its faster
//   end: moment().valueOf,
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
// const graph2d = new Graph2d(
//   container,
//   dataset as unknown as DataItem[],
//   options as unknown as Graph2dOptions
// );

// // a function to generate data points
// function y(x: number) {
//   return (Math.sin(x / 2) + Math.cos(x / 4)) * 5;
// }

// function renderStep() {
//   // move the window (you can think of different strategies).
//   const now = moment().valueOf();
//   console.log('now is: ', now);
//   const range = graph2d.getWindow();
//   const interval = range.end.getTime() - range.start.getTime();
//   graph2d.setWindow(now - interval, now, { animation: false });
//   setTimeout(renderStep, DELAY);
// }
// renderStep();
// function tempThinkg() {
//   const options = {};

//   const data = new DataSet<Item, 'id'>(options);

//   // add items
//   // note that the data items can contain different properties and data formats
//   data.add([
//     {
//       id: 1,
//       text: 'item 1',
//       date: new Date(2013, 6, 20),
//       group: 1,
//       first: true,
//     },
//     { id: 2, text: 'item 2', date: '2013-06-23', group: 2 },
//     { id: 3, text: 'item 3', date: '2013-06-25', group: 2 },
//     { id: 4, text: 'item 4' },
//   ]);
// }
// // interface Item {
// //   x: number;
// //   y: number;
// // }
// /**
//  * Add a new datapoint to the graph
//  */
// function addDataPoint() {
//   // add a new data point to the dataset
//   const now = moment();
//   dataset.add({
//     x: 1,
//     y: 33,
//   });

//   const temp = { x: 3, y: 44 };

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   dataset.add(temp as any as DataItem[]);

//   // remove all data points which are no longer visible
//   const range = graph2d.getWindow();
//   const interval = range.end.getTime() - range.start.getTime();
//   const oldIds = dataset.getIds({
//     filter: function (item: { x: number }) {
//       return item.x < range.start.getTime() - interval;
//     },
//   });
//   dataset.remove(oldIds);

//   setTimeout(addDataPoint, DELAY);
// }
// addDataPoint();
