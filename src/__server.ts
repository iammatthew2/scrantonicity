import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { viewState, webSocketPayload } from './types';

const app = express();
const port = 8000;
app.use(express.static('public'));
app.use(express.static('out'));
app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.listen(port, () => {
  console.log(`application is running on: ${port}.`);
});

const socketServer = new WebSocketServer({ port: 8030 });

socketServer.on('connection', (socketClient) => {
  console.log('connected');
  setInterval(() => {
    socketServer.clients.forEach((client) => {
      const now = Date.now();
      const tempData: webSocketPayload = {
        viewState: viewState.discrete,
        graphDataPoints: [
          { x: now.valueOf() - 1000, y: 1 },
          { x: now.valueOf() - 2000, y: 2 },
          { x: now.valueOf() + 6000, y: 3 },
          { x: now.valueOf() + 8000, y: 5 },
          { x: now.valueOf(), y: 0 },
        ],
      };
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(tempData));
      }
    });
  }, 1000);

  socketClient.on('close', () => {
    console.log('Number of clients: ', socketServer.clients.size);
  });
});
