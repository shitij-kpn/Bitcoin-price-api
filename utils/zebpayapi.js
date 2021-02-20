const axios = require("axios");

const getZebpayData = async () => {
  const zebpay = await axios.get(
    "https://www.zebapi.com/pro/v1/market/BTC-INR/ticker"
  );
  return {
    platform: "Zebpay",
    last: zebpay.data.market,
    buy: zebpay.data.buy,
    sell: zebpay.data.sell,
  };
};

module.exports = getZebpayData;
