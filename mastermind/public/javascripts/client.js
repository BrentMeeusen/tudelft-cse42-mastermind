const socket = new WebSocket("ws://localhost:3000");
let messages = {};
let ID = 0;

// When the socket opens
socket.onopen = function() {
	// Tell the server we connected
	// socket.send("Client joined a game...");
	// console.info("Sending a message to the server...");
}

// When the socket receives a message
socket.onmessage = function(event) {

	let message = JSON.parse(event.data);

	// DEBUGGING PURPOSES
	console.info("Incoming message: ", message);

	// If it's the first message we receive, set global variable messages to the data
	if(message.message == "MESSAGES") {
		messages = message.data;
		ID = message.ID;
	}


}

// When the socket closes
socket.onclose = function(event) {
	// Warn client in console
	console.warn("Socket closed!");
}


