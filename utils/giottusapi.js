const axios = require('axios');

const getGiottusData = async () => {
  const giottus = await axios.get('https://www.giottus.com/api/v2/ticker');
  return {
    platform: 'Giottus',
    last: Math.floor(giottus.data.btcinr.last).toString(),
    buy: Math.floor(giottus.data.btcinr.buy).toString(),
    sell: Math.floor(giottus.data.btcinr.sell).toString(),
  };
};

module.exports = getGiottusData;
