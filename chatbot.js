// Customer Care Chatbot
(function() {
    'use strict';

    // Company email
    const COMPANY_EMAIL = 'info@kamsiexpress.com';

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

        // Send message and redirect to email
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
                addMessage('Opening your email app to contact us...', 'bot');
                
                // Open email app with user's message
                setTimeout(() => {
                    const subject = encodeURIComponent('Inquiry from KamsiExpress Website');
                    const body = encodeURIComponent(`Hello,\n\nI would like to get in touch regarding:\n\n${message}\n\n`);
                    const mailtoLink = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;
                    window.location.href = mailtoLink;
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

