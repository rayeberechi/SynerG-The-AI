// const chatInput = document.getElementById("#chat-input");
// const sendButton = document.getElementById("#send-btn");
// const chatContainer  = document.getElementById(".chat-container");

// let userText = null;

// const createElement = (html, className) => {
//     const chatDiv = document.createElement('div');
//     chatDiv.classList.add (chat, className);
//     chatDiv.innerHTML = html;
//     return chatDiv ; 
// };

// const handleOutgoingChat = () => {
//     userText = chatInput.value.trim();
//     console.log(userText);
//     const html = `<div class="chat-content">
//                 <div class="chat-details">
//                     <img src="/Assets/Anon-rep.png" alt="user-img">
//                     <p>${userText }</p>
//                 </div>
//             </div>`;
//             // create an ongoing chatDiv with users message and append it to chat  container
//             const ongoingChatDiv = createElement ("html, ongoing"); 
//             chatContainer.appendChild(ongoingChatDiv); 
// }

// sendButton.addEventListener("click", handleOutgoingChat); 

//  var-declarations
// Selecting necessary DOM elements
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const dltBtn = document.querySelector("#delete-btn");

// API Key
const API_KEY = "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";

// let userText = null; // Stores user input text
// const initialHeight = chatInput.offsetHeight; // Default chat input height

// Initialization Fxn
const loadDataFromLocalStorage = () => {
    // Load theme preference
    const themeColor = localStorage.getItem("theme-color");
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeBtn.innerHTML = document.body.classList.contains("light-mode") 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';

    // Load chat history or show default message
    const defaultText = `<div class="default-text">
                            <h1>SynerG | The AI</h1>
                            <p>Start a conversation and explore the power of AI. <br> Your chat history will display here.</p>
                         </div>`;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
loadDataFromLocalStorage(); // Execute on page load

//  Helper Fxns
const createElement = (html, className) => {
    // Creates a chat message element
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
    // Handles API call to fetch AI response
    // const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p"); // Response container


    const requestOptions = {
        // API request settings
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            top_p: 1,
            n: 1,
            stop: null
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
        }
        const data = await response.json();
        pElement.textContent = data.choices[0].text.trim();

    } catch (error) {
        console.error("API request failed:", error);
        pElement.classList.add("error");
        pElement.textContent = "Error getting response. Please try again later.";
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const copyResponse = (copyBtn) => {
    // Copies AI response to clipboard
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>'; 
    }, 1000);
};

const showTypingAnimation = () => {
    // Displays typing animation before AI response
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/Assets/Synergy-dAI-goldwhite.png" alt="user-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                        </div>
                    </div>
                    <span onClick="copyResponse(this)" class="material-symbols-rounded"><i class="fas fa-copy"></i></span>
                </div>`;

    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
};


const handleOutgoingChat = () => {
    // Handles sending user messages
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="/Assets/Anon-rep.png" alt="user-img">
                        <p></p>
                    </div>
                </div>`;

    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
};

//  Event Listeners
themeBtn.addEventListener("click", () => {
    // theme-toggler
    document.body.classList.toggle("light-mode");
    const themeColor = document.body.classList.contains("light-mode") ? "light_mode" : null;
    localStorage.setItem("theme-color", themeColor);
    themeBtn.innerHTML = document.body.classList.contains("light-mode") 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
});

dltBtn.addEventListener("click", () => {
    // Deletes chat history
    if (confirm("Are you sure you want to clear the chat history?")) {
        chatContainer.innerHTML = "";
        localStorage.removeItem("all-chats");
        chatInput.value = "";
    }
});

chatInput.addEventListener("input", () => {
    // Adjusts textarea height dynamically
    chatInput.style.height = "55px";
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 170)}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // Handles Enter key for sending message, Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

// Sends message when send button is clicked
sendButton.addEventListener("click", handleOutgoingChat);