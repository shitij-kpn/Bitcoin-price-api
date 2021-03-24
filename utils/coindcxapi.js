const axios = require('axios');

const getCoindcxData = async () => {
  const coindcx = await axios.get('https://public.coindcx.com/exchange/ticker');
  let coindcxData = {};
  for(i in coindcx.data){
    if(coindcx.data[i].market === 'BTCINR'){
      coindcxData = coindcx.data[i];
      break;
    }
  }

  return {
    platform: 'CoinDCX',
    last: Math.floor(coindcxData.last_price).toString(),
    buy: Math.floor(coindcxData.bid).toString(),
    sell: Math.floor(coindcxData.ask).toString(),
  };
};

module.exports = getCoindcxData;
