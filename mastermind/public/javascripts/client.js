// Set variables
const socket = new WebSocket("ws://localhost:3000");
let messages = {};
let canHandleInput = false;
let currentInput = [];
let action = null;
let rows = document.getElementsByClassName("game-row");
let codeCircles = document.getElementById("answer-row").getElementsByClassName("code-circle");


// ================================================================
// Add functionality to RemoveLast button
document.getElementById("remove-last").AddEventListener("click", function() {
	if(currentInput.length > 0) {
		var color = currentInput[currentInput.length - 1];

		if(action === "GAME_STARTS_MAKECODE") {
			codeCircles.classList.remove(color + "-circle");
		}
		else if(action === "") {

		}
	}
});




// ================================================================
// Add click events to the color inputs
let colorInputs = document.getElementById("color-input").getElementsByClassName("code-circle");

// For all color inputs
for(c of colorInputs) {

	// When clicked...
	c.addEventListener("click", function() {
		
		// If input is allowed
		if(canHandleInput) {

			// If the color is unique, add it to the input
			if(!currentInput.includes(this.dataset.color)) {

				currentInput.push(this.dataset.color);

				// If we're making the code, add it to the top
				if(action === "GAME_STARTS_MAKECODE") {
					codeCircles[currentInput.length - 1].classList.add(this.dataset.color + "-circle");
				}
				// Else, if we're guessing the code, add it to the row we're working on
				else if(false) {

				}

				// If the input is full
				if(currentInput.length >= 4) {

					// Send input to the server...
					var m = { message: messages.INPUT_CREATED_CODE, data: currentInput };
					m = JSON.stringify(m);
					socket.send(m);

					// ...and clear the input array
					currentInput = [];

				}

			}
			// Else (if color is not unique)
			else {
				console.error("This colour is already selected!");
			}

		} 
		// Else (if !canHandleInput)
		else {
			console.error("You cannot input anything right now!");
		}

	}); // AddEventListener click

}


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

	action = MSG.message.code;

	// If it's the first message we receive, set global variable messages to the data
	if(MSG.message.code === "MESSAGES") {
		messages = MSG.data;
	}

	// If the game starts, show the correct input row
	if(MSG.message.code == "GAME_STARTS_MAKECODE") {
		
		// Colour input is already displayed, wait for the user to input a code
		canHandleInput = true;		// Enable input


	}


}

// ================================================================
// When the socket closes
socket.onclose = function(event) {
	// Warn client in console
	console.warn("Socket closed!");
}


