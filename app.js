const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const gmailSignin = require("./routes/gmailSignin");
const getNewToken = require("./routes/getNewToken");
const sendMessage = require("./routes/sendMessage");
const voiceMail = require("./routes/voiceMail");
const recentMail = require("./routes/getRecentEmail");
const checkToken = require("./routes/checkToken");
const error = require("./routes/error");
const logout = require("./routes/logout");
const signup_user = require("./routes/signup");
const signin = require("./routes/signin");
const cookieParser = require("cookie-parser");
const verifyCookie = require("./routes/verifyCookie");
const app = express();

app.engine("hbs", expressHbs());
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./views/mainPage/index.html"));
});

app.get("/user-signup", signup_user.form);
app.post("/user-signup", signup_user.post_form);

app.get("/signin", signin.user);
app.post("/signin", signin.authentication);

app.get("/gmail-signin", verifyCookie, gmailSignin);
app.post("/token", verifyCookie, getNewToken);

app.get("/sendmail", verifyCookie, checkToken, voiceMail);
app.post("/sendmail", verifyCookie, checkToken, sendMessage);
app.get("/recent", verifyCookie, checkToken, recentMail);

app.use("/error", error);
app.get("/logout", logout);

app.use("/", error);

app.listen(3030, () => {
  console.log("Server is Running");
});
