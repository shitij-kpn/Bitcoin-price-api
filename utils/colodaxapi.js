const axios = require("axios");

const getColodaxData = async () => {
  const colodax = await axios.get("https://colodax.com/api/ticker");
  const btcColodax = colodax.data.BTC_INR;
  return {
    platform: "Colodax",
    last: btcColodax.last_price.toString(),
    buy: btcColodax.highestBid.toString(),
    sell: btcColodax.lowestAsk.toString(),
  };
};

module.exports = getColodaxData;
