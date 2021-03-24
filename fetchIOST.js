const axios = require('axios');
const getWazirxData = require('./utils/wazirxapi')
const getCoindcxData = require('./utils/coindcxapi')

// const { Pool } = require('pg');

/*
create table iostbtc(
    id serial,
    timestamp varchar(255) primary key,
    maindata jsonb,
)
*/

// const getDB = async () => {
//   return new Pool({
//     connectionString: 'postgres://postgres:endencre@localhost:5432/postgres',
//   });
// };

// const readData = async () => {
//   try {
//     const db = await getDB();
//     await db.connect();
//     const { rows } = await db.query(
//       'SELECT * FROM iostbtc ORDER BY id DESC LIMIT 1'
//     );
//     db.end();
//     return rows[0];
//   } catch (error) {
//     console.log(error);
//     return {
//       message: error,
//     };
//   }
// };

// const writeData = async (...args) => {
//   try {
//     const db = await getDB();
//     await db.connect();
//     const { rows } = await db.query(
//       'insert into iostbtc(timestamp,maindata) values($1,$2)',
//       args
//     );
//     console.log('insterting into db');
//     db.end();
//     return rows;
//   } catch (error) {
//     console.error(error);
//     return error;
//   }
// };

const getWazirxIOSTBTC = async () => {
  const wazir = await axios.get('https://api.wazirx.com/api/v2/tickers');
  return {
    platform: 'WazirX',
    last: wazir.data.iostbtc.last.toString(),
    buy: wazir.data.iostbtc.buy.toString(),
    sell: wazir.data.iostbtc.sell.toString(),
  };
};

const getCoindcxIostToBtc = async () => {
  const coindcx = await axios.get('https://public.coindcx.com/exchange/ticker');
  let coindcxData = {};
  for(i in coindcx.data){
    if(coindcx.data[i].market === 'IOSTBTC'){
      coindcxData = coindcx.data[i];
      break;
    }
  }

  return {
    platform: 'CoinDCX',
    last: coindcxData.last_price.toString(),
    buy: coindcxData.bid.toString(),
    sell: coindcxData.ask.toString(),
  };
};

const fetchIOST = async (time = new Date().getTime()) => {
  const iostToBtcData = await Promise.all([getWazirxIOSTBTC(),getCoindcxIostToBtc()]);
  const btcToInrData = await Promise.all([getWazirxData(),getCoindcxData()])
  let data = [];
  for(i in iostToBtcData){
    data = [
      ...data,
      {
        platform: iostToBtcData[i].platform,
        last: (parseFloat(iostToBtcData[i].last) * Number(btcToInrData[i].last)).toFixed(8),
        buy: (parseFloat(iostToBtcData[i].buy) * Number(btcToInrData[i].buy)).toFixed(8),
        sell: (parseFloat(iostToBtcData[i].sell) * Number(btcToInrData[i].sell)).toFixed(8),
      }
    ]
  }
  let avg = 0;
  for (i in data) {
    avg = avg + parseFloat(data[i].last);
  }
  avg /= data.length;

  for (i in data) {
    data[i].difference = (((avg - data[i].last) / avg) * 100).toFixed(8);
  }

  for (i in data) {
    data[i].savings = (avg - data[i].last).toFixed(8);
  }
  console.log(data);
  // await writeData(time, JSON.stringify(data));
};

fetchIOST();

setInterval(() => {
  fetchIOST();
}, 60000);
