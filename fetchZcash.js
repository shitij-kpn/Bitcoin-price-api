const axios = require('axios');

const { Pool } = require('pg');

/*
create table zecinr(
    id serial,
    timestamp varchar(255) primary key,
    maindata jsonb,
)
*/

const getDB = async () => {
  return new Pool({
    connectionString: 'postgres://postgres:endencre@localhost:5432/postgres',
  });
};

const readData = async () => {
  try {
    const db = await getDB();
    await db.connect();
    const { rows } = await db.query(
      'SELECT * FROM zecinr ORDER BY id DESC LIMIT 1'
    );
    db.end();
    return rows[0];
  } catch (error) {
    console.log(error);
    return {
      message: error,
    };
  }
};

const writeData = async (...args) => {
  try {
    const db = await getDB();
    await db.connect();
    const { rows } = await db.query(
      'insert into zecinr(timestamp,maindata) values($1,$2)',
      args
    );
    console.log('insterting into db');
    db.end();
    return rows;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getWazirxData = async () => {
  const wazir = await axios.get('https://api.wazirx.com/api/v2/tickers');
  return {
    platform: 'WazirX',
    last: wazir.data.zecinr.last.toString(),
    buy: wazir.data.zecinr.buy.toString(),
    sell: wazir.data.zecinr.sell.toString(),
  };
};

const getGiottusData = async () => {
  const giottus = await axios.get('https://www.giottus.com/api/v2/ticker');
  return {
    platform: 'Giottus',
    last: giottus.data.zecinr.last.toString(),
    buy: giottus.data.zecinr.buy.toString(),
    sell: giottus.data.zecinr.sell.toString(),
  };
};

const fetchXRP = async (time = new Date().getTime()) => {
  let data;
  try {
    data = await Promise.all([getWazirxData(), getGiottusData()]);
  } catch (error) {
    return console.log(error);
  }

  let avg = 0;
  for (i in data) {
    avg = avg + parseFloat(data[i].last);
  }
  avg /= data.length;

  for (i in data) {
    data[i].difference = (((avg - data[i].last) / avg) * 100).toString();
  }

  for (i in data) {
    data[i].savings = (avg - data[i].last).toString();
  }

  console.table(data);
  //   await writeData(time, JSON.stringify(data));
};

fetchXRP();

setInterval(() => {
  fetchXRP();
}, 60000);
