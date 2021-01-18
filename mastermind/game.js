// Class from which we can store each game with the necessary information
class Game {

	constructor(players) {
		this.players = players;
		this.PLAYER_1 = undefined;		// Player who makes and checks the code
		this.PLAYER_2 = undefined;		// Player who guesses the code
	}

	// Randomly assign roles to players
	assignRoles() {
		this.PLAYER_1 = (Math.random() > 0.5 ? this.players[0] : this.players[1]);
		this.PLAYER_2 = (this.PLAYER_1 == this.players[0] ? this.players[1] : this.players[0]);
	}

}


// Find a player with a player ID
Game.findGameOnPlayerID = function(ID, games) {
	for(let i = 0; i < games.length; i++) {

		// If the game is found
		if(games[i] && games[i].players.includes(ID)) {
			return games[i];
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







exports.game = Game;