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


// Keep track of users
let userID = 1;


// Websocket
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);
const wss = new ws.Server({ server });
server.listen(port);

// When a user connects
wss.on("connection", function(ws) {

	// Give this user an ID
	let thisID = userID++;

	// Send the user a message with all the messages it can send/receive and include its ID
	let m = {
		message: "MESSAGES",
		data: messages,
		ID: thisID
	};
	m = JSON.stringify(m);
	ws.send(m);


	// Check whether there's a game waiting for a user
	let g = games[games.length - 1];

	// If there's no games at all, or if the last game is full: create a new game
	if(g == null || g.players.length == 2) {
		games.push(new Game.game([thisID])); // -1 because of the increment
		console.log("Game created: ", games[games.length - 1]);
	}

	
	// When we get a message
	ws.on("message", function incoming(message) {
		// Do stuff with that message
		console.log("[MSG] " + message);
	});

	// When the user disconnects
	ws.on("close", function() {
		console.log("User \"" + thisID + "\" disconnected.");
	});

});



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




