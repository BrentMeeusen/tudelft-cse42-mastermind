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


wss.on("connection", function(ws) {
	setTimeout(function() {
		console.log("State: " + ws.readyState);
		ws.send("Thanks for your message!");
		ws.close();
		console.log("State: " + ws.readyState);
	}, 2000);

	wss.on("message", function incoming(message) {
		console.log("[MSG] " + message);
	});
});
server.listen(port);



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
app.get("/*", function(req, res) {
	res.sendFile("public/splash_screen.html", { root: "./" });
});




