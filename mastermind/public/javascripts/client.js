const socket = new WebSocket("ws://localhost:3000");

// When the socket opens
socket.onopen = function() {
	socket.send("Client joined a game...");
	console.info("Sending a message to the server...");
}

// When the socket receives a message
socket.onmessage = function(event) {
	console.info("Incoming message: ", event.data);
	console.log("Raw object: ", event);
}



