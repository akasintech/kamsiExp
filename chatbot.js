// Customer Care Chatbot
(function() {
    'use strict';

    // WhatsApp number: +1 (810) 357-1487
    const WHATSAPP_NUMBER = '18103571487';
    const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

    // Check if current page is admin or login
    function isAdminOrLoginPage() {
        const path = window.location.pathname.toLowerCase();
        return path.includes('/admin/admin.html') || path.includes('/admin/login.html');
    }

    // Initialize chatbot
    function initChatbot() {
        // Don't show chatbot on admin/login pages
        if (isAdminOrLoginPage()) {
            return;
        }

        const chatbotContainer = document.getElementById('chatbot-container');
        if (!chatbotContainer) {
            return;
        }

        const chatbotButton = document.getElementById('chatbot-button');
        const chatbotWindow = document.getElementById('chatbot-window');
        const chatbotHeader = document.getElementById('chatbot-header');
        const chatbotCloseBtn = document.getElementById('chatbot-close');
        const chatbotMessages = document.getElementById('chatbot-messages');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSendBtn = document.getElementById('chatbot-send');
        const chatbotInputContainer = document.getElementById('chatbot-input-container');

        let isOpen = false;
        let hasShownGreeting = false;

        // Show greeting message when chatbot is first opened
        function showGreeting() {
            if (!hasShownGreeting) {
                hasShownGreeting = true;
                addMessage('Hello! How can we help you today?', 'bot');
            }
        }

        // Add message to chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message chatbot-message-${sender}`;
            
            const messageText = document.createElement('div');
            messageText.className = 'chatbot-message-text';
            messageText.textContent = text;
            
            messageDiv.appendChild(messageText);
            chatbotMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        // Open chatbot
        function openChatbot() {
            isOpen = true;
            chatbotWindow.classList.add('chatbot-window-open');
            chatbotButton.classList.add('chatbot-button-hidden');
            
            // Show greeting if not shown yet
            if (!hasShownGreeting) {
                setTimeout(() => {
                    showGreeting();
                }, 300);
            }
        }

        // Close chatbot
        function closeChatbot() {
            isOpen = false;
            chatbotWindow.classList.remove('chatbot-window-open');
            chatbotButton.classList.remove('chatbot-button-hidden');
        }

        // Send message and redirect to WhatsApp
        function sendMessage() {
            const message = chatbotInput.value.trim();
            
            if (!message) {
                return;
            }

            // Add user message to chat
            addMessage(message, 'user');
            
            // Clear input
            chatbotInput.value = '';

            // Show redirect message
            setTimeout(() => {
                addMessage('Please continue the discussion on WhatsApp with our customer care team. Redirecting you now...', 'bot');
                
                // Open WhatsApp after a short delay
                setTimeout(() => {
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappLink = `${WHATSAPP_URL}?text=${encodedMessage}`;
                    window.open(whatsappLink, '_blank');
                }, 1500);
            }, 500);
        }

        // Event listeners
        chatbotButton.addEventListener('click', openChatbot);
        chatbotCloseBtn.addEventListener('click', closeChatbot);
        chatbotHeader.addEventListener('click', closeChatbot);
        
        chatbotSendBtn.addEventListener('click', sendMessage);
        
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Close on outside click (optional - can be removed if not needed)
        chatbotWindow.addEventListener('click', function(e) {
            if (e.target === chatbotWindow) {
                closeChatbot();
            }
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();

