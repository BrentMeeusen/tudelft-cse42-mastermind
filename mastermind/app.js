// Node requires
var express = require("express");
var http = require("http");
var ws = require("ws");

// Server requirements
var port = process.argv[2] || 3000;
var app = express();

// My requires
var Game = require("./game");
const games = [];

var Message = require("./messages");
var messages = Message.messages;

// Websocket
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);
const wss = new ws.Server({ server });
server.listen(port);

// When a user connects
wss.on("connection", function(ws) {

	// Send the user a message with all the messages it can send/receive
	let m = new Message.Message("MESSAGES", messages);
	ws.send(m);
	
	// When we get a message
	ws.on("message", function incoming(message) {
		// Do stuff with that message
		console.log("[MSG] " + message);
	});

	// When the user disconnects
	ws.on("close", function() {
		console.log("User disconnected.");
	});

});



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
	res.sendFile(req.url, { root: "./" });
});
app.get("/*.png", function(req, res) {
	res.sendFile(req.url, { root: "./" });
});
app.get("/*", function(req, res) {
	res.sendFile("public/splash_screen.html", { root: "./" });
});




