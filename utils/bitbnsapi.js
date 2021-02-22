const bitbnsApi = require('bitbns');

const bitbns = new bitbnsApi({
  apiKey: 'D69275A2AC770255A5D1F3416F6D9BCC',
  apiSecretKey: 'C35FF964E33646802327C9C3696562FA',
});

const getBitbns = async () => {
  return new Promise((resolve, reject) => {
    bitbns.getTickerApi('BTC', (err, res) => {
      if (err) {
        reject('Error in bitbns');
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
