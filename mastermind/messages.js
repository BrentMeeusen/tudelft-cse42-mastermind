const messages = {
	USER_CONNECTED: { code: "USER_CONNECTED", message: "User connected" },
	USER_DISCONNECTED: { code: "USER_DISCONNECTED", message: "User disconnected." },
	OPPONENT_DISCONNECTED: { code: "OPPONENT_DISCONNECTED", message: "Your opponent disconnected. The game has ended." },
	WAITING_FOR_PLAYERS: { code: "WAITING_FOR_PLAYERS", message: "We're waiting for one other player to begin the game..." },
	GAME_STARTS_MAKECODE: { code: "GAME_STARTS_MAKECODE", message: "The game has begun! Make your code..." },
	GAME_STARTS_GUESSCODE: { code: "GAME_STARTS_GUESSCODE", message: "The game has begun! Wait for the other player to make a code..." },
	OPPONENT_CREATED_CODE: { code: "OPPONENT_CREATED_CODE", message: "Your opponent created the code. Time to make a guess!" },
	OPPONENT_MADE_GUESS: { code: "OPPONENT_MADE_GUESS", message: "Your opponent made a guess. Let's see how they did!" },
	OPPONENT_CORRECTED: { code: "OPPONENT_CORRECTED", message: "Your opponent corrected your guess. Make another guess!" },
	CORRECTED_ORDER: { code: "CORRECTED_ORDER", message: "Your correction has been rearranged to match our conventions (red/white/nothing)." },

	GUESSER_WINS: { code: "GUESSER_WINS", message: "Your guess was correct, well done!" },
	GUESSER_LOSES: { code: "GUESSER_LOSES", message: "The code maker managed to fool you... Let's teach them a lesson and try again!" },
	MAKER_WINS: { code: "MAKER_WINS", message: "Your code was so strong that they couldn't guess it. Well done!" },
	MAKER_LOSES: { code: "MAKER_LOSES", message: "The guesser got the code... Let's try that again, I'm sure you can fool them!" },


	ERRORS: {
		INVALID_CODE: { code: "INVALID_CODE", message: "Your code is invalid, please try again." },
		INVALID_GUESS: { code: "INVALID_GUESS", message: "Your guess is invalid, please try again." },
		INVALID_CHECK: { code: "INVALID_CHECK", message: "Your check is invalid/incorrect, please try again." },

	}
}


const clientMessages = {
	INPUT_CREATED_CODE: { code: "INPUT_CREATED_CODE", message: "User created a code." },
	INPUT_GUESS: { code: "INPUT_GUESS", message: "User submitted a guess." },
	INPUT_CHECKS: { code: "INPUT_CHECKS", message: "User submitted the red/white to the guess." },
	USER_ENTERS_SPLASH: { code: "USER_ENTERS_SPLASH", message: "User is in splash screen" }
}


exports.messages = messages;
exports.clientMessages = clientMessages;