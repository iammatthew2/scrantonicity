import { webSocketPayload, viewState } from './types';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { DataSet } from 'vis-data';
import { DataItem, Graph2d, Graph2dOptions } from 'vis-timeline/standalone';

const container = document.getElementById('visualization');
const dataset = new DataSet();

const options: Graph2dOptions = {
  start: Date.now() - 30000,
  end: Date.now(),
  height: 900,
  dataAxis: {
    left: {
      range: {
        min: -1,
        max: 30,
      },
    },
  },
  drawPoints: {
    style: 'circle',
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const graph2d = new Graph2d(container, dataset as any as DataItem[], options);

function renderStep(strategy = viewState.discrete) {
  const now = Date.now();
  const range = graph2d.getWindow();
  const interval = range.end.valueOf() - range.start.valueOf();
  switch (strategy) {
    case viewState.continuous:
      graph2d.setWindow(now - interval, now, { animation: false });
      requestAnimationFrame(() => renderStep);
      break;

    case viewState.discrete:
      graph2d.setWindow(now - interval, now, { animation: false });
      break;

    case viewState.static:
      if (now > range.end.valueOf()) {
        graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
      }
      break;
  }
}

function handleWebSocketResponse(data: webSocketPayload) {
  dataset.add(data.graphDataPoints);
  renderStep(data.viewState);
}

let timeout = 250;
function connectWebSocket() {
  console.log('connecting to web socket...')
  const ws = new WebSocket(`ws://192.168.1.54:8039`);
  console.log('web socket connected with: ', ws);
  ws.onopen = () => {
    timeout = 250;
    console.log('web socket opened');
  };
  ws.onmessage = (event) => {
    let wsResponse;
    try {
      wsResponse = JSON.parse(event?.data);
    } catch (e) {
      wsResponse = event.data;
    }

    console.log('response: ', wsResponse);
    if (!Array.isArray(wsResponse?.graphDataPoints)) {
      return;
    }
    handleWebSocketResponse(wsResponse);
  };
  ws.onclose = (event?) => {
    const retryMessage = `Retry in ${timeout}ms`;
    console.log(
      event?.reason
        ? `web socket closed - reason: ${event.reason}. ${retryMessage}`
        : `${retryMessage}`
    );
    setTimeout(connectWebSocket, Math.min(10000, (timeout += timeout)));
  };
  ws.onerror = () => {
    console.log(`web socket error - unable to connect`);
    ws.close();
  };
}

connectWebSocket();
