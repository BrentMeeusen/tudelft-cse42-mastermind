/*

TODO
=========
- Fix winning/losing conditions
- Clean up console.logs on client side		(1m)
- Make minimum screen size requirements		(1m)
- Keep track of statistics					(30m)
	- Games playing right now
	- Players online
	- Players in-game

- Clean up code								(2h)
	- Add comments
	- Split over files
		- Redirects
		- WebSocket
	- Find and resolve code duplication

- Fix front-end								(???m)
- Test in multiple browsers					(\infinity)

*/




// Node requires
var express = require("express");
var http = require("http");
var ws = require("ws");

// Server requires
var port = process.argv[2] || 3000;
var app = express();

// My requires
var Game = require("./game").game;
const games = [];

var Message = require("./messages");
var messages = Message.messages;


// Keep track of players
let userID = 1;
const players = [];


// Websocket
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);
const wss = new ws.Server({ server });
server.listen(port);


// ================================================================
// When a user connects
wss.on("connection", function(ws) {

	// ================================================================
	// Give this user an ID and push it to the players array
	let thisID = userID++;
	let thisGameIndex = games.length;
	players.push(ws);

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

		// Update thisGameIndex to match the actual index
		thisGameIndex--;

		game.players.push(thisID);		// Join the game
		game.assignRoles();				// Assign the roles

		// Send a message to both players indicating the game has started and which role they have
		var m = { message: messages.GAME_STARTS_MAKECODE, data: game }
		m = JSON.stringify(m);
		players[game.PLAYER_1 - 1].send(m);

		var m = { message: messages.GAME_STARTS_GUESSCODE, data: game }
		m = JSON.stringify(m);
		players[game.PLAYER_2 - 1].send(m);

	}


	// ================================================================
	// When the server reveices a message
	ws.on("message", function incoming(message) {

		MSG = JSON.parse(message);
		
		// DEBUGGING PURPOSES
		console.log("[MSG] ", MSG);

		
		// ----------------------------------------------------------------
		// If user inputs a code
		if(MSG.message.code === "INPUT_CREATED_CODE") {
			
			// If the code is invalid, send that to the user
			if(!Game.isValidCode(MSG.data)) {

				var m = { message: messages.ERRORS.INVALID_CODE, data: MSG.data };
				m = JSON.stringify(m);
				ws.send(m);

			}
			// Else (if code is valid)
			else {
				
				// Place the code in the game object
				var game = games[thisGameIndex];
				game.setCode(MSG.data);
				
				// Update other player
				var playerID = (game.players[0] === thisID ? game.players[1] : game.players[0]);

				var m = { message: messages.OPPONENT_CREATED_CODE, data: game, ID: playerID };
				m = JSON.stringify(m);
				players[playerID - 1].send(m);

			}

		} // if MSG === INPUT_CREATED_CODE

		// ----------------------------------------------------------------
		// If user inputs a guess
		else if(MSG.message.code === "INPUT_GUESS") {

			// If the guess is invalid, send that to the user
			if(!Game.isValidCode(MSG.data)) {

				var m = { message: messages.ERRORS.INVALID_GUESS, data: MSG.data };
				m = JSON.stringify(m);
				ws.send(m);

			}
			// Else (if guess is valid)
			else {
				
				// Place the guess in the game object and update the other player
				var game = games[thisGameIndex];
				game.addGuess(MSG.data);
				
				// Update other player
				var playerID = (game.players[0] === thisID ? game.players[1] : game.players[0]);

				var m = { message: messages.OPPONENT_MADE_GUESS, data: game, ID: playerID };
				m = JSON.stringify(m);
				players[playerID - 1].send(m);

			}

		}

		// ----------------------------------------------------------------
		// If user inputs a check to a guess
		else if(MSG.message.code === "INPUT_CHECKS") {

			var game = games[thisGameIndex];

			// If the code is invalid, send that to the user
			if(!Game.isValidCheck(game, MSG.data)) {

				var m = { message: messages.ERRORS.INVALID_CHECK, data: game };
				m = JSON.stringify(m);
				ws.send(m);

			}

			// Else (if the check is valid)
			else {

				var game = games[thisGameIndex];
				game.addResult(Game.sortCheck(MSG.data));
				game.incrementRow();

				console.log("Game ", game);

				// Update this player on the new order
				var m = { message: messages.CORRECTED_ORDER, data: game }
				m = JSON.stringify(m);
				ws.send(m);

				var playerID = (game.players[0] === thisID ? game.players[1] : game.players[0]);

				// Check whether the code is correct (if last item of latest result is red)
				if(game.results[game.results.length - 1][3] === "red") {
					
					var m = { message: messages.GUESSER_WINS, data: game };
					m = JSON.stringify(m);
					players[playerID - 1].send(m);

					var m = { message: messages.MAKER_LOSES, data: game };
					m = JSON.stringify(m);
					ws.send(m);


				}

				// Else, if the guessing player has no guesses left
				else if(game.currentRow === 11) {

					var m = { message: messages.GUESSER_LOSES, data: game };
					m = JSON.stringify(m);
					players[playerID - 1].send(m);

					var m = { message: messages.MAKER_WINS, data: game };
					m = JSON.stringify(m);
					ws.send(m);

				}

				// Else (if the code is not guessed), update other player
				else {
					var m = { message: messages.OPPONENT_CORRECTED, data: game, ID: playerID };
					m = JSON.stringify(m);
					players[playerID - 1].send(m);
				}

			}



		}



	});
	

	// ================================================================
	// When the user disconnects
	ws.on("close", function() {

		var game = games[thisGameIndex];

		// If it exists and has 2 players
		if(game && game.players.length === 2) {
				
			// Check which player we need to inform
			var toInform = (game.PLAYER_1 === thisID ? game.PLAYER_2 : game.PLAYER_1);
				
			// Send message and close the socket
			var m = { message: messages.OPPONENT_DISCONNECTED, data: game };
			m = JSON.stringify(m);
			players[toInform - 1].send(m);
			players[toInform - 1].close();

		} // Game has two players

		// Set game to null (if game has either 1 or 2 players)
		games[thisGameIndex] = null;

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