const clientTotal = document.getElementById("clients-total");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const nameInput = document.getElementById("name-input");
const messageContainer = document.getElementById("message-container");

const messageTone = new Audio("./audio/message-tone.mp3");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

// socket
const socket = io();
socket.on("total-clients", (data) => {
  clientTotal.innerText = `Users Online : ${data}`;
});
// after submit send message
function sendMessage() {
  console.log(messageInput.value);
  if (messageInput.value == "") {
    return;
  }
  const data = {
    user: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  // sending data to server side
  socket.emit("message", data);
  messageTone.play();
  // reading own message
  addMessage(true, data);
}

// receiving message after broadcast
socket.on("chat-message", (data) => {
  console.log(data);
  // messageTone.play();
  addMessage(false, data); //false as its sent by other
});

function addMessage(isOwnMessage, data) {
    // before new message feedback must be removed
    clearFeedback();
    
  const element = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
    <p class="message">
        ${data.message}
        <span>${data.user} ● ${moment(data.dateTime).fromNow()}</span>
    </p>
</li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}
function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

// feedback handle
messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

// after broadcast of feeback
socket.on("feedbackAfterBroadCast", (data) => {
    // before creating element , removing previous feedback
    clearFeedback();

  const element = `
  <li class="message-feedback">
    <p class="feedback" id="feedback">
      ${data.feedback}
    </p>    
  </li>
  `;
  messageContainer.innerHTML += element;
});

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    })
}