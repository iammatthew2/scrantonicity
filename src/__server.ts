import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const port = 8000;
app.use(express.static('public'));
app.use(express.static('out'));
app.get('/', function (req, res) {
  res.sendFile('index.html');

  res.send('this is nice');
});

app.listen(port, () => {
  console.log(`application is ... running on: ${port}.`);
});

const socketServer = new WebSocketServer({ port: 3030 });

const messages = ['Start Chatting!'];

socketServer.on('connection', (socketClient) => {
  console.log('connected');
  console.log('client Set length: ', socketServer.clients.size);

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
