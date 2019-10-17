const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");

const db = require("../database/db");

const router = express.Router();

router.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../views/usersignup.html"));
});

exports.form = router;

exports.post_form = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    var users = {
      name: req.body.name,
      userName: req.body.user_name,
      phone: req.body.phone,
      email: req.body.email,
      password: hash
    };
    db.query(
      "select * from users where email = ?",
      [users.email],
      (err, result) => {
        console.log(result);
        if (err) res.send("<h1>...Some error...</h1>");
        if (!result[0]) {
          db.query("INSERT INTO users values(?,?,?,?,?)", [
            users.userName,
            users.name,
            users.phone,
            users.email,
            users.password
          ]);
          res.redirect("/");
        } else {
          res.send("<h1>...User EmailId Already Exists...</h1>");
        }
      }
    );
  });
};
