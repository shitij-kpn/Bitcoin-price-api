const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

const getData = async () => {
  const { data } = await axios.get("https://api.wazirx.com/api/v2/tickers");
  const dataKeys = Object.keys(data);
  let n = 0;
  const newData = [];
  while (n < 20) {
    newData.push(data[dataKeys[n]]);
    n++;
  }
  return newData;
};

app.get("/", async (req, res) => {
  const results = await getData();
  res.render("home", { results });
});

app.listen(3000, () => {
  console.log("running on 3k");
});
