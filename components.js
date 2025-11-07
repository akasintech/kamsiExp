const footer = document.getElementById('footer')
const nav = document.getElementById('nav')

const navComponent = `
                <div class="container nav-container">
            <a href="index.html" class="logo track-logo">
                <div class="logo-text">
                    <span class="logo-name logo">
                        <i class="fas fa-rocket"></i>
                        <div style="display: flex; flex-direction: column;">
                            <span style="color: #1e3a8a;">
                               Kamsi<span style="color: #ff4500;">express</span> 
                            </span>
                        <span class="logo-tagline">WORLD CLASS SHIPPING SERVICE</span> 
                        </div>
                </span>
                </div>
            </a>

            <ul class="nav-menu" id="nav-menu">
            <li><a href="index.html" class="${window.location.pathname.includes('/index.html')  ? 'nav-link active' : 'nav-link'}">Home</a></li>
                <li class="nav-item-dropdown">
                    <a href="about.html" class="${window.location.pathname.includes('/about.html') || window.location.pathname.includes('/about') || window.location.pathname.includes('/warehouse') || window.location.pathname.includes('/logistics') || window.location.pathname.includes('/company-name') ? 'nav-link active has-dropdown' : 'nav-link has-dropdown'}">
                        About Us <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
                    </a>
                    <ul class="dropdown-menu">
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

            <button class="hamburger" id='hamburger' onclick="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>        
                `
nav.innerHTML = navComponent  


const footerComponent = `   
        <div class="footer-content">
            <div class="footer-column">
                <div class="footer-logo">
                    <a href="index.html" class="logo track-logo">
                        <div class="logo-text">
                            <span class="logo-name logo">
                                <i class="fas fa-rocket"></i>
                                <div style="display: flex; flex-direction: column; align-items: start;">
                                    <span style="color: #1e3a8a;">
                                       Kamsi<span style="color: #ff4500;">express</span> 
                                    </span>
                                <span class="logo-tagline" style="font-size: 0.6rem;">WORLD CLASS SHIPPING SERVICE</span> 
                                </div>
                        </span>
                        </div>
                    </a>
                </div>
                <div class="footer-contact">
                    <p>Address 1: <span>1825 Pennsylvania Ave. Linden, New Jersey, 07036</span></p>
                    <p>Address 2: <span>Plot 5, Block 89F Famous, Enearu Street, Off Alakoso Avenue, Opp. ABC Trans. Terminal, Amuwo Odofin, Lagos, Nigeria</span></p>
                    <p>Email: <span>info@kamsiexpress.com</span></p>
                    <p>Phone: <span>+1 908 275 3675, +1 848 628 0207</span></p>
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

function toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    console.log(hamburger, navMenu);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}
