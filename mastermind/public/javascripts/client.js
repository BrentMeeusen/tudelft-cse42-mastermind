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
	// MSG contains data and {code: "", message: ""}
	console.log(MSG.message.code, "-", MSG.message.message);

	// If it's the first message we receive, set global variable messages to the data
	if(MSG.message.code === "MESSAGES") {
		messages = MSG.data;
	}

	// If the game starts, show the correct input row
	if(MSG.message.code == "GAME_STARTS_MAKECODE") {
		
		// Colour input is already displayed, wait for the user to input a code


	}


}

// ================================================================
// When the socket closes
socket.onclose = function(event) {
	// Warn client in console
	console.warn("Socket closed!");
}


