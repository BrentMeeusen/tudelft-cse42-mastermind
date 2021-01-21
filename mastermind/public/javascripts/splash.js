const socket = new WebSocket("ws://localhost:3000");
let messages = {};
let statsInterval;


// Request statistics every 15 seconds
statsInterval = setInterval(function() {
	
	var m = { message: messages.REQUEST_STATS };
	m = JSON.stringify(m);
	socket.send(m);

}, 5 * 1000);


// ================================================================
// When the socket receives a message
socket.onmessage = function(event) {
	
	let MSG = JSON.parse(event.data);

	// If it's the first message from the server
	if(MSG.message.code === "MESSAGES") {
		
		// Save the messages
		messages = MSG.data;

		// Send back that we're in the splash screen
		var m = { message: messages.USER_ENTERS_SPLASH };
		m = JSON.stringify(m);
		socket.send(m);

	}

	// If we get the stats
	else if(MSG.message.code === "STATS") {

		// Get the data...
		var playersOnline = MSG.data.playersOnline;
		var playersInGame = MSG.data.playersInGame;
		var gamesInProgress = MSG.data.gamesInProgress;
		var totalGamesPlayed = MSG.data.totalGamesPlayed;

		// ...and display it
		document.getElementById("players-online").innerHTML = playersOnline;
		document.getElementById("players-ingame").innerHTML = playersInGame;
		document.getElementById("games-in-progress").innerHTML = gamesInProgress;
		document.getElementById("total-games-played").innerHTML = totalGamesPlayed;

	}

}









document.getElementById("close-stats-popup").addEventListener("click", function() {
	toggleStats(false);
});


function toggleStats(forceOpen) {
	document.getElementById("stats").classList.toggle("active", forceOpen);
}


document.getElementById("close-howto-popup").addEventListener("click", function() {
	toggleStats2(false);
});


function toggleStats2(forceOpen) {
	document.getElementById("rules").classList.toggle("active", forceOpen);
}

