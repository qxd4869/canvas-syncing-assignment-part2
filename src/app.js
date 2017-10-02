const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// read the client html file into memory
// __dirname in node is the current directory
// (in this case the same folder as the server js file)
const index = fs.readFileSync(`${__dirname}/../client/index.html`);


const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass in the http server into socketio and grab the websocket server as io
const io = socketio(app);


const onJoined = (sock) => {
  const socket = sock;

  // send the user to their room
  socket.join('room1');

  // retrieve previous data for the new user
  socket.broadcast.to('room1').emit('join');

  socket.on('draw', (data) => {
    socket.broadcast.to('room1').emit('updateCanvas', data);
  });
};

io.sockets.on('connection', (socket) => {
  console.log('Draw app online');
  onJoined(socket);
});

console.log('Websocket server started');

