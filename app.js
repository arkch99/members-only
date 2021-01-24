const express = require('express');
const path = require("path");
const session = require("express-session");
const passport = require("passport");

const mongoose = require("mongoose");

const authController = require("./controllers/auth");
const userController = require("./controllers/user");
const messageController = require("./controllers/message");

const mongoDB = "mongodb+srv://arkch99:a19c99%23%23@cluster0.dsado.mongodb.net/members-only?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "abcd", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var router = express.Router();

router.route("/")
	.get(messageController.getAllMessages);

router.route("/log-in")
	.get(function(req, res){res.render("login")})
	.post(authController.isAuthenticated);

router.route("/log-out")
	.get(function(req, res){
		req.logout();
		res.redirect("/");
	});


router.route("/:user_id")
	.get(userController.getUserMessages);


app.use("/", router);
app.listen(3000, () => console.log("Listening on port 3000..."));


