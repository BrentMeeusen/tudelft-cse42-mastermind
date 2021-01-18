const socket = new WebSocket("ws://localhost:3000");
let messages = {};

// ================================================================
// When the socket opens
socket.onopen = function() {
	// Tell the server we connected
	// socket.send("Client joined a game...");
	// console.info("Sending a message to the server...");
}

// ================================================================
// When the socket receives a message
socket.onmessage = function(event) {

	let MSG = JSON.parse(event.data);

	// DEBUGGING PURPOSES
	console.info("Incoming message: ", MSG);

	// If it's the first message we receive, set global variable messages to the data
	if(MSG.message == "MESSAGES") {
		messages = message.data;
	}

	// If the game starts, show the correct input row


}

// ================================================================
// When the socket closes
socket.onclose = function(event) {
	// Warn client in console
	console.warn("Socket closed!");
}


