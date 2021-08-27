console.log=(e)=> {
    
}
// constants
var socket = null;

setSocket = ( )=>{
    socket = io ();
}

// Global states.

// Current displaying component
var currentComponent = null; 
const setCurrentComponent = (component) => {
    if(currentComponent!=null)
    currentComponent.style.display = "none"
    currentComponent = component;
}

// State to store userName
var userName = null;
const setuserName = name=> {
    userName = name;
    navBar ();
}

// State to store chat History
var chatHistory = [];
const setchatHistory = (value)=>{
    chatHistory = value;
}
const addChatHistory = (newChat)=>{
        chatHistory = [
            ...chatHistory,
            newChat
        ]
}




// utils 
const setComponentStyle = (component, style, prop="display") => {
    component.style[prop] = style;
}

const preventRefresh = () => {
    window.onbeforeunload = e=>{
        return  confirm ("")
    }

}



// Socket Operations

// Registering new Users
const registerNewUser = (socket, userName)=>{
    socket.emit("new-user",  userName)
}

const userExists = (socket, component, name)=>{

    socket.on("userExists", (move)=>{
    if(move)
        alert ("User already exists")
    else {
       setCurrentComponent (component("flex"));
       setuserName (name);
      }
    })
}


// Recieve Messages
const getMessage = (socket, AppendNewChat) => {
    socket.on("RecieveMessage", chat=>{
      if (chat.name!==userName)
        AppendNewChat (chat.name, "left", chat.time, chat.msgInput)
    })
}


// Send a messages
const sendMessage = (socket, chat) => {
    socket.emit ("NewMessage", chat);
}



// Components

// Navbar Component
const navBar = ()=> {
    const navBar = document.getElementById('navbar');
    const navName = document.getElementById('navName')
    navName.innerText = userName;
}

// Login Component
const login = (display)=>{

    const loginArea = document.getElementById("login")
    const loginForm = document.getElementById("loginForm")

    setComponentStyle (loginArea, display);
  if (display != "none") { 
    loginForm.addEventListener("submit",(e)=>{

        const username = loginForm["username"]
        const name = loginForm["fullname"]
        setSocket ();
        registerNewUser (socket, username.value)
        userExists(socket, chat, username.value)
      //  setuserName (username.value)
      //  setCurrentComponent (chat("flex"))

        loginForm.reset();
    

        e.preventDefault()
       // loginArea.style.display = "none"
    })
  }

  return loginArea;

}


// Chat Page Component
const chat = (display)=>{
    const chatArea = document.getElementById('chat-section');
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('msg-inputArea');
    const msgInput = chatInput["msg-input"];
    const chatting = document.getElementById('chatting');
    const setMsgInput = (value)=>{
        msgInput.value = value
    }

    

    //utils 
    const getTime = ()=> {
        const now = new Date();
        return `${now.getHours ()}:${now.getMinutes ()}`;
    }

    const loadChat = (chatHistory, AppendNewChat)=> {
                chatHistory.forEach(chat=>{
                    if (chat.name === userName) {
                        AppendNewChat(chat.name, "right", chat.time, chat.msgInput)
                    }
                    else AppendNewChat(chat.name, "left", chat.time, chat.msgInput)
                })
    }




    // components 
    const AppendNewChat = (name, side, time, msgInput) => {
        const msgHTML = `
        <div class="msg ${side}-msg">
    
          <div class="msg-bubble">
            <div class="msg-info">
              <div class="msg-info-name">${name}</div>
              <div class="msg-info-time">${time}</div>
            </div>
    
            <div class="msg-text">${msgInput}</div>
          </div>
        </div>
      `;
      chatContainer.style.paddingBottom = "70px";
       chatContainer.insertAdjacentHTML("beforeend", msgHTML);
            chatContainer.scrollTop+= 500
  
       

       addChatHistory({
           name,
           time,
           msgInput
       })

    
    }

    const ShowHistory = () => {
        setComponentStyle(chatting, "none")
        loadChat (chatHistory, AppendNewChat)
    }

    const showChat = ()=>{
        setComponentStyle(chatting, "flex");
    }


    setComponentStyle (chatArea, display)
    getMessage (socket, AppendNewChat)
    chatInput.addEventListener('submit', (e)=>{
        e.preventDefault ();
        console.log(msgInput.value);
     if (msgInput.value) {
        AppendNewChat (userName, "right", getTime (), msgInput.value)
        sendMessage (socket, {
            name: userName,
            time: getTime(),
            msgInput: msgInput.value

        })
    
        setMsgInput (null);
       }
    })
      //  Logout ();
        preventRefresh ();

    loadChat (chatHistory, AppendNewChat)
    return chatArea;
    
}


const Logout = ()=>{
    const logout = document.getElementById('Log-Out');
    setComponentStyle(logout, 'none')
    logout.addEventListener('click', ()=>{
         
            location.reload ( );
    })
}


window.onload = ()=>{
    setCurrentComponent (login("flex"));
}









