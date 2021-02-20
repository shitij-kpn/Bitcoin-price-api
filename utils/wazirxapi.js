const axios = require("axios");

const getWazirxData = async () => {
  const wazir = await axios.get("https://api.wazirx.com/api/v2/tickers");
  return {
    platform: "WazirX",
    last: wazir.data.btcinr.last,
    buy: wazir.data.btcinr.buy,
    sell: wazir.data.btcinr.sell,
  };
};

module.exports = getWazirxData;
