// #region Prepare
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log('a user connected');
});

// ! Main
async function main() {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.post('/test', (req, res) => {
    console.log(req.body);
    res.send({ test: 'this is from server' });
  });

  app.get('*', (_req, res) => {
    res.send('404');
  });

  await EXPRESS_LISTENING(app);
}
main();

// * Functions
/** Express App을 listening 합니다 */
async function EXPRESS_LISTENING(app) {
  return new Promise(resolve => {
    http.listen(3001, () => {
      console.log('[EXPRESS]', 3001);
      resolve();
    });
  });
}
