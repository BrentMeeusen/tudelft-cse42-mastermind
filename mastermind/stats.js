class Stats {

	constructor() {
		this.playersOnline = 0;
		this.playersInGame = 0;
		this.gamesInProgress = 0;
		this.totalGamesPlayed = 0;
	}

	addOnlinePlayer() { this.playersOnline++; }
	removeOnlinePlayer() { this.playersOnline--; }
	addPlayerInGame() { this.playersInGame++; }
	removePlayerInGame() { this.playersInGame--; }
	addGameInProgress() { this.gamesInProgress++; }
	removeGameInProgress() { this.gamesInProgress--; }
	addTotalGamesPlayed() { this.totalGamesPlayed++; }
	removeTotalGamesPlayed() { this.totalGamesPlayed--; }

}



exports.stats = Stats;