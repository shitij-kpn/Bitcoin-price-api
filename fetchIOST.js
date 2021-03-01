const axios = require('axios');

const { Pool } = require('pg');

const getDB = async () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
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
    last: Math.floor(wazir.data.iostbtc.last).toString(),
    buy: Math.floor(wazir.data.iostbtc.buy).toString(),
    sell: Math.floor(wazir.data.iostbtc.sell).toString(),
  };
};

const getCoindcxData = async () => {
  const coindcx = await axios.get('https://public.coindcx.com/exchange/ticker');
  const coindcxData = coindcx.data[55];

  return {
    platform: 'CoinDCX',
    last: Math.floor(coindcxData.last_price).toString(),
    buy: Math.floor(coindcxData.bid).toString(),
    sell: Math.floor(coindcxData.ask).toString(),
  };
};

const fetchIOST = async () => {
  const time = new Date().getTime();
  const data = await Promise.all([getWazirxData(), getCoindcxData()]);

  let avg = 0;
  for (i in data) {
    avg = avg + parseInt(data[i].last);
  }
  avg /= data.length;

  for (i in data) {
    data[i].difference = (((avg - data[i].last) / avg) * 100).toFixed(2);
  }

  for (i in data) {
    data[i].savings = Math.floor(avg - data[i].last);
  }

  await writeData(time, JSON.stringify(data));
};

setTimeout(() => {
  fetchIOST();
}, 60000);
