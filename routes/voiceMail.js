const path = require("path");
module.exports = (req, res, next) => {
  res.render("composeMail", { layout: false, pageTitle: "Compose Mail" });
};
