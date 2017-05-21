const express = require('express'),
      app = express(),
      server = require('http').createServer(app);
      io = require('socket.io').listen(server);
      users = [],
      connections=[];


app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',(socket)=>{
    connections.push(socket);
    console.log('connected: %s sockets connected',connections.length);

    socket.on('disconnect',(data)=>{
      connections.splice(connections.indexOf(socket),1);
      console.log('Disconnected: %s sockets connected',connections.length);  
    });

    //send message
    socket.on('send message',(data)=>{
      console.llog(data);
      io.sockets.emit('new message',{msg:data});
    });
});

server.listen(process.env.PORT || 3000);
console.log('Server running on port 3000!');