const fs = require("fs");
const { google } = require("googleapis");
const SCOPES = ["https://mail.google.com/"];

module.exports = (req, res, next) => {
  fs.readFile("./voicenode/credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);

    credentials = JSON.parse(content);

    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    let TOKEN_PATH = "./voicenode/" + req.cookies["email"] + ".json";
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: SCOPES
        });
        res.render("token", {
          pageTitle: "TokenUrl",
          url: authUrl,
          layout: false
        });
      } else next();
    });
  });
};
