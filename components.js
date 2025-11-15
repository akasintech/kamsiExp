const footer = document.getElementById('footer')
const nav = document.getElementById('nav')

const navComponent = `
                <div class="container nav-container" style='z-index: 2000;'>
            <a href="index.html" class="logo track-logo">
                <div class="logo-text">
                    <span class="logo-name logo">
                        <i class="fas fa-rocket"></i>
                        <div style="display: flex; flex-direction: column;">
                            <span style="color: #1e3a8a; opacity: 1;">
                               Kamsi<span style="color: #ff4500; opacity: 1;">express</span> 
                            </span>
                        <span class="logo-tagline" style="opacity: 1;">WORLD CLASS SHIPPING SERVICE</span> 
                        </div>
                </span>
                </div>
            </a>
            <input type='checkbox' id="toggle" style='display: none'>

            <ul class="nav-menu" id="nav-menu">
            <li><a href="index.html" class="${window.location.pathname.includes('/index.html')  ? 'nav-link active' : 'nav-link'}">Home</a></li>
                <li class="nav-item-dropdown">
                    <div href="about.html" class="${window.location.pathname.includes('/about.html') || window.location.pathname.includes('/about') || window.location.pathname.includes('/warehouse') || window.location.pathname.includes('/logistics') || window.location.pathname.includes('/company-name') ? 'nav-link active has-dropdown' : 'nav-link has-dropdown'}">
                        About Us <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
                    </div>
                    <ul class="dropdown-menu" style='z-index: 1000; '>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="warehouse.html">Warehousing</a></li>
                        <li><a href="logistics.html">Logistics</a></li>
                        <li><a href="company-name.html">Company Name</a></li>
                    </ul>
                </li>
                <li><a href="services.html" class="${window.location.pathname.includes('/services.html') || window.location.pathname.includes('/services')  ? 'nav-link active' : 'nav-link'}">Services</a></li>
                <li><a href="track.html" class="${window.location.pathname.includes('/track.html') || window.location.pathname.includes('/track') ? 'nav-link active' : 'nav-link'}">Track</a></li>
                <li><a href="resources.html" class="${window.location.pathname.includes('/resources.html') || window.location.pathname.includes('/resources') ? 'nav-link active' : 'nav-link'}">Resources</a></li>
                <li><a href="contact.html" class="${window.location.pathname.includes('/contact.html') || window.location.pathname.includes('/contact') ? 'nav-link active' : 'nav-link'}">Contact Us</a></li>
            </ul>

            <label for='toggle' class="hamburger" id='hamburger'>
                <span></span>
                <span></span>
                <span></span>
            </label>
        </div>        
                `
nav.innerHTML = navComponent  


const footerComponent = `   
        <div class="footer-content">
            <div class="footer-column">
                <div class="footer-logo">
                    <a href="index.html" class="logo track-logo" style="opacity: 1;">
                        <div class="logo-text">
                            <span class="logo-name logo">
                                <i class="fas fa-rocket"></i>
                                <div style="opacity: 1; display: flex; flex-direction: column; align-items: start;">
                                    <span style="color: #1e3a8a; opacity: 1;">
                                       Kamsi<span style="color: #ff4500; opacity: 1;">express</span> 
                                    </span>
                                <span class="logo-tagline" style="font-size: 0.6rem; opacity: 1;">WORLD CLASS SHIPPING SERVICE</span> 
                                </div>
                        </span>
                        </div>
                    </a>
                </div>
                <div class="footer-contact">
      
                    <p>5900 NW 97th Ave unit 1, Miami, FL 33178, United States</span></p>
                    <p>Email: <span>info@kamsiexpress.com</span></p>
                    <p>Phone: <span>+48 669 545 804</span><br><span>+1 (810) 357-1487</span></p>
                </div>
            </div>
            <div class="footer-column">
                <h2 class="footer-heading">Our Services</h2>
                <ul class="footer-list">
                    <li><a href="#">Door to Door and Door to Airport</a></li>
                    <li><a href="#">Courier and Express</a></li>
                    <li><a href="#">Warehousing and Storage</a></li>
                    <li><a href="#">Packaging and Inspection</a></li>
                    <li><a href="#">Custom Clearance</a></li>
                    <li><a href="#">Pick Ups</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h2 class="footer-heading">Quick Links</h2>
                <ul class="footer-list">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h2 class="footer-heading">Resources</h2>
                <ul class="footer-list">
                    <li><a href="track.html">Track Shipment</a></li>
                    <li><a href="faq.html">FAQ</a></li>
                    <li><a href="account-opening.html">Account Opening</a></li>
                    <li><a href="package-acceptance.html">Package Acceptance</a></li>
                    <li><a href="ocean-freight-authorization.html">Ocean Freight Authorization</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-copyright">
            <p>Copyright © 2024 KamsiExpress. All Rights Reserved.</p>
        </div>            
`

footer.innerHTML = footerComponent

// Chatbot HTML Component
function initChatbotComponent() {
    // Check if current page is admin or login
    const path = window.location.pathname.toLowerCase();
    const isAdminPage = path.includes('/admin/admin.html') || path.includes('/admin/login.html');
    
    // Don't add chatbot on admin/login pages
    if (isAdminPage) {
        return;
    }

    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <button id="chatbot-button" class="chatbot-button" aria-label="Open customer care chatbot">
            <i class="fas fa-headset"></i>
        </button>
        <div id="chatbot-window" class="chatbot-window">
            <div id="chatbot-header" class="chatbot-header">
                <div class="chatbot-header-title">
                    <i class="fas fa-headset"></i>
                    <h3>Customer Care</h3>
                </div>
                <button id="chatbot-close" class="chatbot-close" aria-label="Close chatbot">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages"></div>
            <div id="chatbot-input-container" class="chatbot-input-container">
                <input 
                    type="text" 
                    id="chatbot-input" 
                    class="chatbot-input" 
                    placeholder="Type your message..."
                    aria-label="Type your message"
                />
                <button id="chatbot-send" class="chatbot-send" aria-label="Send message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatbotContainer);
    
    // Load chatbot script
    const chatbotScript = document.createElement('script');
    chatbotScript.src = 'chatbot.js';
    chatbotScript.async = true;
    document.body.appendChild(chatbotScript);
}

// Initialize chatbot component
initChatbotComponent();
