const router = require("express").Router();
const axios = require("axios");

router.get("/results", async function (req, res) {
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

router.get('/last-song', (req, res) => {
  
})

module.exports = router;