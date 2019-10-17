const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const path = require("path");
const db = require("../database/db");
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

exports.user = router;

exports.authentication = (req, res, next) => {
  var email = req.body.username;
  let token = jwt
    .sign({ id: email }, "QGa87@j4Idy3", {
      expiresIn: "1h"
    })
    .toString();
  res.cookie("authTokenUser", token, {
    expires: new Date(Date.now() + 3600000)
  });
  res.cookie("email", email);
  db.query("SELECT * FROM users WHERE email = ?", [email], function(
    error,
    results,
    fields
  ) {
    if (results.length > 0) {
      bcrypt.compare(req.body.pass, results[0].password, (err, result) => {
        if (result) {
          res.sendFile(path.join(__dirname, "../views/gmailSignin.html"));
        } else {
          res.send("<h1>Authentication Failed</h1>");
        }
      });
    } else {
      res.send("<h1>Authentication Failed</h1>");
    }
  });
};
