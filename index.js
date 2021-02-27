const express = require("express");
const app = express();
const cors = require("cors");
const chalk = require("chalk");
require('./firebase')

app.use(
  cors({
    origin: ["http://itunes.apple.com/", "https://itunes.apple.com/"],
  })
);

app.set("view-engine", "ejs");

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use(require('./pages'))
app.use('/filters', require('./filters'))

app.listen(8080, () => {
  console.log(chalk.blue("Server Ready!"));
});