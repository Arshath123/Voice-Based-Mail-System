const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const getRecentEmail = (auth, res) => {
  const gmail = google.gmail({ version: "v1", auth });
  let noOfResults = 15;
  let mails = [];
  gmail.users.messages.list(
    { auth: auth, userId: "me", maxResults: noOfResults },
    function(err, response) {
      if (err) {
        console.log("The API returned an error: " + err);
        return;
      }
      for (var i = 0; i < noOfResults; i++) {
        var message_id = response["data"]["messages"][i]["id"];
        gmail.users.messages.get(
          { auth: auth, userId: "me", id: message_id },
          function(err, response) {
            if (err) {
              console.log("The API returned an error: " + err);
              return;
            }
            message = response["data"]["snippet"];

            if (
              (message[0] !== undefined &&
                (message[0] >= "A" && message[0] <= "Z")) ||
              (message[0] >= "a" && message[0] <= "z")
            ) {
              mails.push(message);
            } else {
              noOfResults = noOfResults - 1;
            }
            if (mails.length === noOfResults) {
              res.render("recent", {
                layout: false,
                mails: mails
              });
            }
          }
        );
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
      getRecentEmail(oAuth2Client, res);
    });
  });
};
