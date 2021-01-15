// Node requires
var express = require("express");
var http = require("http");
var ws = require("ws");

// Start server
var port = process.argv[2] || 3000;
var app = express();

// My requires
var Game = require("./game");

// Websocket
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app).listen(port);
const wss = new websocket.Server({ server });


// EXAMPLE CODE
var Validation = require("./validation");
var av = new Validation.valid();
av.validate();


// Redirects
app.get("/", function(req, res) {
	res.sendFile("public/splash_screen.html", { root: "./" });
});
app.get("/game", function(req, res) {
	res.sendFile("public/game_guesser.html", { root: "./" });
});

app.get("/*.js", function(req, res) {
	res.send("Umm,, javascript???");
	console.log(req, res);
});
app.get("/*", function(req, res) {
	res.sendFile("public/splash_screen.html", { root: "./" });
});




