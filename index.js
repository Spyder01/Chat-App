//Initializing an express app, a http server and socket.io respectively.
const express = require('express');
const app = express ();
const server = require('http').Server(app);
const io = require('socket.io')(server);


// Handling env variables.
const env  = require('dotenv'); 
env.config ()


// Import required methods. 
const Socket = require('./socket')  //For Sockets. 

//set Static folder.
app.use(express.static('./public'))

//Set an ejs view engine. 
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{              //Render the template.
    res.render('index.ejs');
})

// Initialize the socket function.
Socket (io);



//Initialize the port. 
const PORT = process.env.PORT;

// Listen to server at the port.
server.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
})