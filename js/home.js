// ==========================================================================
// HOME.JS - Interactions spécifiques à la page d'accueil
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Animation au scroll pour les éléments
    initScrollAnimations();
    
    // Barre de progression du scroll
    initScrollProgress();
    
    // Gestion du formulaire de contact
    initContactForm();
    
    // Effet ripple sur les boutons
    initRippleEffect();
    
    // Compteur animé pour les statistiques
    initCounterAnimation();
});

// Animation des éléments au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe fade-in-up
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
    
    // Ajouter la classe aux sections pour l'animation
    const sections = document.querySelectorAll('section:not(.hero-section)');
    sections.forEach((section, index) => {
        section.classList.add('fade-in-up');
        section.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Barre de progression du scroll
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Gestion du formulaire de contact
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;

    // Validation en temps réel
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', () => {
            input.closest('.form-row').classList.add('is-focused');
        });

        input.addEventListener('blur', () => {
            input.closest('.form-row').classList.remove('is-focused');
            validateField(input);
        });

        // Validation pendant la saisie
        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                validateField(input);
            }
        });
    });

    // Soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Valider tous les champs
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showMessage('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }

        // Simuler l'envoi (à remplacer par votre API)
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        // Simulation d'envoi (remplacer par fetch vers votre API)
        setTimeout(() => {
            showMessage('Message envoyé avec succès! Nous vous répondrons bientôt.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 2000);
    });
}

// Fonction de validation des champs
function validateField(input) {
    const row = input.closest('.form-row');
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Supprimer les messages d'erreur existants
    const existingError = row.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validation selon le type
    if (input.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    } else if (input.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Adresse email invalide';
        }
    }

    // Appliquer les classes de validation
    if (isValid && value !== '') {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else if (!isValid) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        // Afficher le message d'erreur
        const errorDiv = document.createElement('span');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        row.appendChild(errorDiv);
    } else {
        input.classList.remove('is-valid', 'is-invalid');
    }

    return isValid;
}

// Afficher un message de feedback
function showMessage(text, type) {
    const form = document.querySelector('.contact-form');
    
    // Supprimer les messages existants
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());

    // Créer le nouveau message
    const message = document.createElement('div');
    message.className = `form-message form-message--${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${text}</span>
    `;

    form.insertBefore(message, form.firstChild);

    // Animation d'apparition
    setTimeout(() => {
        message.classList.add('is-visible');
    }, 10);

    // Supprimer après 5 secondes
    setTimeout(() => {
        message.classList.remove('is-visible');
        setTimeout(() => message.remove(), 300);
    }, 5000);
}

// Effet ripple sur les boutons
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Animation des compteurs
function initCounterAnimation() {
    const counters = document.querySelectorAll('.metric-value, .stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// Animer un compteur
function animateCounter(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasPlus = text.includes('+');
    const hasMinus = text.includes('-');
    
    // Extraire le nombre
    let target = parseFloat(text.replace(/[^0-9.-]/g, ''));
    
    if (isNaN(target)) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            current = target;
            clearInterval(timer);
        }

        let displayValue = Math.abs(current).toFixed(target % 1 !== 0 ? 1 : 0);
        
        if (hasMinus) displayValue = '-' + displayValue;
        if (hasPlus && !hasMinus) displayValue = '+' + displayValue;
        if (hasPercent) displayValue += '%';
        
        element.textContent = displayValue;
    }, stepDuration);
}

// Utilitaire: Débounce pour optimiser les événements
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
