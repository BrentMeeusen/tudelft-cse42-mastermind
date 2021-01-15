var express = require("express");
var http = require("http");
var ws = require("ws");

var port = process.argv[2] || 3000;
var app = express();


app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);



var Validation = require("./validation");
var av = new Validation.valid();
av.validate();



app.get("/", function(req, res) {
	res.sendFile("public/splash_screen.html", { root: "./" });
});


app.get("/something", function(req, res) {
	res.send("/splash_screen.html");
});




