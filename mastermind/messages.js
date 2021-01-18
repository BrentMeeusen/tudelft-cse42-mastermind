class Message {

	constructor(message, data) {
		this.message = message;
		this.data = data;
	}

	message() {
		return this.message;
	}
	data() {
		return this.data;
	}

}


const messages = {
	USER_CONNECTED: "User connected.",
	USER_DISCONNECTED: "User disconnected.",
}


exports.Message = Message;
exports.messages = messages;
