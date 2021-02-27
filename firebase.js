var admin = require("firebase-admin");

var serviceAccount = require("./secrets.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://igor-78e89-default-rtdb.firebaseio.com"
});


module.exports.db = admin.database()