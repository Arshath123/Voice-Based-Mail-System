const fs = require("fs");
const { google } = require("googleapis");

module.exports = (req, res, next) => {
  fs.readFile("./voicenode/credentials.json", (err, content) => {
    credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    var code = req.body.token;
    console.log(code);
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        res.redirect("/error");
      } else {
        let TOKEN_PATH = "./voicenode/" + req.cookies["email"] + ".json";
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
      }
    });
  });
  res.render("mailbox", { layout: false, pageTitle: "Mail Box" });
};
