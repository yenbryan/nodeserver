var http = require('http');
var express = require('express');

process.on('uncaughtException', function(err) {
  console.log(err);
});

var server = express();

server.use(express.static("www"));

exports.listen = function(port, callback) {
    server.listen(port, callback);
};

exports.close = function(callback) {
    server.close(callback);
};

server.listen(8081);
