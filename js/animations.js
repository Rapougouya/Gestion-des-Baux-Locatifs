// ==========================================================================
// ANIMATIONS.JS - Animations et effets visuels
// ==========================================================================

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.actor-card, .feature-card, .benefit-item, .metric-card').forEach(el => {
    observer.observe(el);
});

// Counter animation for metrics
const metricCards = document.querySelectorAll('.metric-card');

const startCounterAnimation = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metricValue = entry.target.querySelector('.metric-value');
            if (metricValue && !metricValue.classList.contains('animated')) {
                animateValue(metricValue);
                metricValue.classList.add('animated');
            }
        }
    });
};

const metricObserver = new IntersectionObserver(startCounterAnimation, { threshold: 0.5 });
metricCards.forEach(card => metricObserver.observe(card));

function animateValue(element) {
    const value = element.textContent;
    let start = 0;
    let end = parseInt(value.replace(/[^\d]/g, ''));
    let suffix = value.replace(/\d/g, '');
    let duration = 2000;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        let currentValue = Math.floor(easeOutQuart * end);
        
        if (value.includes('-') || value.includes('+')) {
            element.textContent = value.charAt(0) + currentValue + suffix;
        } else {
            element.textContent = currentValue + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Interactive platform showcase
const showcaseCards = document.querySelectorAll('.showcase-card');

showcaseCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        showcaseCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.style.transform = 'scale(0.95)';
                otherCard.style.opacity = '0.7';
            }
        });
    });
    
    card.addEventListener('mouseleave', () => {
        showcaseCards.forEach(otherCard => {
            otherCard.style.transform = '';
            otherCard.style.opacity = '';
        });
    });
});
