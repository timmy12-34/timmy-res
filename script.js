const chatbody = document.querySelector(".chat-body");
const messageinput = document.querySelector(".message-input");
const sendMessagebutton = document.querySelector("#send-message");
const fileinput = document.querySelector("#file-input");

const API_KEY = " AIzaSyAeoa4TIkfNn0p9RShfL4FZ_A7xdyEOyNI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY} `;
const userData = {
    message: null,
    file: {
        Data: null,
        mime_type: null
    }
}


//creating message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}
// Generate bot response using API
const generatebotresponse = async (incomingMessagediv) => {
    const messageElement = incomingMessagediv.querySelector(".message-text");

    //API request options
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                "parts": [{ text: userData.message }, ...(userData.file.Data ? [{ inline_data: userData.file }] : [])]
            }]
        })
    }
    try {
        //FETCH bot response from API
        const response = await fetch(API_URL, requestOptions);
        const Data = await response.json();
        if (!response.ok) throw new Error(Data.Error.usermessage);
        //extract and display bot response text
        const APIresponseText = Data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

        messageElement.innerText = APIresponseText;
    } catch (error) {
        console.log();
    } finally {
        incomingMessagediv.classList.remove("thinking");
        chatbody.scrollTo({ top: chatbody.scrollHeight, behavior: "smooth" });
        messageElement.innerText = APIresponseText;
        messageElement.style.color = "#ff0000"
    }

}
//handle out going user messages
const handleoutgoingMessages = (e) => {
    e.preventDefault();
    userData.message = messageinput.value.trim();
    messageinput.value = " ";

    //create and display user messages
    const messagecontent = `<div class="message-text"></div>`;
                   {
        userData.file.Data ? `<img src="data: ${userData.file.mime_type}; base64, ${userData.file.Data}" />` : "";
    }
    const outgoingMessagediv = createMessageElement(messagecontent, "user-message");
    outgoingMessagediv.querySelector(".message-text").textContent = userData.message;
    chatbody.appendChild(outgoingMessagediv);
    chatbody.scrollTo({ top: chatbody.scrollHeight, behavior: "smooth" });

    // simulate bot response with thinking indicator after a delay
    setTimeout(() => {
        const messagecontent = `   <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960"
                    width="48px" fill="#1f1f1f">
                    <path
                        d="M147-376q-45 0-76-31.21T40-483q0-44.58 31.21-75.79Q102.42-590 147-590v-123q0-24 18-42t42-18h166q0-45 31.21-76T480-880q44.58 0 75.79 31.21Q587-817.58 587-773h166q24 0 42 18t18 42v123q45 0 76 31.21T920-483q0 44.58-31.21 75.79Q857.58-376 813-376v196q0 24-18 42t-42 18H207q-24 0-42-18t-18-42v-196Zm196.24-100q16.76 0 28.26-11.74 11.5-11.73 11.5-28.5 0-16.76-11.74-28.26-11.73-11.5-28.5-11.5-16.76 0-28.26 11.74-11.5 11.73-11.5 28.5 0 16.76 11.74 28.26 11.73 11.5 28.5 11.5Zm274 0q16.76 0 28.26-11.74 11.5-11.73 11.5-28.5 0-16.76-11.74-28.26-11.73-11.5-28.5-11.5-16.76 0-28.26 11.74-11.5 11.73-11.5 28.5 0 16.76 11.74 28.26 11.73 11.5 28.5 11.5ZM312-285h336v-60H312v60ZM207-180h546v-533H207v533Zm273-267Z" />
                </svg>

                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
        const incomingMessagediv = createMessageElement(messagecontent, "bot-message", "thinking");
        chatbody.appendChild(incomingMessagediv);
        chatbody.scrollTo({ top: chatbody.scrollHeight, behavior: "smooth" });
        generatebotresponse(incomingMessagediv);
    }, 600);
}

//handling enter key press for messages
messageinput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage) {
        handleoutgoingMessages(e);
    }
});
//handle file input change
fileinput.addEventListener("change", () => {
    const file = fileinput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64string = e.target.split(",")[1]

        //store file data in user data 
        userData.file = {
            Data: base64string,
            mime_type: file.type
        }
        fileinput.value = "";

    }

    reader.readAsDataURL(file);
});


sendMessagebutton.addEventListener("click", (e) => handleoutgoingMessages(e));
document.querySelector("#file-upload").addEventListener("click", () => fileinput.click());