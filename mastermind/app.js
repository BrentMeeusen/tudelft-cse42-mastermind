// Node requires
var express = require("express");
var http = require("http");
var ws = require("ws");

// Server requirements
var port = process.argv[2] || 3000;
var app = express();

// My requires
var Game = require("./game");

// Websocket
app.use(express.static(__dirname + "/public"));
const server = http.createServer(app);
const wss = new ws.Server({ server });
server.listen(port);

// console.log(server);

wss.on("connection", function(ws) {

	setTimeout(function() {
		ws.send("Connection acknowledged.");
		console.log("Yay");

		// console.log(ws);
		// ws.close();
	}, 2000);

	setTimeout(function() {
		ws.send("Message after 6000ms.");
		console.log("Yay too");
		// ws.close();
	}, 6000);

	ws.on("message", function incoming(message) {
		console.log("[MSG] " + message);
	});

	ws.on("close", function() {
		console.log("User disconnected.");
	});

});



// EXAMPLE CODE
var Validation = require("./validation");
var av = new Validation.valid();
av.validate();



// Redirects
app.get("/", function(req, res) {
	res.sendFile("public/splash_screen.html", { root: "./" });
});
app.get("/game", function(req, res) {
	res.sendFile("public/game_guesser.html", { root: "./" });
});

app.get("/*.js", function(req, res) {
	res.sendFile(req.url, { root: "./" });
});
app.get("/*.png", function(req, res) {
	res.sendFile(req.url, { root: "./" });
});
app.get("/*", function(req, res) {
	res.sendFile("public/splash_screen.html", { root: "./" });
});




