const axios = require('axios');

const getWazirxData = async () => {
  const wazir = await axios.get('https://api.wazirx.com/api/v2/tickers');
  return {
    platform: 'WazirX',
    last: Math.floor(wazir.data.btcinr.last).toString(),
    buy: Math.floor(wazir.data.btcinr.buy).toString(),
    sell: Math.floor(wazir.data.btcinr.sell).toString(),
  };
};

module.exports = getWazirxData;
