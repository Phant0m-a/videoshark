var admin = require("firebase-admin");

var serviceAccount = require("./webapp-e9ad0-firebase-adminsdk-605sx-bd616a61af.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "webapp-e9ad0.appspot.com"
});
//   const analytics = getAnalytics(app);
module.exports=admin;