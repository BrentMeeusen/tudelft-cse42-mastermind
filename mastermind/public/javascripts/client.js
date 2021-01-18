// Set variables
const socket = new WebSocket("ws://localhost:3000");
let messages = {};
let canHandleInput = false;
let currentInput = [];
let action = null;
let rows = document.getElementsByClassName("game-row");
let currentRow = 1;
let codeCircles = document.getElementById("answer-row").getElementsByClassName("code-circle");


// ================================================================
// Add functionality to RemoveLast button
document.getElementById("remove-last").addEventListener("click", function() {
	if(currentInput.length > 0) {
		var color = currentInput[currentInput.length - 1];

		if(action === "GAME_STARTS_MAKECODE") {
			codeCircles[currentInput.length - 1].classList.remove(color + "-circle");
		}
		else if(action === "OPPONENT_CREATED_CODE") {
			let thisRow = rows[10 - currentRow];
			let circles = thisRow.getElementsByClassName("code-circle");
			circles[currentInput.length - 1].classList.remove(color + "-circle");

		}

		currentInput.splice(currentInput.length - 1, 1);
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
				else if(action === "OPPONENT_CREATED_CODE") {
					let thisRow = rows[10 - currentRow];
					let circles = thisRow.getElementsByClassName("code-circle");
					circles[currentInput.length - 1].classList.add(this.dataset.color + "-circle");
				}

				// If the input is full
				if(currentInput.length >= 4) {

					// Send input to the server...
					var m = { message: messages.INPUT_CREATED_CODE, data: currentInput };
					
					if(action === "OPPONENT_CREATED_CODE") {
						m.message = messages.INPUT_GUESS;
					}
					
					m = JSON.stringify(m);
					socket.send(m);

					// ...clear the input array, and disable input
					currentInput = [];
					canHandleInput = false;
					
				}

			}
			// Else (if color is not unique)
			else {
				console.error("This colour is already selected!");
			}

		} 
		// Else (if input is not allowed)
		else {
			console.error("You cannot input anything right now!");
		}

	}); // addEventListener click

}





// ================================================================
// Add click events to the red/white inputs
let redwhiteInputs = document.getElementById("redwhite-input").getElementsByClassName("code-circle");

	// For all color inputs
	for(c of redwhiteInputs) {

	// When clicked...
	c.addEventListener("click", function() {
		
		// If input is allowed
		if(canHandleInput) {

			currentInput.push(this.dataset.color);

			// Add the color to the circle
			var thisRow = rows[10 - currentRow];
			var circles = thisRow.getElementsByClassName("result-circle");

			for(let i = 0; i < 4; i++) {
				circles[i].classList.add(currentInput[i] + "-circle");
			}

		}
		// Else (if input is not allowed)
		else {
			console.error("You cannot input anything right now!");
		}

	}); // addEventListener click

}


// ================================================================
// Add click event to the checkmark button
document.getElementById("send-checks").addEventListener("click", function() {

	// Send input to the server...
	var m = { message: messages.INPUT_CHECKS, data: currentInput };
	m = JSON.stringify(m);
	socket.send(m);

	// ...clear the input array, and disable input
	currentInput = [];
	canHandleInput = false;

});



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
	console.log(MSG);

	document.getElementById("status").innerHTML = MSG.message.message;

	action = MSG.message.code;
	

	// If it's the first message we receive, set global variable messages to the data
	if(MSG.message.code === "MESSAGES") {
		messages = MSG.data;
	}

	// If the game starts, show the correct input row
	else if(MSG.message.code === "GAME_STARTS_MAKECODE") {
		
		canHandleInput = true;		// Enable input
		document.getElementById("color-input").style.display = "block";
		document.getElementById("redwhite-input").style.display = "none";

	}

	// If it's time to make a guess as code guesser
	else if(MSG.message.code === "OPPONENT_CREATED_CODE" && MSG.data.PLAYER_2 === MSG.ID) {
		
		canHandleInput = true;		// Enable input

	}

	// If the other player made a guess 
	else if(MSG.message.code === "OPPONENT_MADE_GUESS") {

		// Enable input
		canHandleInput = true;
		document.getElementById("color-input").style.display = "none";
		document.getElementById("redwhite-input").style.display = "block";

		// Show the latest guess
		let latestGuess = MSG.data.guesses[MSG.data.guesses.length - 1];
		var thisRow = rows[10 - currentRow];
		var circles = thisRow.getElementsByClassName("code-circle");

		for(let i = 0; i < 4; i++) {
			circles[i].classList.add(latestGuess[i] + "-circle");
		}
	}


}

// ================================================================
// When the socket closes
socket.onclose = function(event) {
	// Warn client in console
	console.warn("Socket closed!");
}


