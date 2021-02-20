const axios = require("axios");

const getCoindcxData = async () => {
  const coindcx = await axios.get("https://public.coindcx.com/exchange/ticker");
  const coindcxData = coindcx.data[0];

  return {
    platform: "CoinDCX",
    last: coindcxData.last_price,
    buy: coindcxData.bid,
    sell: coindcxData.ask,
  };
};

module.exports = getCoindcxData;
