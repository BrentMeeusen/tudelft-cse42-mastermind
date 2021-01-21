// Server must-haves
var express = require("express");
var http = require("http");
var ws = require("ws");
var ejs = require("ejs");
var port = process.argv[2] || 3000;
var app = express();

// My requires
var Game = require("./game").game;
const games = [];

var Message = require("./messages");
var messages = Message.messages;

var Stats = require("./stats");
var STATS = new Stats.stats();


// Keep track of players
let userID = 1;
const players = [];


// Start server and create WebSocket
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);
const wss = new ws.Server({ server });
server.listen(port);


// ================================================================
// ADDITIONAL METHODS
function findPlayerIndexOnID(ID) {
	for(let i = 0; i < players.length; i++) {
		if(players[i].ID === ID) { return i; }
	}
	return -1;
}



// ================================================================
// When a user connects
wss.on("connection", function(ws) {

	// ================================================================
	// Give this user an ID and assume it's in the game screen
	let thisID = userID++;
	let isInSplash = false;
	let thisGameIndex;

	// Send the user a message with all the messages they can send back to the server
	var m = { message: { code: "MESSAGES" }, data: Message.clientMessages };
	m = JSON.stringify(m);
	ws.send(m);

	// Add a player online
	STATS.addOnlinePlayer();
	// TEMPLATING
	// stats.playersOnline++;



	// ================================================================
	// When the server reveices a message
	ws.on("message", function incoming(message) {

		MSG = JSON.parse(message);

		// ================================================================
		// SPLASH SCREEN MESSAGES
		// ================================================================
		// If user enters splash screen
		if(MSG.message.code === "USER_ENTERS_SPLASH") {
			
			// Set isInSplash to true
			isInSplash = true;

			// Send current statistics so they don't have to wait for 15 seconds
			var m = { message: messages.STATS, data: STATS };
			m = JSON.stringify(m);
			ws.send(m);
			
		}

		// ----------------------------------------------------------------
		// If user requests the statistics
		if(MSG.message.code === "REQUEST_STATS") {

			// Send the statistics
			var m = { message: messages.STATS, data: STATS };
			m = JSON.stringify(m);
			ws.send(m);

		}



		// ================================================================
		// GAME MESSAGES
		// ================================================================
		// If user joins a game
		if(MSG.message.code === "USER_ENTERS_GAME") {
			
			// Assume the game index and push the player to the array
			thisGameIndex = games.length;
			players.push( { ID: thisID, socket: ws } );

			// If there's no games at all, or if the last game is full
			let game = games[games.length - 1];
			if(game == null || game.players.length === 2) {

				// Create a game
				games.push(new Game([thisID]));

				// Tell the user we're waiting for players
				var m = { message: messages.WAITING_FOR_PLAYERS, data: games[games.length - 1] };
				m = JSON.stringify(m);
				ws.send(m);

			}

			// Else (so if there is a game waiting for a player)
			else {

				// Update thisGameIndex to match the actual index
				thisGameIndex--;

				game.players.push(thisID);		// Join the game
				game.assignRoles();				// Assign the roles

				// Send a message to both players indicating the game has started and which role they have
				var m = { message: messages.GAME_STARTS_MAKECODE, data: game }
				m = JSON.stringify(m);
				players[findPlayerIndexOnID(game.PLAYER_1)].socket.send(m);

				var m = { message: messages.GAME_STARTS_GUESSCODE, data: game }
				m = JSON.stringify(m);
				players[findPlayerIndexOnID(game.PLAYER_2)].socket.send(m);
		
				// Add players and game to statistics
				STATS.addPlayerInGame();
				STATS.addPlayerInGame();
				STATS.addGameInProgress();
				STATS.addTotalGamesPlayed();
				// TEMPLATING
				// stats.playersInGame++;
				// stats.playersInGame++;
				// stats.gamesOngoing++;
				// stats.gamesPlayedTotal++;

			}

		}

		
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
				players[findPlayerIndexOnID(playerID)].socket.send(m);

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
				players[findPlayerIndexOnID(playerID)].socket.send(m);

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

				// Update this player on the new order
				var m = { message: messages.CORRECTED_ORDER, data: game }
				m = JSON.stringify(m);
				ws.send(m);

				var playerID = (game.players[0] === thisID ? game.players[1] : game.players[0]);

				// Check whether the code is correct (if last item of latest result is red)
				if(game.results[game.results.length - 1][3] === "red") {
					
					// If so, tell both players who won the game
					var m = { message: messages.GUESSER_WINS, data: game };
					m = JSON.stringify(m);
					players[findPlayerIndexOnID(playerID)].socket.send(m);

					var m = { message: messages.MAKER_LOSES, data: game };
					m = JSON.stringify(m);
					ws.send(m);

				}

				// Else, if the guessing player has no guesses left
				else if(game.currentRow === 11) {

					// If so, tell both players who won the game
					var m = { message: messages.GUESSER_LOSES, data: game };
					m = JSON.stringify(m);
					players[findPlayerIndexOnID(playerID)].socket.send(m);

					var m = { message: messages.MAKER_WINS, data: game };
					m = JSON.stringify(m);
					ws.send(m);

				}

				// Else (if the code is not guessed), update other player
				else {
					var m = { message: messages.OPPONENT_CORRECTED, data: game, ID: playerID };
					m = JSON.stringify(m);
					players[findPlayerIndexOnID(playerID)].socket.send(m);
				}
			}		// else (if check is valid)
		}		// else if MESSAGE === "INPUT_CHECKS"
	});		// ws.onmessage
	

	// ================================================================
	// When the user disconnects
	ws.on("close", function() {
	
		// Remove one player from shown as online
		STATS.removeOnlinePlayer();
		// TEMPLATING
		// stats.playersOnline--;

		// If the user is in splash screen, end the method here
		if(isInSplash) {
			return;
		}

		// Otherwise, find the game the user participated in
		var game = games[thisGameIndex];

		// If the game found exists, has 2 players, and this player is one of them
		if(game && game.players.length === 2 && game.players.includes(thisID)) {
				
			// Check which player we need to inform
			var toInform = (game.PLAYER_1 === thisID ? game.PLAYER_2 : game.PLAYER_1);
				
			// Send message and close the socket with that player
			var m = { message: messages.OPPONENT_DISCONNECTED, data: game };
			m = JSON.stringify(m);
			players[findPlayerIndexOnID(toInform)].socket.send(m);
			players[findPlayerIndexOnID(toInform)].socket.close();

			// Update statistics (do it here so it only runs once)
			STATS.removePlayerInGame();
			STATS.removePlayerInGame();
			STATS.removeGameInProgress();
			// TEMPLATING
			// stats.playersInGame--;
			// stats.playersInGame--;
			// stats.gamesOngoing--;
			
			// Remove game from array (here so it only runs once)
			games.splice(thisGameIndex, 1);


		} // Game has two players

		// Else (if the game the player participated in was not found)
		// Remove player from array if it was in a game
		if(!isInSplash) {
			players.splice(findPlayerIndexOnID(thisID), 1);
		}

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


// TEMPLATING STUFF

// // Server must-haves
// var express = require("express");
// var http = require("http");
// var ws = require("ws");
// var port = process.argv[2] || 3000;
// var app = express();

// // My requires
// var Game = require("./game").game;
// const games = [];

// var Message = require("./messages");
// var messages = Message.messages;

// var Stats = require("./stats");
// var STATS = new Stats.stats();

// // Keep track of players
// let userID = 1;
// const players = [];

// // Start server and create WebSocket
// app.use(express.static(__dirname + "/public"));

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// app.get("/", (req, res) => {
//     res.render("splash.ejs", {
//       playersOnline: stats.playersOnline,
//       playersInGame: stats.playersInGame,
//       gamesOngoing: stats.gamesOngoing,
//       gamesPlayedTotal: stats.gamesPlayedTotal
//     });
//   });

// app.get("/", function(req, res){
//   res.sendFile("splash_screen.html", {root: "./public"});
// });

  
//   app.get("/game_guesser", function(req, res){
//     res.sendFile("game_guesser.html", {root: "./public"});
//   });

// const server = http.createServer(app);
// const wss = new ws.Server({ server });
// server.listen(port);

// var stats = new Object();
// stats.playersOnline = 0;
// stats.playersInGame = 0;
// stats.gamesOngoing = 0;
// stats.gamesPlayedTotal = 0;