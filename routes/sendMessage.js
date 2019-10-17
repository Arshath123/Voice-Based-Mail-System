const { google } = require("googleapis");
const fs = require("fs");

const makeBody = (to, from, subject, message) => {
  var str = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message
  ].join("");

  var encodedMail = new Buffer(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return encodedMail;
};

const sendMessage = (auth, to, mail) => {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.getProfile(
    {
      auth: auth,
      userId: "me"
    },
    function(err, response) {
      var raw = makeBody(
        to,
        response.emailAddress,
        "Mail from Voice App",
        mail
      );
      const gmail = google.gmail({ version: "v1", auth });
      gmail.users.messages.send(
        {
          auth: auth,
          userId: "me",
          resource: {
            raw: raw
          }
        },
        function(err, response) {}
      );
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
      sendMessage(oAuth2Client, req.body.to_mail, req.body.content);
    });
  });
  res.render("mailbox", { pageTitle: "MailSystem", layout: false });
};
