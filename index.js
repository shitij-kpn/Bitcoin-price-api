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

const getData = async (time = new Date().getTime()) => {
  console.log('fetching new data');
  const bitbnsData = getBitbns();
  const wazirData = getWazirxData();
  const giottusData = getGiottusData();
  const colodaxData = getColodaxData();
  const zebpayData = getZebpayData();
  const coindcxData = getCoindcxData();

  const data = await Promise.all([
    wazirData,
    bitbnsData,
    giottusData,
    zebpayData,
    coindcxData,
    colodaxData,
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
  // await writeData(time, JSON.stringify(data));
  if (clients.length > 0) {
    console.log('broadcasting');
    io.sockets.emit('newData', { data });
  } else {
    console.log('there are no clients');
  }
};

setInterval(() => {
  getData();
}, 60000);

io.on('connect', (socket) => {
  clients = [...clients, socket];
  console.log('new client connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    clients = clients.filter((user) => user.id !== socket.id);
  });
});

app.get('/', async (req, res) => {
  try {
    const data = await readData();
    console.log('rendering');
    res.render('index', { data: data.maindata });
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
