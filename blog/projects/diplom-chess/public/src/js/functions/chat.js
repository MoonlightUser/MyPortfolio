export function loadMassagesHTML (messages, person) {
    const chat = document.getElementById("chat-messages");
    for (let i = 0; i < messages.length; i++) {
        const message = document.createElement("div");
        message.classList.add("message");
        const messageName = document.createElement("span");
        messageName.classList.add("message-name");
        const messageText = document.createElement("span");
        messageText.classList.add("message-text");
        messageText.innerHTML = messages[i].message;
        if (messages[i].name === "System") {
            message.classList.add("system-message");
            messageName.classList.add("system-message-name");
        }
        else{
            message.classList.add(person === messages[i].name ? "my-message" : "other-message");
            messageName.classList.add(person === messages[i].name ? "my-message-name" : "other-message-name");
        }
        message.appendChild(messageName);
        message.appendChild(messageText);
        chat.appendChild(message);
    }
}

export function loadMassageHTML (messageData, person) {
    const chat = document.getElementById("chat-messages");
    const message = document.createElement("div");
    message.classList.add("message");
    const messageName = document.createElement("span");
    messageName.classList.add("message-name");
    const messageText = document.createElement("span");
    messageText.classList.add("message-text");
    messageText.innerHTML = messageData.message;
    message.appendChild(messageName);
    message.appendChild(messageText);
    if (messageData.name === "System") {
        message.classList.add("system-message");
        messageName.classList.add("system-message-name");
    }
    else{
        message.classList.add(person === messageData.name ? "my-message" : "other-message");
        messageName.classList.add(person === messageData.name ? "my-message-name" : "other-message-name");
    }
    chat.appendChild(message);
    chat.scrollIntoView();
}