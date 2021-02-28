const router = require("express").Router();
const axios = require("axios");
const { google } = require("googleapis");
const db = require("firebase-admin").database();
const yt = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

router.get("/results", async function (req, res) {
  if (req.query.searchYoutube) {
    const query = req.query.searchYoutube;
    console.log("Searching for " + query + "...");

    yt.search
      .list({
        part: ["snippet"],
        maxResults: 10,
        q: query,
      })
      .then((res) => res.data.items)
      .then((json) => {
        res.render("resultsYoutube.ejs", { data: json });
      })
      .catch((err) => console.log(err));
  } else {
    const query = req.query.searchItunes || "John Lennon";
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
      .then((arr) => res.render("resultsItunes.ejs", { data: arr }))
      .catch((e) => console.log(e));
  }
});

router.get("/youtube", (req, res) => {
  var videoRef = db.ref("/Kaavya/videos");
  videoRef
    .child(Date.now())
    .set({
      title: req.query.title,
      id: req.query.id,
      channel: req.query.channel,
    })
    .then((e) => {
      res.render("sent.ejs", { url: `https://www.youtube.com/embed/${req.query.id}` });
    })
    .catch((err) => {
      res.render("error.ejs", {
        error: "could not upload to firebase: " + err,
      });
    });
});

module.exports = router;
