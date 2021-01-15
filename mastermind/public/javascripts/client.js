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

// When the socket closes
socket.onclose = function(event) {
	console.warn("Socket closed!");
}



setTimeout(function() {
	socket.send("Joe");
	console.info("Sent another message.");
}, 4000);



