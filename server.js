const express = require('express')
const ejs = require('ejs')
const {v4 : uuidv4} = require('uuid')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {ExpressPeerServer} = require('peer')
const peerServer= ExpressPeerServer(server, {
  debug : true
});

app.use('/peerjs', peerServer)
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get("/",(req,res)=>{
  res.redirect(`/${uuidv4()}`)
})
app.get("/:room",(req,res)=>{
  res.render('room',{roomId : req.params.room})
})

server.listen(3030,()=>{
  console.log("Server running on port 3030");
})

io.on('connection', socket =>{
  //The user will join the roomId
  socket.on('join-room',(roomId)=>{
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected');
  })
})
