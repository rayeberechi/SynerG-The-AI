const chatInput = document.getElementById("#chat-input");
const sendButton = document.getElementById("#send-btn");
const chatContainer  = document.getElementById(".chat-container");

let userText = null;

const createElement = (html, className) => {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add (chat, className);
    chatDiv.innerHTML = html;
    return chatDiv ; 
};

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    console.log(userText);
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="/Assets/Anon-rep.png" alt="user-img">
                    <p>${userText }</p>
                </div>
            </div>`;
            // create an ongoing chatDiv with users message and append it to chat  container
            const ongoingChatDiv = createElement ("html, ongoing"); 
            chatContainer.appendChild(ongoingChatDiv); 
}

sendButton.addEventListener("click", handleOutgoingChat); 