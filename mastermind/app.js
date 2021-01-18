// Node requires
var express = require("express");
var http = require("http");
var ws = require("ws");

// Server requirements
var port = process.argv[2] || 3000;
var app = express();

// My requires
var Game = require("./game").game;
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


// ================================================================
// When a user connects
wss.on("connection", function(ws) {

	// ================================================================
	// Give this user an ID and push it to the users array
	let thisID = userID++;
	users.push(ws);

	// Send the user a message with all the messages they can send back to the server
	var m = { message: { code: "MESSAGES" }, data: Message.clientMessages };
	m = JSON.stringify(m);
	ws.send(m);

	
	// ================================================================
	// Check whether there's a game waiting for a user
	let game = games[games.length - 1];

	// If there's no games at all, or if the last game is full
	if(game == null || game.players.length === 2) {

		// Create a game
		games.push(new Game([thisID]));

		// Tell the user we're waiting for players
		var m = { message: messages.WAITING_FOR_PLAYERS, data: games[games.length - 1] };
		m = JSON.stringify(m);
		ws.send(m);

	}

	// Else (so if there is a game waiting for a user)
	else {
		game.players.push(thisID);		// Join the game
		game.assignRoles();			// Assign the roles

		// Send a message to both players indicating the game has started and which role they have
		var m = { message: messages.GAME_STARTS_MAKECODE, data: game }
		m = JSON.stringify(m);
		users[game.PLAYER_1 - 1].send(m);

		var m = { message: messages.GAME_STARTS_GUESSCODE, data: game }
		m = JSON.stringify(m);
		users[game.PLAYER_2 - 1].send(m);

	}


	// ================================================================
	// When we get a message
	ws.on("message", function incoming(message) {
		
		// Do stuff with that message
		MSG = JSON.parse(message);
		
		// DEBUGGING PURPOSES
		console.log("[MSG] ", MSG);


		// If user inputs a code
		if(MSG.message.code === "INPUT_CREATED_CODE") {
			
			// If the code is invalid, send that to the user
			if(!Game.isValidCode(MSG.data)) {

				let m = { message: messages.ERRORS.INVALID_CODE, data: MSG.data };
				m = JSON.stringify(m);
				ws.send(m);

			}
			// Else (if code is valid)
			else {
				
				// Place the code in the game object and update the other player

			}

		} // if MSG === INPUT_CREATED_CODE



		// CREATE METHOD IN GAME.JS WHICH RETURNS THE GAME WHERE THE PLAYER WITH ID (PARAM) IS IN




	});
	
	// ================================================================
	// When the user disconnects
	ws.on("close", function() {

		let i = Game.findIndexOnPlayerID(thisID, games);
		console.log(games[i]);

		// If it exists and has 2 players
		if(games[i] && games[i].players.length === 2) {
				
			// Check which player we need to inform
			var toInform = (games[i].PLAYER_1 === thisID ? games[i].PLAYER_2 : games[i].PLAYER_1);
				
			// Send message and close the socket
			var m = { message: messages.OPPONENT_DISCONNECTED, data: games[i] };
			m = JSON.stringify(m);
			users[toInform - 1].send(m);
			users[toInform - 1].close();

		} // Game has two players

		// Set game to null (if game has either 1 or 2 players)
		games[i] = null;

	});	// On close
});	// WSServer



// ================================================================
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




