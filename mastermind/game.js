// Class from which we can store each game with the necessary information
class Game {

	constructor(players) {
		this.players = players;
		this.PLAYER_1 = undefined;		// Player who makes and checks the code
		this.PLAYER_2 = undefined;		// Player who guesses the code
		this.guesses = [];				// Empty guess array
		this.results = [];				// Empty result array
	}

	// Randomly assign roles to players
	assignRoles() {
		this.PLAYER_1 = (Math.random() > 0.5 ? this.players[0] : this.players[1]);
		this.PLAYER_2 = (this.PLAYER_1 == this.players[0] ? this.players[1] : this.players[0]);
	}

	// Set the code inputted by the code maker
	setCode(code) {
		this.code = code;
	}

	// Add guess to the guess array
	addGuess(guess) {
		this.guesses.push(guess);
	}

	// Add result to the results array
	addResult(result) {
		this.results.push(result);
	}

}


// Find a player with a player ID
Game.findIndexOnPlayerID = function(ID, games) {

	for(let i = 0; i < games.length; i++) {
		if(games[i] && games[i].players.includes(ID)) {
			return i;
		}
	}

	return null;
}


// Validate the given code
Game.isValidCode = function(input) {

	// If the code doesn't contain 4 items, return false
	if(input.length !== 4) {
		return false;
	}

	// If there is a duplicate, return false
	for(let i = 0; i < 3; i++) {
		for(let j = i + 1; j < 4; j++) {
			if(input[i] === input[j]) {
				return false;
			}
		}
	}

	// Otherwise, return true
	return true;
}


// Validate the given check, and compare to latest guess to see if it is a correct check
Game.isValidCheck = function(game, input) {

	// If the check has more than 4 items, return false
	if(input.length > 4) {
		return false;
	}

	var reds = 0;
	var whites = 0;

	// For all check colours
	for(let i = 0; i < input.length; i++) {
		
		// Find out how many reds and whites are inputted, if anything else is inputted, it's not valid
		if(input[i] === "red") { reds++; }
		else if(input[i] === "white") { whites++; }
		else { return false; }

	}

	
	// Check the code against the latest guess
	var redsNeeded = 0;
	var whitesNeeded = 0;
	let latestGuess = game.guesses[game.guesses.length - 1];

	for(let i = 0; i < 4; i++) {
		if(game.code[i] === latestGuess[i]) {
			redsNeeded++;
		}
		else if(game.code.includes(latestGuess[i])) {
			whitesNeeded++;
		}
	}

	return reds === redsNeeded && whites === whitesNeeded;
}







exports.game = Game;