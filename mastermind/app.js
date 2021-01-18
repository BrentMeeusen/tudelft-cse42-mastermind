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
const users = [];


// Websocket
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);
const wss = new ws.Server({ server });
server.listen(port);


// When a user connects
wss.on("connection", function(ws) {

	// Give this user an ID and push it to the users array
	let thisID = userID++;
	users.push(ws);

	// Send the user a message with all the messages it can send/receive and include its ID
	var m = {
		message: "MESSAGES",
		data: messages
	};
	m = JSON.stringify(m);
	ws.send(m);


	// Check whether there's a game waiting for a user
	let g = games[games.length - 1];

	// If there's no games at all, or if the last game is full
	if(g == null || g.players.length === 2) {

		// Create a game
		games.push(new Game.game([thisID]));

		// Tell the user we're waiting for players
		var m = { message: messages.WAITING_FOR_PLAYERS, data: games[games.length - 1] };
		m = JSON.stringify(m);
		ws.send(m);

	}

	// Else (so if there is a game waiting for a user)
	else {
		g.players.push(thisID);		// Join the game
		g.assignRoles();			// Assign the roles

		// Send a message to both players indicating the game has started and which role they have
		var m = { message: messages.GAME_STARTS_MAKECODE, data: g }
		m = JSON.stringify(m);
		users[g.PLAYER_1 - 1].send(m);

		var m = { message: messages.GAME_STARTS_GUESSCODE, data: g }
		m = JSON.stringify(m);
		users[g.PLAYER_2 - 1].send(m);

	}

	
	// When we get a message
	ws.on("message", function incoming(message) {
		// Do stuff with that message
		console.log("[MSG] " + message);
	});

	// When the user disconnects
	ws.on("close", function() {

		// Find the game the user took place in
		for(let i = 0; i < games.length; i++) {

			// If the game is found
			if(games[i].players.includes(thisID)) {

				// Check which player we need to inform
				var toInform = (games[i].PLAYER_1 === thisID ? games[i].PLAYER_2 : games[i].PLAYER_1);
				
				// Send message
				var m = { message: messages.USER_DISCONNECTED, data: games[i] };
				m = JSON.stringify(m);
				users[toInform - 1].send(m);

				// Stop searching for games
				break;

			} // If player is in the game

			// If the game is not found (because the other user left), do nothing

		} // for i < games.length

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




