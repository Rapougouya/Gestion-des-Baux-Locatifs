/* ==========================================================================
   PNSBIL - Home Page Interactions & Animations
   Amélioration de l'intuitivité et de l'expérience utilisateur
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initScrollAnimations();
    initCounterAnimations();
    initFormValidation();
    initInteractiveElements();
    initProgressIndicators();
    
    console.log('PNSBIL - Plateforme Nationale de Suivi des Baux et Perception des Impôts Locatifs');
});

/* ==========================================================================
   Navigation fluide avec smooth scroll
   ========================================================================== */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            
            const targetId = href.replace('#', '');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                const header = document.querySelector('.site-header');
                if (header && header.classList.contains('is-open')) {
                    header.classList.remove('is-open');
                }
                
                // Mettre à jour l'URL sans déclencher de scroll
                history.pushState(null, null, href);
            }
        });
    });
    
    // Gérer la navigation active au scroll
    updateActiveSection();
    window.addEventListener('scroll', debounce(updateActiveSection, 100));
}

/* ==========================================================================
   Mise à jour de la section active dans la navigation
   ========================================================================== */
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav__link[href^="#"]');
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('#')) {
            const linkSection = href.split('#')[1];
            if (linkSection === currentSection) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        }
    });
}

/* ==========================================================================
   Animations au scroll avec Intersection Observer
   ========================================================================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                    fadeInObserver.unobserve(entry.target);
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll(`
        .actor-card,
        .feature-card,
        .benefit-item,
        .metric-card,
        .contact-detail,
        .legal-card
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        fadeInObserver.observe(el);
    });
}

/* ==========================================================================
   Animations de compteur pour les statistiques
   ========================================================================== */
function initCounterAnimations() {
    const metricObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                
                const metricValue = entry.target.querySelector('.metric-value');
                const statValue = entry.target.querySelector('.stat-number');
                const valueElement = metricValue || statValue;
                
                if (valueElement) {
                    const text = valueElement.textContent.trim();
                    const numberMatch = text.match(/[\d.]+/);
                    
                    if (numberMatch) {
                        const target = parseFloat(numberMatch[0]);
                        const suffix = text.replace(numberMatch[0], '');
                        const duration = 2000;
                        
                        animateCounter(valueElement, target, suffix, duration);
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-card, .stat-item-large').forEach(element => {
        metricObserver.observe(element);
    });
}

function animateCounter(element, target, suffix = '', duration = 2000) {
    let startTime = null;
    const isDecimal = target % 1 !== 0;
    
    function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = startTime === timestamp ? 0 : target * easeProgress;
        
        if (isDecimal) {
            element.textContent = current.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/* ==========================================================================
   Validation et amélioration du formulaire de contact
   ========================================================================== */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Ajouter des classes pour le styling
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('is-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('is-focused');
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitContactForm(this);
        } else {
            showFormMessage('Veuillez corriger les erreurs dans le formulaire.', 'error');
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Retirer les classes d'erreur précédentes
    field.classList.remove('is-invalid', 'is-valid');
    
    // Validation selon le type de champ
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Adresse email invalide';
        }
    }
    
    // Ajouter les classes appropriées
    if (isValid && value) {
        field.classList.add('is-valid');
    } else if (!isValid) {
        field.classList.add('is-invalid');
    }
    
    // Afficher/masquer le message d'erreur
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!isValid) {
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
    } else if (errorElement) {
        errorElement.remove();
    }
    
    return isValid;
}

function submitContactForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Désactiver le bouton et afficher un loader
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    // Simuler l'envoi (remplacer par un vrai appel API)
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        showFormMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        form.reset();
        
        // Retirer les classes de validation
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
    }, 2000);
}

function showFormMessage(message, type) {
    // Retirer les messages existants
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Créer le nouveau message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    const form = document.querySelector('.contact-form');
    form.insertBefore(messageElement, form.firstChild);
    
    // Animation d'apparition
    setTimeout(() => messageElement.classList.add('is-visible'), 10);
    
    // Supprimer après 5 secondes
    if (type === 'success') {
        setTimeout(() => {
            messageElement.classList.remove('is-visible');
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }
}

/* ==========================================================================
   Éléments interactifs (hover, click, etc.)
   ========================================================================== */
function initInteractiveElements() {
    // Amélioration des cartes avec effet de parallaxe léger
    const cards = document.querySelectorAll('.actor-card, .feature-card, .metric-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // Animation des badges au survol
    const badges = document.querySelectorAll('.badge, .highlight');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Amélioration des boutons CTA
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-outline');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Créer un effet de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* ==========================================================================
   Indicateurs de progression au scroll
   ========================================================================== */
function initProgressIndicators() {
    // Créer une barre de progression en haut de la page
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', debounce(function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, 10));
}

/* ==========================================================================
   Fonctions utilitaires
   ========================================================================== */
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
