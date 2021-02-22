const express = require("express");

//importing util modules
const getBitbns = require("./utils/bitbnsapi");
const getWazirxData = require("./utils/wazirxapi");
const getGiottusData = require("./utils/giottusapi");
const getColodaxData = require("./utils/colodaxapi");
const getZebpayData = require("./utils/zebpayapi");
const getCoindcxData = require("./utils/coindcxapi");

//importing database modules
const { writeData, readData } = require("./db/database");

const app = express();

const getData = async (time = new Date().getTime()) => {
  console.log("fetching new data");
  const bitbnsData = getBitbns();
  const wazirData = getWazirxData();
  const giottusData = getGiottusData();
  let colodaxData = getColodaxData();
  const zebpayData = getZebpayData();
  const coindcxData = getCoindcxData();

  const data = await Promise.all([
    wazirData,
    bitbnsData,
    giottusData,
    zebpayData,
    coindcxData,
    colodaxData,
  ]);

  //calculate avg of last sell
  let avg = 0;
  for (i in data) {
    avg = avg + parseInt(data[i].last);
  }
  avg /= data.length;

  // calculate difference
  for (i in data) {
    data[i].difference = (((avg - data[i].last) / avg) * 100).toFixed(2);
  }

  //calculate savings
  for (i in data) {
    data[i].savings = Math.floor(avg - data[i].last);
  }

  await writeData(time, JSON.stringify(data));
};

setInterval(() => {
  getData();
}, 60000);

app.get("/", async (req, res) => {
  try {
    const data = await readData();
    console.log("sending data");
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error,
    });
  }
});

app.listen(8090, () => {
  getData();
  console.log("running on 8090");
});
