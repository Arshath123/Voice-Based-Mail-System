const { google } = require("googleapis");
const fs = require("fs");

const listLabels = auth => {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.labels.list(
    {
      userId: "me"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const labels = res.data.labels;
      if (labels.length) {
        ///Send the labels in a hbs file..
      } else {
        console.log("No labels found.");
      }
    }
  );
};

module.exports = (req, res, next) => {
  fs.readFile("./voicenode/credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);

    let credentials = JSON.parse(content);

    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    let TOKEN_PATH = "./voicenode/" + req.cookies["email"] + ".json";
    fs.readFile(TOKEN_PATH, (err, token) => {
      oAuth2Client.setCredentials(JSON.parse(token));
      listLabels(oAuth2Client);
    });
  });
  res.render("mailbox", { pageTitle: "MailSystem", layout: false });
};
