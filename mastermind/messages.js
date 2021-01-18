const messages = {
	USER_CONNECTED: { code: "USER_CONNECTED", message: "User connected" },
	USER_DISCONNECTED: { code: "USER_DISCONNECTED", message: "User disconnected." },
	OPPONENT_DISCONNECTED: { code: "OPPONENT_DISCONNECTED", message: "Your opponent disconnected. The game has ended." },
	WAITING_FOR_PLAYERS: { code: "WAITING_FOR_PLAYERS", message: "We're waiting for one other player to begin the game..." },
	GAME_STARTS_MAKECODE: { code: "GAME_STARTS_MAKECODE", message: "The game has begun! Make your code..." },
	GAME_STARTS_GUESSCODE: { code: "GAME_STARTS_GUESSCODE", message: "The game has begun! Wait for the other player to make a code..." },
}

const clientMessages = {
	INPUT: { code: "INPUT", message: "User submitted input." },
}

exports.messages = messages;
exports.clientMessages = messages;
