'use strict';

module.exports = function(app, port) {
  const server = require('http').createServer(app.callback());
  const io = require('socket.io')(server);

  io.on('connection', function(socket) {
    console.log('socket io connected');
    socket.emit('shift', {update: true});
  });

  server.listen(port);
  console.log('http listening on port:', port);
};
