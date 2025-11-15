// ==========================================================================
// AUTH.JS - Système de simulation de connexion - VERSION CORRIGÉE
// ==========================================================================

// Base de données simulée des utilisateurs avec chemins relatifs
const simulatedUsers = {
    // Administrateur
    'admin@pnsbil.com': {
        password: 'admin123',
        type: 'admin',
        name: 'Administrateur PNSBIL',
        role: 'Administrateur Système',
        dashboard: 'administrateurs/dashboard.html'
    },
    
    // Propriétaire
    'proprietaire@example.com': {
        password: 'proprio123',
        type: 'proprietaire',
        name: 'Jean Kaboré',
        role: 'Propriétaire',
        dashboard: 'proprietaires/dashboard.html'
    },
    
    // Locataire
    'locataire@example.com': {
        password: 'locataire123',
        type: 'locataire',
        name: 'Marie Ouédraogo',
        role: 'Locataire',
        dashboard: 'locataires/dashboard.html'
    },
    
    // Agence immobilière
    'agence@example.com': {
        password: 'agence123',
        type: 'agence',
        name: 'Agence Immobilière BF',
        role: 'Agence Immobilière',
        dashboard: 'agences/dashboard.html'
    },
    
    // Administration
    'agentfiscaux@example.com': {
        password: 'fiscal123',
        type: 'agent',
        name: 'Ministère du Logement',
        role: 'Direction Générale des Impôts',
        dashboard: 'agents-fiscaux/dashboard.html'
    },
        // Agent municipal
    'agentmunicipaux@example.com': {
        password: 'municipal123',
        type: 'agent',
        name: 'Mairie',
        role: 'Mairie de Ouagadougou',
        dashboard: 'agents-municipaux/dashboard.html'
    }
};

// Comptes de démonstration supplémentaires
const demoAccounts = [
    {
        email: 'demo-proprietaire@pnsbil.com',
        password: 'demo123',
        type: 'proprietaire',
        name: 'Demo Propriétaire',
        role: 'Propriétaire Démo',
        dashboard: 'proprietaires/dashboard.html'
    },
    {
        email: 'demo-locataire@pnsbil.com',
        password: 'demo123',
        type: 'locataire',
        name: 'Demo Locataire',
        role: 'Locataire Démo',
        dashboard: 'locataires/dashboard.html'
    },
    {
        email: 'demo-agence@pnsbil.com',
        password: 'demo123',
        type: 'agence',
        name: 'Demo Agence',
        role: 'Agence Démo',
        dashboard: 'agences/dashboard.html'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du système d\'authentification');
    initializeAuthSystem();
});

function initializeAuthSystem() {
    // Password visibility toggle
    initializePasswordToggle();
    
    // Quick access buttons
    initializeQuickAccess();
    
    // Forgot password modal
    initializeForgotPassword();
    
    // Form submissions
    initializeFormSubmissions();
    
    // Demo accounts panel
    initializeDemoPanel();
    
    console.log('✅ Système d\'authentification PNSBIL initialisé');
}

function initializePasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
}

function initializeQuickAccess() {
    const accessBtns = document.querySelectorAll('.access-btn');
    accessBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            accessBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour les suggestions en fonction du type
            updateUserSuggestions(this.dataset.type);
        });
    });
}

function initializeDemoPanel() {
    // Créer le panneau de démonstration s'il n'existe pas
    if (!document.getElementById('demoPanel')) {
        const demoPanel = document.createElement('div');
        demoPanel.id = 'demoPanel';
        demoPanel.className = 'demo-panel';
        demoPanel.innerHTML = `
            <div class="demo-header">
                <h4>📋 Comptes de Démonstration</h4>
                <button class="demo-toggle">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="demo-content">
                <div class="demo-account" data-email="admin@pnsbil.com" data-password="admin123">
                    <div class="demo-role">👑 Administrateur</div>
                    <div class="demo-email">admin@pnsbil.com</div>
                    <div class="demo-password">Mot de passe: admin123</div>
                    <div class="demo-path">→ administrateurs/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="proprietaire@example.com" data-password="proprio123">
                    <div class="demo-role">🏠 Propriétaire</div>
                    <div class="demo-email">proprietaire@example.com</div>
                    <div class="demo-password">Mot de passe: proprio123</div>
                    <div class="demo-path">→ proprietaires/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="locataire@example.com" data-password="locataire123">
                    <div class="demo-role">🔑 Locataire</div>
                    <div class="demo-email">locataire@example.com</div>
                    <div class="demo-password">Mot de passe: locataire123</div>
                    <div class="demo-path">→ locataires/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="agence@example.com" data-password="agence123">
                    <div class="demo-role">🏢 Agence Immobilière</div>
                    <div class="demo-email">agence@example.com</div>
                    <div class="demo-password">Mot de passe: agence123</div>
                    <div class="demo-path">→ agences/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="agentfiscaux@example.com" data-password="fiscal123">
                    <div class="demo-role">🏛️ Agent Fiscal</div>
                    <div class="demo-email">agentfiscaux@example.com</div>
                    <div class="demo-password">Mot de passe: fiscal123</div>
                    <div class="demo-path">→ agents-fiscaux/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="agentmunicipaux@example.com" data-password="municipal123">
                    <div class="demo-role">🏛️ Agent Municipal</div>
                    <div class="demo-email">agentmunicipaux@example.com</div>
                    <div class="demo-password">Mot de passe: municipal123</div>
                    <div class="demo-path">→ agents-municipaux/dashboard.html</div>
                </div>
            </div>
        `;
        
        // Ajouter le panneau au conteneur du formulaire
        const authFormSide = document.querySelector('.auth-form-side');
        if (authFormSide) {
            authFormSide.appendChild(demoPanel);
            
            // Gestion du toggle
            const demoToggle = demoPanel.querySelector('.demo-toggle');
            const demoContent = demoPanel.querySelector('.demo-content');
            
            demoToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                demoContent.classList.toggle('expanded');
                this.querySelector('i').className = demoContent.classList.contains('expanded') 
                    ? 'fas fa-chevron-up' 
                    : 'fas fa-chevron-down';
            });
            
            // Gestion des clics sur les comptes de démo
            demoPanel.querySelectorAll('.demo-account').forEach(account => {
                account.addEventListener('click', function() {
                    const email = this.dataset.email;
                    const password = this.dataset.password;
                    
                    // Remplir les champs du formulaire
                    const emailInput = document.getElementById('loginEmail');
                    const passwordInput = document.getElementById('loginPassword');
                    
                    if (emailInput && passwordInput) {
                        emailInput.value = email;
                        passwordInput.value = password;
                        
                        // Highlight le compte sélectionné
                        demoPanel.querySelectorAll('.demo-account').forEach(acc => acc.classList.remove('selected'));
                        this.classList.add('selected');
                        
                        console.log('👤 Compte démo sélectionné:', email);
                        
                        // Auto-connexion après 1 seconde
                        setTimeout(() => {
                            // Déclencher l'événement de soumission du formulaire
                            const loginForm = document.getElementById('loginForm');
                            if (loginForm) {
                                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                                loginForm.dispatchEvent(submitEvent);
                            }
                        }, 1000);
                    }
                });
            });
            
            // Ouvrir le panneau par défaut
            demoContent.classList.add('expanded');
            demoToggle.querySelector('i').className = 'fas fa-chevron-up';
            
        } else {
            console.error('❌ Conteneur .auth-form-side non trouvé');
        }
    }
}

// S'assurer que la fonction est appelée au chargement
document.addEventListener('DOMContentLoaded', function() {
    initializeDemoPanel();
});

function initializeForgotPassword() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModalBtn = document.querySelector('.btn-close');
    const cancelModalBtn = document.querySelector('.btn-cancel');

    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'block';
        });
        
        [closeModalBtn, cancelModalBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function() {
                    forgotPasswordModal.style.display = 'none';
                });
            }
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === forgotPasswordModal) {
                forgotPasswordModal.style.display = 'none';
            }
        });
    }
}

function initializeFormSubmissions() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Formulaire de connexion soumis');
            handleLogin();
        });
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('remember')?.checked;

    console.log('🔐 Tentative de connexion avec:', { email, rememberMe });

    // Validation de base
    if (!email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }

    // Simulation de vérification des identifiants
    const user = simulatedUsers[email] || demoAccounts.find(acc => acc.email === email);
    
    if (user && user.password === password) {
        console.log('✅ Identifiants corrects pour:', user.name);
        // Connexion réussie
        simulateLoginSuccess(user, rememberMe);
    } else {
        console.log('❌ Identifiants incorrects');
        // Échec de connexion
        showNotification('Email ou mot de passe incorrect', 'error');
        
        // Effet visuel d'erreur
        document.getElementById('loginForm').classList.add('shake');
        setTimeout(() => {
            document.getElementById('loginForm').classList.remove('shake');
        }, 500);
    }
}

function simulateLoginSuccess(user, rememberMe) {
    const submitBtn = document.querySelector('#loginForm .btn-primary');
    const originalText = submitBtn.innerHTML;
    
    console.log('🔄 Début de la simulation de connexion pour:', user.name);
    
    // État de chargement
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
    submitBtn.disabled = true;

    // Simulation du processus de connexion
    setTimeout(() => {
        console.log('💾 Sauvegarde des données utilisateur');
        
        // Sauvegarde des données utilisateur
        if (rememberMe) {
            localStorage.setItem('pnsbil_remember', 'true');
            localStorage.setItem('pnsbil_user_email', user.email);
        }
        
        sessionStorage.setItem('pnsbil_current_user', JSON.stringify(user));
        
        // Message de succès
        showNotification(`Connexion réussie ! Redirection vers le tableau de bord ${user.role}...`, 'success');
        
        console.log('🎯 Préparation de la redirection vers:', user.dashboard);
        console.log('📍 Chemin complet:', window.location.origin + '/' + user.dashboard);
        
        // Redirection DIRECTE - Version corrigée
        setTimeout(() => {
            console.log('🚀 Exécution de la redirection...');
            try {
                // Essayer d'abord avec un chemin relatif simple
                window.location.href = user.dashboard;
            } catch (error) {
                console.error('❌ Erreur lors de la redirection:', error);
                // Fallback: réactiver le bouton
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Erreur lors de la redirection. Veuillez réessayer.', 'error');
            }
        }, 2000);
        
    }, 1000);
}

function initializeDemoPanel() {
    // Créer le panneau de démonstration s'il n'existe pas
    if (!document.getElementById('demoPanel')) {
        const demoPanel = document.createElement('div');
        demoPanel.id = 'demoPanel';
        demoPanel.className = 'demo-panel';
        demoPanel.innerHTML = `
            <div class="demo-header">
                <h4>📋 Comptes de Démonstration</h4>
                <button class="demo-toggle">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="demo-content">
                <div class="demo-account" data-email="admin@pnsbil.com" data-password="admin123">
                    <div class="demo-role">👑 Administrateur</div>
                    <div class="demo-email">admin@pnsbil.com</div>
                    <div class="demo-password">Mot de passe: admin123</div>
                    <div class="demo-path">→ administrateurs/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="proprietaire@example.com" data-password="proprio123">
                    <div class="demo-role">🏠 Propriétaire</div>
                    <div class="demo-email">proprietaire@example.com</div>
                    <div class="demo-password">Mot de passe: proprio123</div>
                    <div class="demo-path">→ proprietaires/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="locataire@example.com" data-password="locataire123">
                    <div class="demo-role">🔑 Locataire</div>
                    <div class="demo-email">locataire@example.com</div>
                    <div class="demo-password">Mot de passe: locataire123</div>
                    <div class="demo-path">→ locataires/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="agence@example.com" data-password="agence123">
                    <div class="demo-role">🏢 Agence Immobilière</div>
                    <div class="demo-email">agence@example.com</div>
                    <div class="demo-password">Mot de passe: agence123</div>
                    <div class="demo-path">→ agences/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="agentfiscaux@example.com" data-password="fiscal123">
                    <div class="demo-role">💰 Agent Fiscal</div>
                    <div class="demo-email">agentfiscaux@example.com</div>
                    <div class="demo-password">Mot de passe: fiscal123</div>
                    <div class="demo-path">→ agents-fiscaux/dashboard.html</div>
                </div>
                <div class="demo-account" data-email="agentmunicipaux@example.com" data-password="municipal123">
                    <div class="demo-role">🏠 Agent Municipal</div>
                    <div class="demo-email">agentmunicipaux@example.com</div>
                    <div class="demo-password">Mot de passe: municipal123</div>
                    <div class="demo-path">→ agents-municipaux/dashboard.html</div>
                </div>
            </div>
        `;
        
        document.querySelector('.auth-form-side').appendChild(demoPanel);
        
        // Gestion du toggle
        const demoToggle = demoPanel.querySelector('.demo-toggle');
        const demoContent = demoPanel.querySelector('.demo-content');
        
        demoToggle.addEventListener('click', function() {
            demoContent.classList.toggle('expanded');
            this.querySelector('i').className = demoContent.classList.contains('expanded') 
                ? 'fas fa-chevron-up' 
                : 'fas fa-chevron-down';
        });
        
        // Gestion des clics sur les comptes de démo
        demoPanel.querySelectorAll('.demo-account').forEach(account => {
            account.addEventListener('click', function() {
                const email = this.dataset.email;
                const password = this.dataset.password;
                
                document.getElementById('loginEmail').value = email;
                document.getElementById('loginPassword').value = password;
                
                // Highlight le compte sélectionné
                demoPanel.querySelectorAll('.demo-account').forEach(acc => acc.classList.remove('selected'));
                this.classList.add('selected');
                
                console.log('👤 Compte démo sélectionné:', email);
                
                // Auto-connexion après 1 seconde
                setTimeout(() => {
                    handleLogin();
                }, 1000);
            });
        });
    }
}

function showNotification(message, type = 'info') {
    console.log(`📢 Notification [${type}]:`, message);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    document.body.appendChild(notification);
    
    // Add CSS for animations if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
            }
        `;
        document.head.appendChild(style);
    }
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    return colors[type] || '#3498db';
}

// Vérifier s'il y a des informations de connexion sauvegardées
function checkRememberedLogin() {
    const remembered = localStorage.getItem('pnsbil_remember');
    const savedEmail = localStorage.getItem('pnsbil_user_email');
    
    if (remembered === 'true' && savedEmail) {
        document.getElementById('loginEmail').value = savedEmail;
        document.getElementById('remember').checked = true;
        console.log('🔍 Email mémorisé chargé:', savedEmail);
    }
}

// Initialiser la vérification au chargement
checkRememberedLogin();

// Fonction de débogage avancée
function debugCurrentState() {
    console.log('=== ÉTAT ACTUEL ===');
    console.log('URL actuelle:', window.location.href);
    console.log('Chemin:', window.location.pathname);
    console.log('Origine:', window.location.origin);
    console.log('Utilisateurs configurés:');
    Object.keys(simulatedUsers).forEach(email => {
        const user = simulatedUsers[email];
        console.log(`- ${email}: ${user.dashboard} (${user.role})`);
    });
    
    // Tester l'accès aux pages
    testPageAccess();
}

function testPageAccess() {
    console.log('=== TEST ACCÈS PAGES ===');
    const testPages = [
        'administrateurs/dashboard.html',
        'proprietaires/dashboard.html',
        'locataires/dashboard.html'
    ];
    
    testPages.forEach(page => {
        const testUrl = window.location.origin + '/' + page;
        console.log(`Testing: ${testUrl}`);
        // Vous pouvez ajouter une vérification AJAX ici si nécessaire
    });
}

// Lancer le débogage
setTimeout(debugCurrentState, 500);
