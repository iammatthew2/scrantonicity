import { magic } from './magic';
import { Timeline } from 'vis-timeline/standalone';
import { container, items } from './simple-graph';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

console.log('imports are working they really are ');
console.log(magic);

debugger;

// Create a Timeline
const timeline = new Timeline(container, items, {});
