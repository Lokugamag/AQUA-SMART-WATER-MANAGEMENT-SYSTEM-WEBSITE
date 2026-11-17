
/* =====================================
   AQUA SMART WATER MANAGEMENT
   BASIC CHATBOT
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const chatToggle = document.getElementById("chat-toggle");
    const chatWindow = document.getElementById("chat-window");
    const chatClose = document.getElementById("chat-close");

    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");

    const chatMessages = document.getElementById("chat-messages");
    const quickQuestions = document.getElementById("quick-questions");

    // Open chatbot
    chatToggle.addEventListener("click", function () {
        chatWindow.classList.toggle("active");

        if (chatWindow.classList.contains("active")) {
            chatInput.focus();
        }
    });

    // Close chatbot
    chatClose.addEventListener("click", function () {
        chatWindow.classList.remove("active");
    });

    // Send message
    function sendMessage() {

        const message = chatInput.value.trim();

        if (message === "") return;

        addUserMessage(message);

        chatInput.value = "";

        setTimeout(function () {
            const response = getBotResponse(message);
            addBotMessage(response);
        }, 400);
    }

    // Add user message
    function addUserMessage(message) {

        const messageDiv = document.createElement("div");
        messageDiv.className = "user-message";

        const content = document.createElement("div");
        content.className = "message-content";

        const paragraph = document.createElement("p");
        paragraph.textContent = message;

        content.appendChild(paragraph);
        messageDiv.appendChild(content);

        chatMessages.appendChild(messageDiv);

        scrollToBottom();
    }

    // Add bot message
    function addBotMessage(message) {

        const messageDiv = document.createElement("div");
        messageDiv.className = "bot-message";

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = "💧";

        const content = document.createElement("div");
        content.className = "message-content";

        const paragraph = document.createElement("p");
        paragraph.textContent = message;

        content.appendChild(paragraph);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatMessages.appendChild(messageDiv);

        scrollToBottom();
    }

    // Scroll messages automatically
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // =================================
    // BOT RESPONSE SYSTEM
    // =================================

    function getBotResponse(message) {

        const text = message.toLowerCase().trim();

        // Greeting
        if (
            /\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)
        ) {
            return "Hello! 👋 Welcome to AQUA Smart Water Management. How can I assist you today?";
        }

        // About AQUA
        if (
            text.includes("what is aqua") ||
            text.includes("about aqua") ||
            text.includes("about the system")
        ) {
            return "AQUA is a Smart Water Management System designed to monitor water levels, manage water pumps, and provide useful water usage information through a digital platform.";
        }

        // Water Level
        if (
            text.includes("water level") ||
            text.includes("tank level") ||
            text.includes("water tank")
        ) {
            return "You can check the available water-level information through your AQUA Dashboard. The dashboard helps users monitor tank levels and identify low-water conditions. I cannot access your live tank readings in this basic chatbot.";
        }

        // Pump
        if (
            text.includes("pump") ||
            text.includes("motor")
        ) {
            return "The AQUA system helps users monitor water pump operations, including ON and OFF status. Please visit the Dashboard to check the available pump information. This chatbot cannot directly control your pump.";
        }

        // Water Usage
        if (
            text.includes("water usage") ||
            text.includes("water consumption") ||
            text.includes("usage")
        ) {
            return "You can review water usage information through the AQUA Reports section. Reports help users understand water consumption over different periods.";
        }

        // Reports
        if (
            text.includes("report") ||
            text.includes("analysis") ||
            text.includes("history")
        ) {
            return "Visit the Reports section in your AQUA Dashboard to view water management records, pump operating times, and available usage analysis.";
        }

        // Emergency
        if (
            text.includes("emergency") ||
            text.includes("leak") ||
            text.includes("leakage") ||
            text.includes("overflow")
        ) {
            return "🚨 Emergency Advice: If you notice water leakage or tank overflow, keep away from wet electrical equipment. If it is safe and you are authorized, switch off the water pump and contact the responsible maintenance team immediately.";
        }

        // Low Water
        if (
            text.includes("low water") ||
            text.includes("empty tank") ||
            text.includes("no water")
        ) {
            return "If the water level is low, check the tank and pump status through the AQUA Dashboard. If the issue continues, contact the responsible maintenance team.";
        }

        // Account
        if (
            text.includes("account") ||
            text.includes("profile") ||
            text.includes("password")
        ) {
            return "You can access your account and profile information using the Account section of your AQUA website. For password issues, follow your website's account recovery process.";
        }

        // Dashboard
        if (
            text.includes("dashboard") ||
            text.includes("home page")
        ) {
            return "The AQUA Dashboard provides an overview of your water management system, including available water-level information, pump status, and other monitoring details.";
        }

        // Contact
        if (
            text.includes("contact") ||
            text.includes("support") ||
            text.includes("help")
        ) {
            return "You can contact the AQUA support team through the Contact Us page on our website for further assistance.";
        }

        // Thank you
        if (
            text.includes("thank") ||
            text.includes("thanks")
        ) {
            return "You're very welcome! 💧 Thank you for using AQUA Smart Water Management.";
        }

        // Goodbye
        if (
            text.includes("bye") ||
            text.includes("goodbye")
        ) {
            return "Goodbye! 👋 Thank you for visiting AQUA. Have a wonderful day!";
        }

        // Default response
        return "I'm sorry, I couldn't understand your question. Please ask me about water levels, water pumps, water usage, reports, emergencies, or your AQUA account. 💧";
    }

    // Send button
    chatSend.addEventListener("click", sendMessage);

    // Enter key
    chatInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Quick question buttons
    quickQuestions.addEventListener("click", function (event) {

        const button = event.target.closest(".quick-btn");

        if (!button) return;

        chatInput.value = button.dataset.question;

        sendMessage();
    });

});
