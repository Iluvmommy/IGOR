const express = require("express");
const app = express();
const cors = require("cors");
const chalk = require("chalk");
const axios = require("axios");
const AV = require('av')

app.use(
  cors({
    origin: "https://itunes.apple.com",
  })
);

app.set("view-engine", "ejs");

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/results", async function (req, res) {
  const query = req.query.search || "John Lennon";
  console.log("Searching for " + query + "...");

  await axios
    .get("https://itunes.apple.com/search?term=" + query)
    .then((res) => res.data)
    .then((json) => {
      var arr = [];
      const item = json.results;
      for (var i = 0; i < 10; i++) {
        arr.push({
          Artist: item[i].artistName,
          Collection: item[i].collectionName,
          Track: item[i].trackName,
          Preview: item[i].previewUrl,
          Id: item[i].trackId
        });
      }
      return arr;
    })
    .then((arr) => res.render("results.ejs", {res: res, data: arr}))
    .catch((e) => console.log(e));
});

app.get('/sent', (req, res) => {
  res.render("sent.ejs")
})

app.get("/sending", (req, res) => {
  var asset = AV.Asset.fromURL(req.query.url)
  asset.decodeToBuffer(function(buffer) {
    console.log(buffer)
  })
})

app.listen(3000, () => {
  console.log(chalk.blue("Server Ready!"));
});
