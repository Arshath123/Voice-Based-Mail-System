const fs = require("fs");
module.exports = (req, res, next) => {
  let TOKEN_PATH = "./voicenode/" + req.cookies["email"] + ".json";
  fs.unlink(TOKEN_PATH, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.clearCookie("email");
  res.redirect("/");
};
