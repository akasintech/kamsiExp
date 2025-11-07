// Mobile Menu Toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

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


        // carousel
        document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('.carousel');
            const carouselItems = document.querySelectorAll('.carousel-item');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            const indicators = document.querySelectorAll('.indicator');
            const autoPlayToggle = document.querySelector('.auto-play-toggle');
            
            let currentIndex = 0;
            const totalItems = carouselItems.length;
            let autoPlayInterval;
            let isAutoPlaying = true;
            
            // Function to update carousel position
            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicators
                indicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            }
            
            // Next button event
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
                resetAutoPlay();
            });
            
            // Previous button event
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCarousel();
                resetAutoPlay();
            });
            
            // Indicator click events
            indicators.forEach(indicator => {
                indicator.addEventListener('click', function() {
                    currentIndex = parseInt(this.getAttribute('data-index'));
                    updateCarousel();
                    resetAutoPlay();
                });
            });
            
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
            
            // Initialize auto-play
            startAutoPlay();
        });

        
        // gallery
        document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('.carousel1');
            const items = document.querySelectorAll('.carousel1-item');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            const indicators = document.querySelectorAll('.indicator');
            const autoPlayToggle = document.getElementById('autoPlayToggle');
            
            let currentIndex = 0;
            let autoPlayInterval;
            const autoPlayDelay = 4000; // 4 seconds
            
            // Initialize auto-play
            startAutoPlay();
            
            // Function to update carousel position
            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicators
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });
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
            
            // Event listeners
            nextBtn.addEventListener('click', () => {
                nextSlide();
                // Reset auto-play timer on manual navigation
                if (autoPlayToggle.checked) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            });
            
            prevBtn.addEventListener('click', () => {
                prevSlide();
                // Reset auto-play timer on manual navigation
                if (autoPlayToggle.checked) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            });
            
            // Indicator click events
            indicators.forEach(indicator => {
                indicator.addEventListener('click', () => {
                    currentIndex = parseInt(indicator.getAttribute('data-index'));
                    updateCarousel();
                    
                    // Reset auto-play timer on manual navigation
                    if (autoPlayToggle.checked) {
                        stopAutoPlay();
                        startAutoPlay();
                    }
                });
            });
            
            // Auto-play toggle
            autoPlayToggle.addEventListener('change', function() {
                if (this.checked) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
            
            // Pause auto-play on hover
            carousel.addEventListener('mouseenter', () => {
                if (autoPlayToggle.checked) {
                    stopAutoPlay();
                }
            });
            
            carousel.addEventListener('mouseleave', () => {
                if (autoPlayToggle.checked) {
                    startAutoPlay();
                }
            });
        });
        
        