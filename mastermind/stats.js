function Stats() {
	this.playersOnline = 0;
	this.playersInGame = 0;
	this.gamesInProgress = 0;
	this.totalGamesPlayed = 0;

	this.addOnlinePlayer = function() { this.playersOnline++; }
	this.removeOnlinePlayer = function() { this.playersOnline--; }
	this.addPlayerInGame = function() { this.playersInGame++; }
	this.removePlayerInGame = function() { this.playersInGame--; }
	this.addGameInProgress = function() { this.gamesInProgress++; }
	this.removeGameInProgress = function() { this.gamesInProgress--; }
	this.addTotalGamesPlayed = function() { this.totalGamesPlayed++; }
}



exports.stats = Stats;