require('dotenv').config();

const { ADDRESS_BD, NODE_ENV } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
//import socketIo from "socket.io";
const WebSockets = require("./utils/webSocket");
const { errors } = require('celebrate');
const cors = require('cors');
const errorHanding = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
//const limiter = require('./middlewares/limiter');
const { routes } = require('./routes/route');
const mongoUrl = require('./middlewares/mongoUrl');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const bodyParser = require('body-parser');

app.use('*', cors());

mongoose.connect(NODE_ENV === 'production' ? ADDRESS_BD : mongoUrl);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

//app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHanding);

const server = http.createServer(app);
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
/** Create socket connection */
//global.io = socketIo.Server;
const { Server } = require("socket.io");
global.io = new Server(server, {
  path: "/chat"
});
global.io.on('connection', WebSockets.connection)
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${PORT}/`)
});

app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
  console.log(BASE_PATH);
});

