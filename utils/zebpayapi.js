const axios = require('axios');

const getZebpayData = async () => {
  const zebpay = await axios.get(
    'https://www.zebapi.com/pro/v1/market/BTC-INR/ticker'
  );
  return {
    platform: 'Zebpay',
    last: Math.floor(zebpay.data.market).toString(),
    buy: Math.floor(zebpay.data.buy).toString(),
    sell: Math.floor(zebpay.data.sell).toString(),
  };
};

module.exports = getZebpayData;
