const axios = require('axios');

const getColodaxData = async () => {
  const colodax = await axios.get('https://colodax.com/api/ticker');
  const btcColodax = colodax.data.BTC_INR;
  return {
    platform: 'Colodax',
    last: Math.floor(btcColodax.last_price),
    buy: Math.floor(btcColodax.highestBid),
    sell: Math.floor(btcColodax.lowestAsk),
  };
};

module.exports = getColodaxData;
