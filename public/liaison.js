var express = require('express');
var bodyParser = require("body-parser");
var app     = express();

var TestLBC = require('./TestLBC.js');
var TestMA = require('./TestMA.js');


app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/webinterface', function(req, res){
	res.sendFile( __dirname  + '/liaison.html');
});

app.get('/result', function(req, res){
	
	var url = req.param("ad-lbc"); 
		
	console.log(url);	
		
	TestLBC.getLBC(url, res, TestMA.getMA);	
});


app.listen('8081')
console.log('Lancement du serveur / Launch of server');
