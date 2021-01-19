// Set variables
const socket = new WebSocket("ws://localhost:3000");
let messages = {};
let canHandleInput = false;
let currentInput = [];
let action = null;
let currentRow = 1;
let startingTime = null;
let timeInterval = null;
const rows = document.getElementsByClassName("game-row");
const codeCircles = document.getElementById("answer-row").getElementsByClassName("code-circle");
const COLORS = ["red", "orange", "yellow", "blue", "cyan", "green", "purple", "pink"];




function updateTime() {

	currentTime = Math.floor(new Date().getTime() / 1000);
	minutesPassed = Math.floor((currentTime - startingTime) / 60);
	secondsPassed = Math.floor((currentTime - startingTime) % 60);

	format = minutesPassed + ":" + (secondsPassed <= 9 ? "0" : "") + secondsPassed;
	document.getElementById("game-dur").innerHTML = format;

}


// ================================================================
// Add functionality to RemoveLast button
document.getElementById("remove-last").addEventListener("click", function() {
	if(currentInput.length > 0) {
		var color = currentInput[currentInput.length - 1];

		if(action === "GAME_STARTS_MAKECODE" || action === "INVALID_CODE") {
			codeCircles[currentInput.length - 1].classList.remove(color + "-circle");
		}
		else if(action === "OPPONENT_CREATED_CODE" || action === "OPPONENT_CORRECTED" || action === "INVALID_GUESS") {
			let thisRow = rows[10 - currentRow];
			let circles = thisRow.getElementsByClassName("code-circle");
			circles[currentInput.length - 1].classList.remove(color + "-circle");
		}
		else if(action === "OPPONENT_MADE_GUESS" || action === "INVALID_CHECK") {
			let thisRow = rows[10 - currentRow];
			let circles = thisRow.getElementsByClassName("result-circle");
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
				if(action === "GAME_STARTS_MAKECODE" || action === "INVALID_CODE") {
					codeCircles[currentInput.length - 1].classList.add(this.dataset.color + "-circle");
				}
				// Else, if we're guessing the code, add it to the row we're working on
				else if(action === "OPPONENT_CREATED_CODE" || action === "OPPONENT_CORRECTED" || action === "INVALID_GUESS") {
					let thisRow = rows[10 - currentRow];
					let circles = thisRow.getElementsByClassName("code-circle");
					circles[currentInput.length - 1].classList.add(this.dataset.color + "-circle");
				}

				// If the input is full
				if(currentInput.length >= 4) {

					// Send input to the server...
					var m = { message: messages.INPUT_CREATED_CODE, data: currentInput };
					
					if(action === "OPPONENT_CREATED_CODE" || action === "OPPONENT_CORRECTED" || action === "INVALID_GUESS") {
						m.message = messages.INPUT_GUESS;
					}
					
					m = JSON.stringify(m);
					socket.send(m);

					// ...clear the input array, disable input, and display message
					currentInput = [];
					canHandleInput = false;
					var type = ((action === "GAME_STARTS_MAKECODE" || action === "INVALID_CODE") ? "code" : "guess");
					document.getElementById("status").innerHTML = "Your " + type + " has been saved. Now wait for the other player to guess!";

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
			let thisRow = rows[10 - currentRow];
			let circles = thisRow.getElementsByClassName("result-circle");
			circles[currentInput.length - 1].classList.add(currentInput[currentInput.length - 1] + "-circle");

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

	if(!canHandleInput) { return false; }

	// Send input to the server...
	var m = { message: messages.INPUT_CHECKS, data: currentInput };
	m = JSON.stringify(m);
	socket.send(m);

	// ...clear the input array, disable input, and display message
	currentInput = [];
	canHandleInput = false;

	document.getElementById("status").innerHTML = "Your correction has been saved. Now wait for the other player to guess!";


});




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
	

	// ----------------------------------------------------------------
	// If it's the first message we receive, set global variable messages to the data
	if(MSG.message.code === "MESSAGES") {
		messages = MSG.data;
	}

	// ----------------------------------------------------------------
	// If the game starts or the previous code was incorrect, show the correct input row
	else if(MSG.message.code === "GAME_STARTS_MAKECODE" || MSG.message.code === "INVALID_CODE") {
		
		// Set starting time and interval
		if(MSG.message.code === "GAME_STARTS_MAKECODE") {

			startingTime = Math.floor(new Date().getTime() / 1000);
			timeInterval = setInterval(function() {
				updateTime();
			}, 1000);

		}

		canHandleInput = true;		// Enable input
		document.getElementById("color-input").style.display = "block";
		document.getElementById("redwhite-input").style.display = "none";
		
		// Clear code row
		for(let i = 0; i < 4; i++) {
			for(let j = 0; j < COLORS.length; j++) {
				codeCircles[i].classList.remove(COLORS[j] + "-circle");
			}
		}

	}

	// ----------------------------------------------------------------
	// If it's the beginning of the game as guesser
	else if(MSG.message.code === "GAME_STARTS_GUESSCODE") {

		startingTime = Math.floor(new Date().getTime() / 1000);
		timeInterval = setInterval(function() {
			updateTime();
		}, 1000);

	}


	// ----------------------------------------------------------------
	// If it's time to make a guess as code guesser or if the previous guess was invalid
	else if((MSG.message.code === "OPPONENT_CREATED_CODE" || MSG.message.code === "INVALID_GUESS") && MSG.data.PLAYER_2 === MSG.ID) {
		
		canHandleInput = true;		// Enable input

		// Clear game row
		let thisRow = rows[10 - currentRow];
		let circles = thisRow.getElementsByClassName("code-circle");

		for(let i = 0; i < 4; i++) {
			for(let j = 0; j < COLORS.length; j++) {
				circles[i].classList.remove(COLORS[j] + "-circle");
			}
		}


	}

	// ----------------------------------------------------------------
	// If the other player made a guess or the check was invalid
	else if(MSG.message.code === "OPPONENT_MADE_GUESS" || MSG.message.code === "INVALID_CHECK") {

		// Enable input
		canHandleInput = true;
		document.getElementById("color-input").style.display = "none";
		document.getElementById("redwhite-input").style.display = "block";
		
		// Update latest row
		currentRow = MSG.data.currentRow;

		// Show the latest guess
		let latestGuess = MSG.data.guesses[MSG.data.guesses.length - 1];
		var thisRow = rows[10 - currentRow];
		var circles = thisRow.getElementsByClassName("code-circle");

		for(let i = 0; i < 4; i++) {
			circles[i].classList.add(latestGuess[i] + "-circle");
		}

		// Clear game row
		let resultCircles = thisRow.getElementsByClassName("result-circle");

		for(let i = 0; i < 4; i++) {
			resultCircles[i].classList.remove("red-circle");
			resultCircles[i].classList.remove("white-circle");
		}
	}

	// ----------------------------------------------------------------
	// If it's time to make a guess as code guesser or if the previous guess was invalid
	else if(MSG.message.code === "OPPONENT_CORRECTED") {
		
		canHandleInput = true;		// Enable input

		// Clear game row
		let thisRow = rows[10 - currentRow];
		let circles = thisRow.getElementsByClassName("result-circle");

		// Show latest correction
		let correction = MSG.data.results[MSG.data.results.length - 1];

		for(let i = 0; i < 4; i++) {
			if(correction[i]) { circles[i].classList.add(correction[i] + "-circle"); }
		}

		// Update current row
		currentRow = MSG.data.currentRow;


	}



}

// ================================================================
// When the socket closes
socket.onclose = function(event) {
	// Warn client in console
	console.warn("Socket closed!");
}


