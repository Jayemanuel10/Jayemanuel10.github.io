// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize AOS animation library
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });

    // Typed.js initialization for typing effect
    const typed = new Typed('.typed-text', {
        strings: ['Web Developer', 'Frontend Developer', 'UI/UX Enthusiast', 'Creative Designer'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 1000,
        loop: true
    });

    // Navbar color change on scroll
    const navbar = document.querySelector('.navbar');
    
    function toggleNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', toggleNavbar);
    toggleNavbar(); // Call on load

    // Active navigation links based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        let scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Call on load

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');

    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    }

    window.addEventListener('scroll', toggleBackToTop);
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simulating form submission (In a real project, connect to an actual API)
            // This is a placeholder for demonstration purposes
            setTimeout(() => {
                // Display success message
                formMessage.innerHTML = '<div class="alert alert-success">Your message has been sent. Thank you!</div>';
                
                // Clear form fields
                contactForm.reset();
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formMessage.innerHTML = '';
                }, 5000);
            }, 1000);
        });
    }

    // Animation for skill progress bars
    function animateSkills() {
        const skillsSection = document.getElementById('skills');
        const progressBars = document.querySelectorAll('.progress-bar');
        
        if (!skillsSection) return;
        
        const sectionTop = skillsSection.offsetTop;
        const sectionHeight = skillsSection.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > sectionTop - windowHeight + 200 && scrollPosition < sectionTop + sectionHeight) {
            progressBars.forEach(bar => {
                const value = bar.getAttribute('aria-valuenow');
                bar.style.width = value + '%';
            });
        }
    }
    
    window.addEventListener('scroll', animateSkills);
    animateSkills(); // Call on load

    // Add preloader
    const body = document.querySelector('body');
    
    // Create preloader element
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="spinner"></div>';
    
    // Insert preloader as first child of body
    body.insertBefore(preloader, body.firstChild);
    
    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    });

    // Projects filter functionality (can be expanded in the future)
    const projectCards = document.querySelectorAll('.project-card');
    
    // Simple animation for project cards
    function animateProjects() {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    }
    
    // Call after page load
    setTimeout(animateProjects, 1000);
});

// Optimize loading performance
// Add event listener for images loaded to improve perceived performance
window.addEventListener('load', function() {
    // Add lazy loading to images (modern browsers support this natively)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
});