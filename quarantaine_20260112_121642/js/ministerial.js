/* ============================================
   PHASE 1 JAVASCRIPT - MINISTERIAL FEATURES
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Language selector
    initLanguageSelector();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Smooth scroll links
    initSmoothScroll();
    
    // Active nav link
    updateActiveNavLink();
    
    // Contact form
    initContactForm();
});

/**
 * Initialize language selector
 */
function initLanguageSelector() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Remove active class from all buttons
            langBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Store language preference
            localStorage.setItem('preferred-language', lang);
            
            // Show notification
            showNotification(`Langue changée en ${lang === 'fr' ? 'Français' : 'Anglais'}`);
            
            // In production, this would trigger language change logic
        });
    });
    
    // Set initial active language
    const savedLang = localStorage.getItem('preferred-language') || 'fr';
    document.querySelector(`[data-lang="${savedLang}"]`)?.classList.add('active');
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuBtn) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu?.classList.toggle('active');
    });
    
    // Close menu on link click
    navMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            navMenu?.classList.remove('active');
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page jump
                window.history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            
            if (section && section.offsetTop <= window.pageYOffset + 100) {
                current = link;
            }
        });
        
        navLinks.forEach(link => link.classList.remove('active'));
        if (current) current.classList.add('active');
    });
}

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const type = document.getElementById('contactType').value;
        const message = document.getElementById('contactMessage').value;
        
        // Validate
        if (!name || !email || !type || !message) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        // Simulate form submission (in production, send to server)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            showNotification('Votre message a été envoyé avec succès !', 'success');
            contactForm.reset();
        }, 1500);
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    
    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle"></i>'
        : type === 'error'
        ? '<i class="fas fa-exclamation-circle"></i>'
        : '<i class="fas fa-info-circle"></i>';
    
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()" aria-label="Fermer">&times;</button>
    `;
    
    // Add CSS if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 14px 18px;
                border-radius: 10px;
                background: white;
                border-left: 4px solid #3f6ff3;
                box-shadow: 0 8px 20px rgba(0,0,0,0.12);
                display: flex;
                gap: 12px;
                align-items: center;
                animation: slideIn 0.3s ease;
                z-index: 1000;
                max-width: 400px;
            }
            
            .notification.notification-success {
                border-left-color: #10b981;
            }
            
            .notification.notification-error {
                border-left-color: #ef4444;
            }
            
            .notification i {
                font-size: 1.1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.3rem;
                color: #6b7280;
                margin-left: auto;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Utility: Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Log page metrics (for analytics)
 */
function logPageMetrics() {
    const metrics = {
        timestamp: new Date().toISOString(),
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent.substring(0, 100),
        language: localStorage.getItem('preferred-language') || 'fr'
    };
    
    console.log('PNSBIL Page Metrics:', metrics);
    
    // In production, send to analytics service
}

// Call metrics on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logPageMetrics);
} else {
    logPageMetrics();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        initLanguageSelector,
        initMobileMenu,
        initSmoothScroll,
        isElementInViewport
    };
}
