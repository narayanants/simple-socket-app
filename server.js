'use strict';
const express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server);
var users = [],
    connections=[];


app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',(socket)=>{
    connections.push(socket);
    console.log('connected: %s sockets connected',connections.length);

    socket.on('disconnect',(data)=>{
      users.splice(users.indexOf(socket.username),1);
      updateUserNames();
      connections.splice(connections.indexOf(socket),1);
      console.log('Disconnected: %s sockets connected',connections.length);  
    });

    //send message
    socket.on('send message',(data)=>{
      io.sockets.emit('new message',{msg:data,user:socket.username});
    });

    socket.on('new user',(data,callback)=>{
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUserNames();
    });

    function updateUserNames(){
      io.sockets.emit('get users',users);
    }
});

server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000!');