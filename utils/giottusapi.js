const axios = require("axios");

const getGiottusData = async () => {
  const giottus = await axios.get("https://www.giottus.com/api/v2/ticker");
  return {
    platform: "Giottus",
    last: giottus.data.btcinr.last,
    buy: giottus.data.btcinr.buy,
    sell: giottus.data.btcinr.sell,
  };
};

module.exports = getGiottusData;
