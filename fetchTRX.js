const axios = require('axios');

const { Pool } = require('pg');

const bitbnsApi = require('bitbns');

const bitbns = new bitbnsApi({
  apiKey: '',
  apiSecretKey: '',
});

/*
create table trxinr(
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
      'SELECT * FROM trxinr ORDER BY id DESC LIMIT 1'
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
      'insert into trxinr(timestamp,maindata) values($1,$2)',
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
    last: wazir.data.trxinr.last.toString(),
    buy: wazir.data.trxinr.buy.toString(),
    sell: wazir.data.trxinr.sell.toString(),
  };
};

const getCoindcxData = async () => {
  const coindcx = await axios.get('https://public.coindcx.com/exchange/ticker');
  const coindcxData = coindcx.data[255];

  return {
    platform: 'CoinDCX',
    last: coindcxData.last_price.toString(),
    buy: coindcxData.bid.toString(),
    sell: coindcxData.ask.toString(),
  };
};

const getBitbns = async () => {
  return new Promise((resolve, reject) => {
    bitbns.getTickerApi('TRX', (err, res) => {
      if (err) {
        reject('Error in bitbns');
      }
      resolve({
        platform: 'Bitbns',
        last: res.data.TRX.last_traded_price.toString(),
        buy: res.data.TRX.highest_buy_bid.toString(),
        sell: res.data.TRX.lowest_sell_bid.toString(),
      });
    });
  });
};

const getColodaxData = async () => {
  const colodax = await axios.get('https://colodax.com/api/ticker');
  const TRXINR = colodax.data.TRX_INR;
  return {
    platform: 'Colodax',
    last: TRXINR.last_price.toString(),
    buy: TRXINR.highestBid.toString(),
    sell: TRXINR.lowestAsk.toString(),
  };
};

const getGiottusData = async () => {
  const giottus = await axios.get('https://www.giottus.com/api/v2/ticker');
  return {
    platform: 'Giottus',
    last: giottus.data.trxinr.last.toString(),
    buy: giottus.data.trxinr.buy.toString(),
    sell: giottus.data.trxinr.sell.toString(),
  };
};

const getZebpayData = async () => {
  const zebpay = await axios.get(
    'https://www.zebapi.com/pro/v1/market/TRX-INR/ticker'
  );
  return {
    platform: 'Zebpay',
    last: zebpay.data.market.toString(),
    buy: zebpay.data.buy.toString(),
    sell: zebpay.data.sell.toString(),
  };
};

const fetchTRX = async (time = new Date().getTime()) => {
  let data;
  try {
    data = await Promise.all([
      getBitbns(),
      getWazirxData(),
      getGiottusData(),
      getColodaxData(),
      getZebpayData(),
      getCoindcxData(),
    ]);
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
  await writeData(time, JSON.stringify(data));
};

fetchTRX();

setInterval(() => {
  fetchTRX();
}, 60000);
