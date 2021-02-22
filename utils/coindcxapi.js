const axios = require('axios');

const getCoindcxData = async () => {
  const coindcx = await axios.get('https://public.coindcx.com/exchange/ticker');
  const coindcxData = coindcx.data[0];

  return {
    platform: 'CoinDCX',
    last: Math.floor(coindcxData.last_price).toString(),
    buy: Math.floor(coindcxData.bid).toString(),
    sell: Math.floor(coindcxData.ask).toString(),
  };
};

module.exports = getCoindcxData;
