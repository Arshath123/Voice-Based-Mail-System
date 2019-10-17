const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  let authToken = "";
  let mail = "";
  if (req.headers.cookie && req.headers.cookie.includes("authTokenUser")) {
    authToken = req.cookies.authTokenUser;
    mail = req.cookies.email;
  }
  jwt.verify(authToken, "QGa87@j4Idy3", (err, decodedToken) => {
    if (!decodedToken) {
      res.redirect("/");
    } else if (decodedToken.id === mail) {
      next();
    } else {
      return res.redirect("/logout");
    }
  });
};
