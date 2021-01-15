const socket = new WebSocket("ws://localhost:3000");

socket.onmessage = function(event) {
	console.info("Incoming message: ", event.data);
	console.log("Raw object: ", event);
}

socket.onopen = function() {
	socket.send("Client joined a game...");
	console.info("Sending a message to the server...");
}


