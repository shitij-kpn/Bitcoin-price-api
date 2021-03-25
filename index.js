const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const app = express();
const server = require('http').createServer(
  app,
  (options = {
    cors: true,
  })
);
const io = socketio(server);

const cors = require('cors');

//importing util modules
const getBitbns = require('./utils/bitbnsapi');
const getWazirxData = require('./utils/wazirxapi');
const getGiottusData = require('./utils/giottusapi');
const getColodaxData = require('./utils/colodaxapi');
const getZebpayData = require('./utils/zebpayapi');
const getCoindcxData = require('./utils/coindcxapi');

//importing database modules
const { writeData, readData, readAllData } = require('./db/database');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors);

let clients = [];
let timer = 60;

const getData = async () => {
  console.log('fetching new data');
  const time = new Date().getTime();
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
    avg = avg + Number(data[i].last);
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

  for (i in data) {
    data[i].index = Number(i) + 1;
  }

  ///write data to database
  await writeData(time, JSON.stringify(data));

  const allData = await readAllData();
  const metaData = {
    average: avg.toFixed(2),
    five_minute: 0,
    one_hour: 0,
    one_day: 0,
    one_week: 0,
  };
  let f_length = 0,
    one_hour_length = 0,
    one_day_length = 0,
    one_week_length = 0;

  const times = {
    t_5_minute: time - 5 * 60000,
    t_1_day: time - 24 * 60 * 60000,
    t_1_hour: time - 60 * 60000,
    t_1_week: time - 7 * 24 * 60 * 60000,
  };

  for (i in allData) {
    if (parseInt(allData[i].timestamp) > times.t_5_minute) {
      for (j in allData[i].maindata) {
        metaData.five_minute += parseInt(allData[i].maindata[j].last);
        f_length++;
      }
    }
  }

  metaData.five_minute /= f_length;
  metaData.five_minute = (((metaData.five_minute - avg) / avg) * 100).toFixed(
    2
  );

  for (i in allData) {
    if (parseInt(allData[i].timestamp) > times.t_1_hour) {
      for (j in allData[i].maindata) {
        metaData.one_hour += parseInt(allData[i].maindata[j].last);
        one_hour_length++;
      }
    }
  }
  metaData.one_hour /= one_hour_length;
  metaData.one_hour = (((metaData.one_hour - avg) / avg) * 100).toFixed(2);

  for (i in allData) {
    if (parseInt(allData[i].timestamp) > times.t_1_day) {
      for (j in allData[i].maindata) {
        metaData.one_day += parseInt(allData[i].maindata[j].last);
        one_day_length++;
      }
    }
  }
  metaData.one_day /= one_day_length;
  metaData.one_day = (((metaData.one_day - avg) / avg) * 100).toFixed(2);

  for (i in allData) {
    if (parseInt(allData[i].timestamp) > times.t_1_week) {
      for (j in allData[i].maindata) {
        metaData.one_week += parseInt(allData[i].maindata[j].last);
        one_week_length++;
      }
    }
  }

  metaData.one_week /= one_week_length;
  metaData.one_week = (((metaData.one_week - avg) / avg) * 100).toFixed(2);

  console.log({ metaData });
  if (clients.length > 0) {
    console.log('broadcasting');
    io.sockets.emit('newData', { data, metaData });
  } else {
    console.log('there are no clients');
  }
  timer = 60;
};

setInterval(() => {
  getData();
}, 60000);

io.on('connect', async (socket) => {
  console.log('user Connected');
  clients = [...clients, socket];
  const data = await readData();
  socket.emit('initialData', { data });
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
    console.log('request made');
    const data = await readData();
    console.log('rendering');
    res.render('index', {
      data: data.maindata,
      timer,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      error,
    });
  }
});

server.listen(8080, () => {
  getData();
  console.log('running on 8080');
});
