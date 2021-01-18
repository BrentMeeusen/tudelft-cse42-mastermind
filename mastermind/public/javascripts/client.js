const socket = new WebSocket("ws://localhost:3000");
const messages = {};

// When the socket opens
socket.onopen = function() {
	// Tell the server we connected
	// socket.send("Client joined a game...");
	// console.info("Sending a message to the server...");
}

// When the socket receives a message
socket.onmessage = function(event) {
	// Do stuff with that message
	console.info("Incoming message: ", event.data);
}

// When the socket closes
socket.onclose = function(event) {
	// Warn client in console
	console.warn("Socket closed!");
}


