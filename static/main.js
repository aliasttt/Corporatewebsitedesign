// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Sticky Header on Scroll
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active Navigation Link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === '/' && linkPage === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Form Submission Handler
const contactForm = document.getElementById('contactForm');
const offerForm = document.getElementById('offerForm');

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message show';
    successMessage.textContent = 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.';
    
    // Insert success message before form
    form.parentNode.insertBefore(successMessage, form);
    
    // Reset form
    form.reset();
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => successMessage.remove(), 300);
    }, 5000);
    
    // Log form data (in production, this would be sent to a server)
    console.log('Form submitted:', Object.fromEntries(formData));
}

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

if (offerForm) {
    offerForm.addEventListener('submit', handleFormSubmit);
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Filter Functionality for References Page
const filterButtons = document.querySelectorAll('.filter-btn');
const referenceCards = document.querySelectorAll('.reference-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            referenceCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Scroll Animations (Fade in on scroll)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Phone Number Formatting (Turkish format)
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        e.target.value = value;
    });
});

// All DOMContentLoaded functionality in one place
document.addEventListener('DOMContentLoaded', () => {
    // Apply animation to cards and sections
    const animatedElements = document.querySelectorAll('.service-card, .reference-card, .about-preview-content, .contact-info-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Hero Carousel Functionality
    const carousel = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (carousel && slides.length > 0) {
    
    let currentSlide = 0;
    let autoPlayInterval;
    const slideInterval = 2000; // 2 seconds
    
    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, slideInterval);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.hero-carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            setTimeout(startAutoPlay, slideInterval);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
            setTimeout(startAutoPlay, slideInterval);
        });
    }
    
    // Indicator buttons
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(index);
            setTimeout(startAutoPlay, slideInterval);
        });
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                stopAutoPlay();
                nextSlide();
                setTimeout(startAutoPlay, slideInterval);
            } else {
                // Swipe right - previous slide
                stopAutoPlay();
                prevSlide();
                setTimeout(startAutoPlay, slideInterval);
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (carouselContainer && document.querySelector('.carousel-slide.active')) {
            if (e.key === 'ArrowLeft') {
                stopAutoPlay();
                prevSlide();
                setTimeout(startAutoPlay, slideInterval);
            } else if (e.key === 'ArrowRight') {
                stopAutoPlay();
                nextSlide();
                setTimeout(startAutoPlay, slideInterval);
            }
        }
    });
    }

    // Testimonials Infinite Scroll Animation
    const testimonialsTrack = document.querySelector('.testimonials-track');
    if (testimonialsTrack) {
        // Clone testimonials for seamless loop
        const testimonials = testimonialsTrack.querySelectorAll('.testimonial-card');
        testimonials.forEach(card => {
            const clone = card.cloneNode(true);
            testimonialsTrack.appendChild(clone);
        });
        
        // Add stagger animation delay to each card
        const allCards = testimonialsTrack.querySelectorAll('.testimonial-card');
        allCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.3}s`;
        });
        
        // Reset animation when it completes for infinite loop
        testimonialsTrack.addEventListener('animationiteration', () => {
            // Smooth reset
            testimonialsTrack.style.transition = 'none';
            setTimeout(() => {
                testimonialsTrack.style.transition = '';
            }, 50);
        });
    }
});
