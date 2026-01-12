// ============================================
// INITIALISATION DE LA PAGE BAUX
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page Baux Locatifs - Initialisation');
    
    // Initialiser les composants
    initComponents();
    
    // Charger les données
    loadLeasesData();
    
    // Configurer les interactions
    setupInteractions();
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Vérifier l'authentification (mode développement)
    checkAuth();
});

// ============================================
// VÉRIFICATION D'AUTHENTIFICATION
// ============================================
function checkAuth() {
    // Mode développement: créer des données fictives si besoin
    const authToken = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!authToken || !userData) {
        console.log('🔧 Mode développement: création de données utilisateur');
        
        const demoUser = {
            name: 'M. Mohamed Diallo',
            email: 'demo@pnsbil.bf',
            role: 'propriétaire',
            id: 'demo_user_' + Date.now()
        };
        
        localStorage.setItem('auth_token', 'demo_token_' + Date.now());
        localStorage.setItem('user_data', JSON.stringify(demoUser));
        
        // Mettre à jour l'affichage
        updateUserInfo(demoUser);
    } else {
        try {
            const user = JSON.parse(userData);
            updateUserInfo(user);
        } catch (error) {
            console.error('Erreur de parsing user data:', error);
        }
    }
}

function updateUserInfo(user) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement && user.name) {
        userNameElement.textContent = user.name;
    }
}

// ============================================
// INITIALISATION DES COMPOSANTS
// ============================================
function initComponents() {
    console.log('🎨 Initialisation des composants de la page baux');
    
    // Initialiser les animations
    initAnimations();
    
    // Initialiser les tooltips
    initTooltips();
    
    // Initialiser les compteurs animés
    initAnimatedCounters();
}

function initAnimations() {
    // Animation des cartes au survol
    const cards = document.querySelectorAll('.lease-card, .metric-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animation des barres de progression
    animateProgressBars();
}

function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        const originalWidth = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.transition = 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            fill.style.width = originalWidth;
        }, 300);
    });
}

function initAnimatedCounters() {
    const metricValues = document.querySelectorAll('.metric-value');
    metricValues.forEach(valueElement => {
        const text = valueElement.textContent.trim();
        const match = text.match(/\d+/);
        
        if (match) {
            const targetValue = parseInt(match[0]);
            if (!isNaN(targetValue)) {
                animateCounter(valueElement, targetValue, text.includes('%'));
            }
        }
    });
}

function animateCounter(element, targetValue, isPercentage = false) {
    let current = 0;
    const increment = targetValue / 50;
    const interval = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(interval);
        }
        element.textContent = isPercentage ? 
            Math.floor(current) + '%' : 
            Math.floor(current);
    }, 30);
}

function initTooltips() {
    // Créer des tooltips pour les boutons
    const buttons = document.querySelectorAll('button[title]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem 0.75rem';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.zIndex = '10000';
            
            this._tooltip = tooltip;
        });
        
        button.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// ============================================
// CHARGEMENT DES DONNÉES DES BAUX
// ============================================
async function loadLeasesData() {
    try {
        showLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mettre à jour les données
        updateMetrics();
        updateLeasesList();
        
        showNotification('success', 'Données des baux actualisées');
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showNotification('error', 'Erreur de chargement des données');
    } finally {
        showLoading(false);
    }
}

function updateMetrics() {
    // Données mockées pour les métriques
    const metricsData = {
        activeLeases: 6,
        toRenew: 2,
        occupancy: 94
    };
    
    // Mettre à jour les métriques affichées
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const valueElement = card.querySelector('.metric-value');
        
        if (title.includes('Baux Actifs')) {
            valueElement.textContent = metricsData.activeLeases;
        } else if (title.includes('À renouveler')) {
            valueElement.textContent = metricsData.toRenew;
        } else if (title.includes('Occupation')) {
            valueElement.textContent = metricsData.occupancy + '%';
        }
    });
}

function updateLeasesList() {
    // Calculer les pourcentages de progression
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        const percentText = bar.parentElement.nextElementSibling;
        if (percentText) {
            percentText.textContent = width + ' du contrat écoulé';
        }
    });
}

// ============================================
// GESTION DES INTERACTIONS
// ============================================
function setupInteractions() {
    // Bouton "Nouveau bail"
    const newLeaseBtn = document.querySelector('.btn-primary');
    if (newLeaseBtn) {
        newLeaseBtn.addEventListener('click', function() {
            showNewLeaseModal();
        });
    }
    
    // Boutons "Détails" des cartes de bail
    const detailButtons = document.querySelectorAll('.lease-actions .btn-primary:not(.btn-warning)');
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.lease-card');
            const propertyName = card.querySelector('h3').textContent;
            showLeaseDetails(propertyName);
        });
    });
    
    // Boutons "Renouveler"
    const renewButtons = document.querySelectorAll('.btn-warning');
    renewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.lease-card');
            const propertyName = card.querySelector('h3').textContent;
            renewLease(propertyName);
        });
    });
    
    // Boutons PDF
    const pdfButtons = document.querySelectorAll('.btn-outline');
    pdfButtons.forEach(button => {
        if (button.querySelector('.fa-file-pdf')) {
            button.addEventListener('click', function() {
                const card = this.closest('.lease-card');
                const propertyName = card.querySelector('h3').textContent;
                downloadLeasePDF(propertyName);
            });
        }
    });
}

function showLeaseDetails(propertyName) {
    showNotification('info', `Détails du bail: ${propertyName} - Fonctionnalité en développement`);
    // Ici vous intégrerez l'ouverture d'un modal ou la navigation vers une page détaillée
}

function renewLease(propertyName) {
    if (confirm(`Souhaitez-vous renouveler le bail pour ${propertyName} ?`)) {
        showLoading(true);
        
        // Simuler le traitement
        setTimeout(() => {
            showLoading(false);
            showNotification('success', `Renouvellement du bail ${propertyName} initié avec succès`);
            
            // Mettre à jour l'affichage
            const card = document.querySelector(`.lease-card:has(h3:contains("${propertyName}"))`);
            if (card) {
                card.classList.remove('warning');
                card.querySelector('.lease-status').className = 'lease-status active';
                card.querySelector('.lease-status').textContent = 'Actif';
                card.querySelector('.btn-warning').className = 'btn btn-primary';
                card.querySelector('.btn-warning').innerHTML = '<i class="fas fa-eye"></i> Détails';
            }
        }, 1500);
    }
}

function downloadLeasePDF(propertyName) {
    showNotification('info', `Téléchargement du PDF pour ${propertyName} - Fonctionnalité en développement`);
    // Ici vous intégrerez l'appel API pour générer/télécharger le PDF
}

function showNewLeaseModal() {
    showNotification('info', 'Nouveau bail - Fonctionnalité en développement');
    // Ici vous intégrerez l'ouverture d'un modal de création de bail
}

// ============================================
// MENU MOBILE
// ============================================
function initMobileMenu() {
    // Créer le bouton menu hamburger
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.title = 'Menu principal';
    menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--dark-color);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: all 0.3s ease;
    `;
    
    menuToggle.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(0,0,0,0.05)';
    });
    
    menuToggle.addEventListener('mouseleave', function() {
        this.style.background = 'none';
    });
    
    // Ajouter le bouton au header
    const headerLeft = document.querySelector('.header-left');
    if (headerLeft) {
        headerLeft.appendChild(menuToggle);
    }
    
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        this.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
        
        // Empêcher le scroll du body quand le menu est ouvert
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle') &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            menuToggle.innerHTML = '☰';
            document.body.style.overflow = '';
        }
    });
    
    // Afficher le bouton sur mobile
    function checkScreenSize() {
        if (window.innerWidth <= 992) {
            menuToggle.style.display = 'block';
        } else {
            menuToggle.style.display = 'none';
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// ============================================
// NOTIFICATIONS ET LOADING
// ============================================
function showNotification(type, message) {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <span style="margin-right: 0.5rem;">${icons[type] || '📢'}</span>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; font-size: 1.25rem;">×</button>
    `;
    
    // Styles inline pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 1rem 1.25rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        max-width: 400px;
        font-weight: 500;
        font-size: 0.95rem;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #059669 0%, #10B981 100%)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.background = 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)';
        notification.style.color = 'white';
    } else {
        notification.style.background = 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove après 4 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function showLoading(show) {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (show) {
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Chargement en cours...</p>
            `;
            
            // Styles pour l'overlay
            const style = document.createElement('style');
            style.textContent = `
                #loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(30, 41, 59, 0.9);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    color: white;
                }
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(59, 130, 246, 0.3);
                    border-top: 3px solid #3B82F6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                #loading-overlay p {
                    font-size: 1rem;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
    } else if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            loadingOverlay.style.opacity = '1';
        }, 300);
    }
}

// ============================================
// FONCTION DE DÉCONNEXION
// ============================================
function logout() {
    if (confirm('Souhaitez-vous vous déconnecter ?')) {
        showLoading(true);
        
        // Nettoyer le localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Redirection après un délai
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 1000);
    }
}

// ============================================
// FORMATAGE DES DONNÉES
// ============================================
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K';
    }
    return amount.toLocaleString('fr-FR');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// ============================================
// GESTION DES ÉVÉNEMENTS CLAVIER
// ============================================
document.addEventListener('keydown', function(e) {
    // Rafraîchir avec F5
    if (e.key === 'F5') {
        e.preventDefault();
        loadLeasesData();
    }
    
    // Échap pour fermer les modals (si implémentés plus tard)
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => modal.classList.remove('active'));
    }
});

// ============================================
// EXPOSER LES FONCTIONS GLOBALES
// ============================================
window.logout = logout;
window.loadLeasesData = loadLeasesData;

// Initialisation finale
setTimeout(() => {
    console.log('✅ Page Baux prête !');
    
    // Vérifier que tout est bien affiché
    const metricCards = document.querySelectorAll('.metric-card');
    const leaseCards = document.querySelectorAll('.lease-card');
    
    console.log(`📊 Métriques: ${metricCards.length} cartes`);
    console.log(`📄 Baux: ${leaseCards.length} cartes`);
    
    if (metricCards.length === 0) {
        console.warn('⚠️ Aucune carte de métrique trouvée');
    }
    
    if (leaseCards.length === 0) {
        console.warn('⚠️ Aucune carte de bail trouvée');
    }
}, 500);