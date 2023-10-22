const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const API_KEY = "";
const inputInitHeight = chatInput.scrollHeight;


const predefinedResponses = {
    "hi":"Hey,myself TaxBuddy ChatBot.\nI can help you with following requirements:\n1.GST Rate Information\n2.GST Calculator\n3.GST Filing Assistance\n4.GST Updates\n5.GST Documents",
    "what is your name": "I am TaxBuddy ChatBot.",
    "how are you today": "I'm just a computer program, so I don't have feelings, but I'm here to assist you!",
    "what is gst" :"The Goods and Services Tax (GST) is a successor to VAT used in India on the supply of goods and services .GST is a digitalized form of VAT where you can also track the goods & services.",
    "what can you do": "I can help you with following requirements:\n1.GST Rate Information\n2.GST Calculator\n3.GST Filing Assistance\n4.GST Updates\n5.GST Documents", 
    "who is the principal of tsec":"Respected Dr. G. T. Thampi",
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    const predefinedResponse = predefinedResponses[userMessage];
    if (predefinedResponse) {
        messageElement.textContent = predefinedResponse;
        chatbox.scrollTo(0, chatbox.scrollHeight);
    } else {
      
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
            })
        }


        fetch(API_URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                messageElement.textContent = data.choices[0].message.content.trim();
                
            })
            .catch(() => {
                messageElement.classList.add("error");
                messageElement.textContent = "Oops! Something went wrong.";
            })
            .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); 
    if (!userMessage) return;

  
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
 
        const incomingChatLi = createChatLi("Thinking....", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
   
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));