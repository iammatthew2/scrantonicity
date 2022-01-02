import { webSocketPayload, viewState } from './types';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { DataSet } from 'vis-data';
import { DataItem, Graph2d, Graph2dOptions } from 'vis-timeline/standalone';

const container = document.getElementById('visualization');
const dataset = new DataSet();

const adjustedViewportHeight = () => window.innerHeight - 20;

const options: Graph2dOptions = {
  start: Date.now() - 30000,
  end: Date.now(),
  height: adjustedViewportHeight(),
  dataAxis: {
    left: {
      range: {
        min: -1,
        max: 30,
      },
    },
  },
  legend: {
    enabled: true,
    left: {
      visible: true,
      position: 'bottom-left'
    },
  },
  defaultGroup: '',

  drawPoints: {
    style: 'circle',
  },
};

const graph2d = new Graph2d(container, dataset as any as DataItem[], options);

function renderStep(data: any) {
  let start;
  let end;
  const numDataPointsBack = 100;
  if (data[0]?.x && data[numDataPointsBack]?.x) {
    end = data[0].x + 30000; // 30 seconds ahead of latest data
    start = data[numDataPointsBack].x; 
    if (start > end) {
      console.error(`dates are out of order - ${data[0].x} should be larger than ${data[numDataPointsBack].x} `)
      return;
    }
  } else {
    end = Date.now() + 30000; // 30 seconds in the future
    start = end - (2 * 60 * 60 * 1000); // two hours back 
  }

  graph2d.setWindow(start, end, { animation: false });
  requestAnimationFrame(() => renderStep);
}

function handleWebSocketResponse(data: webSocketPayload) {
  dataset.add(data.graphDataPoints);
  renderStep(data.graphDataPoints);
}

let timeout = 250;

function connectWebSocket() {
  const ws = new WebSocket(`ws://192.168.1.54:8039`);
  console.log('web socket connected with: ', ws);

  ws.onopen = () => {
    timeout = 250;
  };

  ws.onmessage = (event) => {
    let wsResponse;
    try {
      wsResponse = JSON.parse(event?.data);
    } catch (e) {
      wsResponse = event.data;
    }

    if (!Array.isArray(wsResponse?.graphDataPoints)) {
      return;
    }
    handleWebSocketResponse(wsResponse);
  };

  ws.onclose = (event?) => {
    const retryMessage = `Retry in ${timeout}ms`;
    console.error(
      event?.reason
        ? `web socket closed - reason: ${event.reason}. ${retryMessage}`
        : `${retryMessage}`
    );
    setTimeout(connectWebSocket, Math.min(10000, (timeout += timeout)));
  };

  ws.onerror = () => {
    console.error(`web socket error - unable to connect`);
    ws.close();
  };
}

function attachEventListeners() {
  window.addEventListener('resize', function() {
    graph2d.setOptions({height: adjustedViewportHeight()})
  }, false);
}

function main() {
  attachEventListeners(); 
  connectWebSocket();
}

main();