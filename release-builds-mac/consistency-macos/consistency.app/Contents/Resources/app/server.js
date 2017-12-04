var express = require('express');
var http = require('http');
var path = require('path');

var appServer = express();
appServer.use(express.static(path.join(__dirname, '')));
appServer.use(express.static(__dirname + '/app'));

appServer.get('*', (req, res) => {
    res.sendFile(__dirname + '/app/splashscreen.html');
});

http.createServer(appServer).listen(3007, function() {
    console.log('Express server listening on port');
});
