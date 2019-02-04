
var app = require('express')();
var port = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io')(http);



const myrooms = ["node","python"];
var rooms = {};
var room = '';

app.get('/:room', function(req, res){
  room = req.params.room;
  // res.sendFile(__dirname + '/index.html');
});


io.on("connection",(socket)=>{

  rooms[socket.id] = room;
  console.log("chat app connected");
  io.emit("welcome","hello");

  //Join room
  socket.on("joinRoom",(room)=>{
    if(myrooms.includes(room)){
      socket.join(room);
      return socket.emit("success","you have joined the room "+ room);
   }else{
     return socket.emit("err","Not a valid room name "+ room);
   }
  });


    socket.on("chat message",(msg)=>{
      console.log("you can now send messages")

      io.sockets.in(rooms[socket.id]).emit("chat message",msg);
    });

  });





http.listen(port,()=>{
console.log("Server started on "+ port);
});
