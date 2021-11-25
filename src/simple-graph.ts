import { DataSet } from 'vis-data';
// import 'vis-timeline/styles/vis-timeline-graph2d.css';
// You may import from other packages like Vis Network or Vis Graph3D here.
// You can optionally include locales for Moment if you need any.

// DOM element where the Timeline will be attached
export const container = document.getElementById('visualization');

// Create a DataSet (allows two way data-binding)
export const items = new DataSet([
  { id: 1, content: 'item 1', start: '2014-04-20' },
  { id: 2, content: 'item 2', start: '2014-04-14' },
  { id: 3, content: 'item 3', start: '2014-04-18' },
  { id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19' },
  { id: 5, content: 'item 5', start: '2014-04-25' },
  { id: 6, content: 'item 6', start: '2014-04-27', type: 'point' },
]);

// Configuration for the Timeline
