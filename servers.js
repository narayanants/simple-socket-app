'use strict';

const express = require('express'),
	  app = express(),
	  server = require('http').createServer(),
	  io = require('socket.io').listen(server);

var users = [],
	connections = [];

app.get('/',(req,res)=>{
	res.sendFile(__dirname, +'/index.html');
});

io.sockets.on('connection',(socket)=>{
	connections.push(socket);
	console.log('Disconnected: %s sockets connected!',connections.length);

	socket.on('disconnect',(socket)=>{
		users.splice(users.indexOf(socket.username),1);
		updateUserNames();
		connections.splice(connections.indexOf(socket),1);
		console.log('Disconnected: %s sockets connected!',connections.length);
	});

	//send message
	socket.on('send message',(data)=>{
		io.sockets.emit('new message',{msg:data,user:socket.username});
	});
});