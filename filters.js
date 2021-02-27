const AV = require("av");
const router = require("express").Router();
const chalk = require("chalk");
const { DFT, FFT, ADSR, IIRFilter, MultiDelay, Reverb } = require("dsp.js");
require("aac");
const db = require("firebase-admin").database();

router.get("/none", (req, res) => {
  const data = {
      track: req.query.track,
      artist: req.query.artist,
      file: req.query.url,
  };
  var songRef = db.ref("/Kaavya/songs");
  songRef
    .child(Date.now())
    .set(data)
    .then((e) => {
      res.render("sent.ejs", { url: req.query.url });
    })
    .catch((err) => {
      res.render("error.ejs", {
        error: "could not upload to firebase: " + err,
      });
    });
});

router.get("/dft", async (req, res) => {
  buffer(req, res)
    .then((buffer) => {
      var dft = new DFT(1024, 44100);
      dft.forward(buffer);
      var spectrum = dft.spectrum;
      console.log(spectrum);
      res.send(spectrum);
    })
    .catch((err) => {
      console.log(err);
      res.send(err.toString());
    });
});
router.get("/fft", async (req, res) => {
  const buffer = await buffer(req, res);
  var fft = new FFT(2048, 44100);
  fft.forward(signal);
  var spectrum = fft.spectrum;
  console.log(spectrum);
});
router.get("/adsr", async (req, res) => {
  const buffer = await buffer(req, res);
  var envelope = new ADSR(0.01, 0.1, 0.5, 0.1, 0.2, 44100);
  envelope.process(buffer);
});
router.get("/filter", async (req, res) => {
  const buffer = await buffer(req, res);
  var filter = IIRFilter(req.query.type, 200, 44100);
  filter.process(buffer);
});
router.get("/delay", async (req, res) => {
  const buffer = await buffer(req, res);
  var delay = MultiDelay(44100 * 5, 44100 * 1, 1.0, 0.6);
  delay.process(buffer);
});
router.get("/reverb", async (req, res) => {
  const buffer = await buffer(req, res);
  var reverb = Reverb(20000, 6500, 0.8, 0.5, 0.9, 4500);
  reverb.process(buffer);
});

async function buffer(req, res) {
  try {
    var url = req.query.url.replace("https", "http");

    if (url.includes("m4v")) throw new Error();

    var asset = AV.Asset.fromURL(url);

    console.log(chalk.cyan("Converting to buffer..."));
    await asset.decodeToBuffer(function (buffer) {
      console.log(chalk.green("Done Converting"));

      return Object.values(buffer);
    });
  } catch (e) {
    return res.render("error.ejs", { error: e });
  }
}

module.exports = router;
