const express = require("express");
const app = express();
const cors = require("cors");
const chalk = require("chalk");
const axios = require("axios");
const AV = require("av");
require("aac");
const pcm = require('pcm-util')

app.use(
  cors({
    origin: ["http://itunes.apple.com/", "https://itunes.apple.com/"],
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
          Id: item[i].trackId,
        });
      }
      return arr;
    })
    .then((arr) => res.render("results.ejs", { res: res, data: arr }))
    .catch((e) => console.log(e));
});

app.get("/sending", async (req, res) => {
  try {
    var url = req.query.url.replace("https", "http");
    if (url.includes("m4v"))
      throw new Error;
    var asset = AV.Asset.fromURL(url);

    console.log(chalk.cyan("Converting to buffer..."));
    await asset.decodeToBuffer(function (buffer) {

      console.log(chalk.green("Done Converting"));

      return res.send(Object.values(buffer))
    });
  } catch (e) {
    return res.render("error.ejs", { error: e });
  }
});

app.get("/hi", (req, res) => {
  res.send("hi")
})

app.listen(8080, () => {
  console.log(chalk.blue("Server Ready!"));
});
