const bitbnsApi = require('bitbns');

const bitbns = new bitbnsApi({
  apiKey: process.env.BITBNS_KEY,
  apiSecretKey: process.env.BITBNS_SECRET,
});

const getBitbns = async () => {
  return new Promise((resolve, reject) => {
    bitbns.getTickerApi('BTC', (err, res) => {
      if (err || !res.data) {
        return reject('Error in bitbns');
      }
      resolve({
        platform: 'Bitbns',
        last: Math.floor(res.data.BTC.last_traded_price).toString(),
        buy: Math.floor(res.data.BTC.highest_buy_bid).toString(),
        sell: Math.floor(res.data.BTC.lowest_sell_bid).toString(),
      });
    });
  });
};

module.exports = getBitbns;
