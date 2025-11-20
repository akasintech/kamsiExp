

        document.addEventListener('DOMContentLoaded', function () {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');

            if (!hamburger || !navMenu) {
                return;
            }

            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }));

            // Add active class to clicked nav item
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function() {
                    document.querySelectorAll('.nav-link').forEach(item => {
                        item.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });

            // Add animation to hamburger on click
            hamburger.addEventListener('click', function() {
                this.classList.toggle('open');
            });
        });


        // carousel
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.querySelector('.carousel-container');
            if (!container) return;

            const carousel = container.querySelector('.carousel');
            const carouselItems = container.querySelectorAll('.carousel-item');
            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');
            const indicators = container.querySelectorAll('.indicator');
            const autoPlayToggle = container.querySelector('.auto-play-toggle');
            if (!carousel || carouselItems.length === 0) return;
            
            let currentIndex = 0;
            const totalItems = carouselItems.length;
            let autoPlayInterval;
            let isAutoPlaying = true;
            
            // Function to update carousel position
            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicators
                if (indicators && indicators.length) {
                    indicators.forEach((indicator, index) => {
                        if (index === currentIndex) {
                            indicator.classList.add('active');
                        } else {
                            indicator.classList.remove('active');
                        }
                    });
                }
            }
            
            // Next button event
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    currentIndex = (currentIndex + 1) % totalItems;
                    updateCarousel();
                    resetAutoPlay();
                });
            }
            
            // Previous button event
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                    updateCarousel();
                    resetAutoPlay();
                });
            }
            
            // Indicator click events
            if (indicators && indicators.length) {
                indicators.forEach(indicator => {
                    indicator.addEventListener('click', function() {
                        currentIndex = parseInt(this.getAttribute('data-index'));
                        updateCarousel();
                        resetAutoPlay();
                    });
                });
            }
            
            // Auto-play functionality
            function startAutoPlay() {
                autoPlayInterval = setInterval(function() {
                    currentIndex = (currentIndex + 1) % totalItems;
                    updateCarousel();
                }, 4000);
            }
            
            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }
            
            function resetAutoPlay() {
                if (isAutoPlaying) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            }
            
            // Auto-play toggle
            if (autoPlayToggle) {
                autoPlayToggle.addEventListener('click', function() {
                    isAutoPlaying = !isAutoPlaying;
                    if (isAutoPlaying) {
                        startAutoPlay();
                        this.textContent = 'Pause Auto-Play';
                    } else {
                        stopAutoPlay();
                        this.textContent = 'Start Auto-Play';
                    }
                });
            }
            
            // Initialize auto-play
            startAutoPlay();
        });

        
        // gallery
        document.addEventListener('DOMContentLoaded', function() {
            const galleryContainer = document.querySelector('.gallery-container');
            if (!galleryContainer) return;

            const carousel = galleryContainer.querySelector('.carousel1');
            const items = galleryContainer.querySelectorAll('.carousel1-item');
            // Indicators are in the next sibling of galleryContainer
            const indicatorsWrapper = galleryContainer.nextElementSibling && galleryContainer.nextElementSibling.classList.contains('indicators')
                ? galleryContainer.nextElementSibling
                : null;
            const indicators = indicatorsWrapper ? indicatorsWrapper.querySelectorAll('.indicator') : [];

            if (!carousel || items.length === 0) return;
            
            let currentIndex = 0;
            let autoPlayInterval;
            const autoPlayDelay = 4000; // 4 seconds
            
            // Initialize auto-play
            startAutoPlay();
            
            // Function to update carousel position
            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicators
                if (indicators && indicators.length) {
                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === currentIndex);
                    });
                }
            }
            
            // Next slide function
            function nextSlide() {
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
            }
            
            // Previous slide function
            function prevSlide() {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                updateCarousel();
            }
            
            // Auto-play functions
            function startAutoPlay() {
                autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
            }
            
            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }
            
            // Indicator click events
            if (indicators && indicators.length) {
                indicators.forEach(indicator => {
                    indicator.addEventListener('click', () => {
                        currentIndex = parseInt(indicator.getAttribute('data-index'));
                        updateCarousel();
                        stopAutoPlay();
                        startAutoPlay();
                    });
                });
            }
            
            // Pause auto-play on hover (only on hover-capable devices, enable after brief delay)
            const supportsHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
            if (supportsHover) {
                // Defer enabling hover pause so initial pointer-over doesn't immediately stop autoplay
                setTimeout(() => {
                    carousel.addEventListener('mouseenter', () => {
                        stopAutoPlay();
                    });
    
                    carousel.addEventListener('mouseleave', () => {
                        startAutoPlay();
                    });
                }, 1500);
            }
        });
        
        // Scroll-triggered animations using Intersection Observer
        function initScrollAnimations() {
            // Create Intersection Observer
            const observerOptions = {
                threshold: 0.05,
                rootMargin: '0px 0px -100px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Check if element is already in viewport on page load (more lenient check)
            function isInViewport(element) {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const windowWidth = window.innerWidth || document.documentElement.clientWidth;
                return (
                    rect.top < windowHeight * 0.9 &&
                    rect.bottom > 0 &&
                    rect.left < windowWidth &&
                    rect.right > 0
                );
            }
            
            // Helper function to check if element is inside navbar or footer
            function isInNavbarOrFooter(element) {
                return element.closest('.navbar') !== null || element.closest('footer') !== null || element.closest('.track-navbar') !== null || element.closest('.track-footer') !== null;
            }
            
            // Observe all elements that should animate on scroll
            const animateElements = document.querySelectorAll(`
                img:not(.navbar img):not(footer img):not(.logo img),
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
                .world-class,
                .choice-section,
                .timely,
                .rate
            `);
            
            animateElements.forEach(el => {
                // Only observe if element exists, is in the DOM, and not in navbar/footer
                if (el && !isInNavbarOrFooter(el)) {
                    // If element is already in viewport, animate immediately
                    if (isInViewport(el)) {
                        setTimeout(() => {
                            el.classList.add('animated');
                        }, 200);
                    } else {
                        observer.observe(el);
                    }
                }
            });
            
            // Fallback: Show all elements after 2 seconds if they haven't been animated yet
            setTimeout(() => {
                animateElements.forEach(el => {
                    if (el && !isInNavbarOrFooter(el) && !el.classList.contains('animated')) {
                        el.classList.add('animated');
                    }
                });
            }, 2000);
        }
        
        // Initialize animations when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                // Wait a bit for components.js to inject nav/footer
                setTimeout(initScrollAnimations, 300);
            });
        } else {
            // DOM already loaded, wait for components
            setTimeout(initScrollAnimations, 500);
        }
        
        // Special handling for carousel captions - they should animate when carousel item is active
        function initCarouselAnimations() {
            const carouselItems = document.querySelectorAll('.carousel-item');
            if (carouselItems.length > 0) {
                const carouselObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const caption = entry.target.querySelector('.carousel-caption');
                            if (caption && !caption.classList.contains('animated')) {
                                caption.classList.add('animated');
                                setTimeout(() => {
                                    caption.style.opacity = '1';
                                    const h3 = caption.querySelector('h3');
                                    const p = caption.querySelector('p');
                                    const button = caption.querySelector('button');
                                    
                                    if (h3) {
                                        setTimeout(() => {
                                            h3.style.opacity = '1';
                                            h3.style.transform = 'translateY(0)';
                                        }, 200);
                                    }
                                    if (p) {
                                        setTimeout(() => {
                                            p.style.opacity = '1';
                                            p.style.transform = 'translateY(0)';
                                        }, 400);
                                    }
                                    if (button) {
                                        setTimeout(() => {
                                            button.style.opacity = '1';
                                            button.style.transform = 'scale(1)';
                                        }, 600);
                                    }
                                }, 300);
                            }
                        }
                    });
                }, { threshold: 0.3 });
                
                carouselItems.forEach(item => {
                    carouselObserver.observe(item);
                });
                
                // Animate first visible carousel item immediately
                const firstItem = carouselItems[0];
                if (firstItem) {
                    const caption = firstItem.querySelector('.carousel-caption');
                    if (caption) {
                        setTimeout(() => {
                            caption.classList.add('animated');
                            caption.style.opacity = '1';
                            const h3 = caption.querySelector('h3');
                            const p = caption.querySelector('p');
                            const button = caption.querySelector('button');
                            
                            if (h3) {
                                setTimeout(() => {
                                    h3.style.opacity = '1';
                                    h3.style.transform = 'translateY(0)';
                                }, 200);
                            }
                            if (p) {
                                setTimeout(() => {
                                    p.style.opacity = '1';
                                    p.style.transform = 'translateY(0)';
                                }, 400);
                            }
                            if (button) {
                                setTimeout(() => {
                                    button.style.opacity = '1';
                                    button.style.transform = 'scale(1)';
                                }, 600);
                            }
                        }, 500);
                    }
                }
            }
        }
        
        // Initialize carousel animations
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initCarouselAnimations, 300);
            });
        } else {
            setTimeout(initCarouselAnimations, 500);
        }
        
        