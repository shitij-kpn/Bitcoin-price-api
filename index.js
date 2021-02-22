const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const app = express();
const server = require('http').createServer(app);
const io = socketio(server);

// const cors = require('cors');

//importing util modules
const getBitbns = require('./utils/bitbnsapi');
const getWazirxData = require('./utils/wazirxapi');
const getGiottusData = require('./utils/giottusapi');
const getColodaxData = require('./utils/colodaxapi');
const getZebpayData = require('./utils/zebpayapi');
const getCoindcxData = require('./utils/coindcxapi');

//importing database modules
const { writeData, readData } = require('./db/database');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors);

let clients = [];
let timer = 60;

const getData = async (time = new Date().getTime()) => {
  console.log('fetching new data');

  const data = await Promise.all([
    getBitbns(),
    getWazirxData(),
    getGiottusData(),
    getColodaxData(),
    getZebpayData(),
    getCoindcxData(),
  ]);

  //calculate avg of last sell
  let avg = 0;
  for (i in data) {
    avg = avg + parseInt(data[i].last);
  }
  avg /= data.length;

  // calculate difference
  for (i in data) {
    data[i].difference = (((avg - data[i].last) / avg) * 100).toFixed(2);
  }

  //calculate savings
  for (i in data) {
    data[i].savings = Math.floor(avg - data[i].last);
  }

  ///write data to database
  await writeData(time, JSON.stringify(data));

  if (clients.length > 0) {
    console.log('broadcasting');
    io.sockets.emit('newData', { data });
  } else {
    console.log('there are no clients');
  }
  timer = 60;
};

setInterval(() => {
  getData();
}, 60000);

io.on('connect', (socket) => {
  clients = [...clients, socket];
  socket.on('disconnect', () => {
    console.log('user disconnected');
    clients = clients.filter((user) => user.id !== socket.id);
  });
});

setInterval(() => {
  timer = timer > 0 ? --timer : 60;

  io.sockets.emit('timer', { timer: timer });
}, 1000);

app.get('/', async (req, res) => {
  try {
    const data = await readData();
    console.log('rendering');
    res.render('index', {
      data: data.maindata,
      timer,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error,
    });
  }
});

server.listen(8090, () => {
  getData();
  console.log('running on 8090');
});
