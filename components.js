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
      
                    <p>5900 NW 97th Ave unit 1, Miami, FL 33178, United States</span></p>
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

// Scroll-triggered animations using Intersection Observer
// This ensures content appears on all pages
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for components to be injected
    setTimeout(function() {
        // Create Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Check if element is already in or near viewport on page load
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            // More lenient check: element is visible (even partially) or within 200px of viewport
            // This ensures content that's already visible on page load gets animated immediately
            return (
                rect.top < windowHeight + 200 && // Element is visible or just above viewport
                rect.bottom > -200 && // Element is visible or just below viewport
                rect.left < windowWidth + 200 &&
                rect.right > -200
            );
        }
        
        // Helper function to check if element is inside navbar or footer
        function isInNavbarOrFooter(element) {
            return element.closest('.navbar') !== null || element.closest('footer') !== null;
        }
        
        // Observe all elements that should animate on scroll
        const animateElements = document.querySelectorAll(`
            h1, h2, h3, h4, h5, h6,
            p, li,
            img,
            .feature-card,
            .service-card,
            .service-card2,
            .service-item,
            .image-card,
            .Warehousing,
            .air,
            .ocean,
            .Operations-box,
            .Operations-container,
            .about-wirteup,
            .about-pic,
            .write-image,
            .world-class-list > *,
            .number-grid > *,
            .Testimonials-about,
            .happy-customer > *,
            .guaranteed-oppacity,
            .services-grid > *,
            .feature-tiles > *,
            .section-writeup,
            .section-three > *,
            .world-class,
            .services-hero__content,
            .services-intro,
            .choice-section,
            .affordable,
            .timely,
            .rate
        `);
        
        animateElements.forEach(el => {
            // Only observe if element exists, is in the DOM, and not in navbar/footer
            if (el && el.offsetParent !== null && !isInNavbarOrFooter(el)) {
                // If element is already in viewport, animate immediately
                if (isInViewport(el)) {
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, 100);
                } else {
                    observer.observe(el);
                }
            }
        });
        
        // Fallback: After a longer delay, animate any remaining visible elements
        // This catches elements that might have been missed due to timing issues
        setTimeout(function() {
            animateElements.forEach(el => {
                if (el && el.offsetParent !== null && !isInNavbarOrFooter(el) && !el.classList.contains('animated')) {
                    if (isInViewport(el)) {
                        el.classList.add('animated');
                    }
                }
            });
        }, 500);
    }, 100); // Small delay to ensure DOM is ready
});