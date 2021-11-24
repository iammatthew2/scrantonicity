import express from 'express';

const app = express();
const port = 8000;
app.use(express.static('public'));
app.use(express.static('out'));
app.get('/', function (req, res) {
  res.sendFile('index.html');
  res.send('this is nice');
});

app.listen(port, () => {
  console.log(`application is running on: ${port}.`);
});
