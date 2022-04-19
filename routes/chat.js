const chat = require('express').Router();

// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const {app} = require("../app");

const {io} = require('../app')

chat.get('/chat', function (req, res) {
  req.sendFile(__dirname + './index.html');
})

const users = [];
const connections = [];

io.sockets.on('connection', function (socket) {
  console.log('Успешное соединение');
  connections.push(socket);

  socket.on('disconnect', function (data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Отсоединение');
  })
})

