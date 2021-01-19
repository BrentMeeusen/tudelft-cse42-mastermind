//@ts-check
const socket = new WebSocket("ws://localhost:3000");
let messages = {};

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

