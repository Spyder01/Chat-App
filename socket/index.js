//Function for socket operations.
const Socket = (io) => {

    var Users = [];

    // Make the socket connection to the client side.
     io.on('connection', socket=>{
        console.log('connection made');
        
        socket.on("new-user", (username)=>{
            
            if(!(Users.filter(user=>user.name).includes(username))) {
             console.log(`New User: ${username}`);
             socket.emit("userExists", false)
             Users.push({
                 id: socket.id,
                 name: username
             });
            }
            else {
               socket.emit("userExists", true)
            }
        } )


        socket.on("NewMessage", chat => {
            io.sockets.emit("RecieveMessage", chat)
        })

        socket.on("Disconnect", () =>{
            socket.disconnect();
        })

        
        // Event while socket is disconnected.
        socket.on('disconnect', ()=>{
            Users = Users.filter(user=>{
                if(user.id!==socket.id)
                  return user;
            })
            console.log('disconnected from the client side');
        })
     })
}

module.exports =  Socket