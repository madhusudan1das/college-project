const chatBox = document.getElementById("chatBox");

async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();

    if (message === "") return;

    // User message
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerText = message;
    chatBox.appendChild(userMessage);

    userInput.value = "";

    // Loading message
    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerText = "Typing...";
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("http://localhost:5000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        botMessage.innerText =
            data.reply || data.error || "No response from AI.";
    } catch (error) {
        botMessage.innerText = "Error connecting to AI server.";
        console.error(error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send on Enter key
document
    .getElementById("userInput")
    .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });