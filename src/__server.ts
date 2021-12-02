import express from 'express';
import moment from 'moment';
import { WebSocketServer, WebSocket } from 'ws';
import process from 'process';
import { webSocketPayload } from './types';

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

const magicNumber = (item: number) => {
  return (Math.sin(item / 2) + Math.cos(item / 4)) * 5;
};
const socketServer = new WebSocketServer({ port: 8030 });

const messages = ['Start Chatting!'];

socketServer.on('connection', (socketClient) => {
  console.log('connected');
  setInterval(() => {
    socketServer.clients.forEach((client) => {
      const now = moment().valueOf();
      const tempData: webSocketPayload = {
        graphDataPoints: [
          { x: now.valueOf(), y: magicNumber(now.valueOf() / 1000) },
        ],
      };
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(tempData));
      }
    });
  }, 1000);
  socketClient.on('message', (message) => {
    console.log('server msg rec');
    messages.push(message.toString());
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([message]));
      }
    });
  });

  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});

const stdin = process.stdin;

stdin.resume();

stdin.setEncoding('utf8');
console.log('starting up');
stdin.on('data', function (key) {
  process.stdout.write(`this key received stdout: ${key}`);
});
