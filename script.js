/* ============================================
   PERSONAL WEBSITE - SCRIPT
   Interactivity & Enhancements
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initContactLinks();
});

/* ============================================
   Navigation & Scroll Effects
   ============================================ */

function initNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const navbar = document.querySelector('.navbar');
    
    // Smooth scroll behavior for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just '#'
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                // Calculate offset based on navbar height
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active state to nav links based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   Scroll Effects & Animations
   ============================================ */

function initScrollEffects() {
    // Intersection Observer for fade-in effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and elements
    document.querySelectorAll('.skill-card, .award-card, .stat-card, .experience-card').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   Contact Methods
   ============================================ */

function initContactLinks() {
    // Add analytics tracking if needed (optional)
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const type = this.querySelector('.contact-label').textContent;
            
            // Track contact method clicks (optional)
            console.log(`Contact method clicked: ${type}`);
        });
    });
}

/* ============================================
   Dark Mode Toggle (Optional Enhancement)
   ============================================ */

function initDarkModeToggle() {
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    });
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params);
}

// Log page view for analytics
function logPageView() {
    if (typeof ga !== 'undefined') {
        ga('send', 'pageview');
    }
}

/* ============================================
   Performance Optimization
   ============================================ */

// Lazy load images if implemented
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/* ============================================
   CSS Class for Scroll Animations
   ============================================ */

const style = document.createElement('style');
style.textContent = `
    .skill-card,
    .award-card,
    .stat-card,
    .experience-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .skill-card.in-view,
    .award-card.in-view,
    .stat-card.in-view,
    .experience-card.in-view {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: #0066FF;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 5px;
    }
`;
document.head.appendChild(style);

/* ============================================
   Analytics Setup (Optional)
   ============================================ */

// Google Analytics snippet can be added here
// Remember to replace MEASUREMENT_ID with your actual Google Analytics ID

const analyticsSetup = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'MEASUREMENT_ID');
`;

// Uncomment and add your measurement ID when ready:
// eval(analyticsSetup);

