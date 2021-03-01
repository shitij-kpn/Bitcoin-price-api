const axios = require('axios');

const { Pool } = require('pg');

/*
create table iostbtc(
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
      'SELECT * FROM iostbtc ORDER BY id DESC LIMIT 1'
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
      'insert into iostbtc(timestamp,maindata) values($1,$2)',
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
    last: wazir.data.iostbtc.last.toString(),
    buy: wazir.data.iostbtc.buy.toString(),
    sell: wazir.data.iostbtc.sell.toString(),
  };
};

const getCoindcxData = async () => {
  const coindcx = await axios.get('https://public.coindcx.com/exchange/ticker');
  const coindcxData = coindcx.data[55];

  return {
    platform: 'CoinDCX',
    last: coindcxData.last_price.toString(),
    buy: coindcxData.bid.toString(),
    sell: coindcxData.ask.toString(),
  };
};

const fetchIOST = async (time = new Date().getTime()) => {
  const data = await Promise.all([getWazirxData(), getCoindcxData()]);
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

  await writeData(time, JSON.stringify(data));
};

fetchIOST();

setInterval(() => {
  fetchIOST();
}, 60000);
