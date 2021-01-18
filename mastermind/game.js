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



exports.game = Game;