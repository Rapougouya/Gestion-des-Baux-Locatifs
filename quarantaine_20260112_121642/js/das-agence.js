// ==========================================================================
// DASHBOARD AGENCE IMMOBILIÈRE - PNSBIL
// JavaScript complet pour l'espace professionnel
// ==========================================================================

// Configuration
const API_BASE_URL = '/api'; // À remplacer par votre URL API
const STORAGE_KEY = 'pnsbil_user';

// ==========================================================================
// GESTION DE L'AUTHENTIFICATION
// ==========================================================================

/**
 * Vérifier si l'utilisateur est authentifié
 */
function checkAuth(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        redirectToLogin();
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        alert('Accès non autorisé. Vous n\'avez pas les permissions nécessaires.');
        redirectToLogin();
        return false;
    }
    
    return true;
}

/**
 * Récupérer l'utilisateur actuel depuis le localStorage
 */
function getCurrentUser() {
    try {
        const userJson = localStorage.getItem(STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
    }
}

/**
 * Sauvegarder l'utilisateur dans le localStorage
 */
function saveUser(user) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    }
}

/**
 * Déconnexion
 */
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem(STORAGE_KEY);
        redirectToLogin();
    }
}

/**
 * Rediriger vers la page de connexion
 */
function redirectToLogin() {
    window.location.href = '../login.html';
}

// ==========================================================================
// GESTION DU MENU MOBILE
// ==========================================================================

/**
 * Initialiser le menu mobile
 */
function initMobileMenu() {
    // Créer le bouton burger si nécessaire
    if (window.innerWidth <= 1024 && !document.querySelector('.mobile-menu-btn')) {
        const header = document.querySelector('.header-content');
        const burgerBtn = document.createElement('button');
        burgerBtn.className = 'mobile-menu-btn';
        burgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
        burgerBtn.addEventListener('click', toggleSidebar);
        
        // Insérer le bouton au début du header
        header.insertBefore(burgerBtn, header.firstChild);
    }
}

/**
 * Toggle de la sidebar mobile
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
    
    // Fermer la sidebar si on clique en dehors
    if (sidebar.classList.contains('active')) {
        document.addEventListener('click', closeSidebarOnClickOutside);
    }
}

/**
 * Fermer la sidebar en cliquant en dehors
 */
function closeSidebarOnClickOutside(e) {
    const sidebar = document.querySelector('.sidebar');
    const burgerBtn = document.querySelector('.mobile-menu-btn');
    
    if (!sidebar.contains(e.target) && !burgerBtn.contains(e.target)) {
        sidebar.classList.remove('active');
        document.removeEventListener('click', closeSidebarOnClickOutside);
    }
}

// ==========================================================================
// GESTION DES DONNÉES DU DASHBOARD
// ==========================================================================

/**
 * Données simulées pour le dashboard
 */
const dashboardData = {
    metrics: {
        biensGeres: {
            value: 127,
            change: '+8 ce mois',
            trend: 'up'
        },
        chiffreAffaires: {
            value: 18500000,
            change: '+15%',
            trend: 'up'
        },
        clientsActifs: {
            value: 89,
            change: 'Satisfaction: 96%',
            trend: 'neutral'
        },
        contrats: {
            value: 156,
            change: '12 en attente',
            trend: 'neutral'
        }
    },
    recentTransactions: [
        {
            id: 1,
            type: 'Nouveau bail',
            bien: 'Villa Secteur 2',
            client: 'Jean Ouédraogo',
            montant: 750000,
            date: '2024-01-15',
            statut: 'Validé'
        },
        {
            id: 2,
            type: 'Renouvellement',
            bien: 'Appartement Zone 1',
            client: 'Marie Kaboré',
            montant: 450000,
            date: '2024-01-14',
            statut: 'En attente'
        },
        {
            id: 3,
            type: 'Résiliation',
            bien: 'Studio Centre-ville',
            client: 'Paul Traoré',
            montant: 280000,
            date: '2024-01-13',
            statut: 'Traité'
        }
    ],
    alertes: [
        {
            type: 'warning',
            message: '3 contrats arrivent à échéance ce mois',
            action: 'Voir les détails',
            urgent: true
        },
        {
            type: 'info',
            message: '5 nouveaux prospects à contacter',
            action: 'Voir la liste',
            urgent: false
        },
        {
            type: 'success',
            message: 'Paiement de 2.5M FCFA reçu',
            action: 'Consulter',
            urgent: false
        }
    ]
};

/**
 * Charger les données du dashboard
 */
async function loadDashboardData() {
    try {
        showLoadingOverlay();
        
        // Simuler un appel API
        await delay(1000);
        
        // Dans un vrai projet, remplacer par:
        // const response = await fetch(`${API_BASE_URL}/dashboard`, {
        //     headers: {
        //         'Authorization': `Bearer ${getCurrentUser().token}`
        //     }
        // });
        // const data = await response.json();
        
        updateMetrics(dashboardData.metrics);
        animateCounters();
        
        hideLoadingOverlay();
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showNotification('Erreur lors du chargement des données', 'error');
        hideLoadingOverlay();
    }
}

/**
 * Mettre à jour les métriques
 */
function updateMetrics(metrics) {
    // Cette fonction sera utile si les données viennent d'une API
    console.log('Métriques chargées:', metrics);
}

/**
 * Animer les compteurs de métriques
 */
function animateCounters() {
    const counters = document.querySelectorAll('.metric-value');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.textContent.replace(/[^0-9.-]/g, ''));
        
        if (isNaN(target)) return;
        
        animateCounter(counter, target);
    });
}

/**
 * Animer un compteur individuel
 */
function animateCounter(element, target) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const stepDuration = duration / steps;
    
    const hasPrefix = element.textContent.includes('FCFA');
    const hasSuffix = element.textContent.includes('%') || element.textContent.includes('M');
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.round(current).toLocaleString('fr-FR');
        
        if (hasPrefix) {
            displayValue = 'FCFA ' + displayValue;
        }
        
        if (element.textContent.includes('M')) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
            if (hasPrefix) displayValue = 'FCFA ' + displayValue;
        }
        
        if (element.textContent.includes('%')) {
            displayValue = Math.round(current) + '%';
        }
        
        element.textContent = displayValue;
    }, stepDuration);
}

// ==========================================================================
// GESTION DES NOTIFICATIONS
// ==========================================================================

/**
 * Afficher une notification
 */
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifs = document.querySelectorAll('.notification');
    existingNotifs.forEach(n => n.remove());
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Obtenir l'icône selon le type de notification
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Styles pour les notifications (à ajouter dynamiquement)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: -400px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-width: 300px;
        max-width: 400px;
        z-index: 10000;
        transition: right 0.3s ease;
    }
    
    .notification.show {
        right: 20px;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.5rem;
    }
    
    .notification-success {
        border-left: 4px solid #27ae60;
    }
    
    .notification-success i {
        color: #27ae60;
    }
    
    .notification-error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification-error i {
        color: #e74c3c;
    }
    
    .notification-warning {
        border-left: 4px solid #f39c12;
    }
    
    .notification-warning i {
        color: #f39c12;
    }
    
    .notification-info {
        border-left: 4px solid #3498db;
    }
    
    .notification-info i {
        color: #3498db;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .notification-close:hover {
        background: #f8fafc;
        color: #1e293b;
    }
`;

// Ajouter les styles des notifications
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// ==========================================================================
// GESTION DU LOADING OVERLAY
// ==========================================================================

/**
 * Afficher l'overlay de chargement
 */
function showLoadingOverlay() {
    let overlay = document.querySelector('.loading-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'flex';
}

/**
 * Masquer l'overlay de chargement
 */
function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// ==========================================================================
// UTILITAIRES
// ==========================================================================

/**
 * Délai pour simuler les appels API
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formater un montant en FCFA
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

/**
 * Debounce pour optimiser les événements
 */
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

// ==========================================================================
// INITIALISATION
// ==========================================================================

/**
 * Initialiser l'application au chargement de la page
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initialisation du dashboard agence...');
    
    // Vérifier l'authentification
    if (!checkAuth('agence')) {
        return;
    }
    
    // Charger les informations de l'utilisateur
    const user = getCurrentUser();
    if (user) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = user.name || 'Agence Immobilière';
        }
    }
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', debounce(() => {
        initMobileMenu();
    }, 250));
    
    // Charger les données du dashboard
    await loadDashboardData();
    
    // Ajouter les événements sur les liens de navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Fermer la sidebar mobile après clic
            if (window.innerWidth <= 1024) {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.remove('active');
            }
        });
    });
    
    console.log('Dashboard agence initialisé avec succès');
});

// ==========================================================================
// GESTION DES ERREURS GLOBALES
// ==========================================================================

/**
 * Gérer les erreurs non capturées
 */
window.addEventListener('error', function(event) {
    console.error('Erreur globale:', event.error);
    showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
});

/**
 * Gérer les promesses rejetées non capturées
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promise rejetée:', event.reason);
    showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
});

// ==========================================================================
// EXPORT DES FONCTIONS (si module)
// ==========================================================================

// Si vous utilisez des modules ES6, décommentez:
// export {
//     checkAuth,
//     getCurrentUser,
//     logout,
//     showNotification,
//     formatCurrency,
//     formatDate
// };