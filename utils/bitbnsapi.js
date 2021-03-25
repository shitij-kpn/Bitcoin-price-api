const bitbnsApi = require('bitbns');

const bitbns = new bitbnsApi({
  apiKey: '41A5218EE6ECAE9BDFBBF77B120749AA',
  apiSecretKey: '16A7688692031EC59E5DDC3177B11A60',
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
