// ============================================
// INITIALISATION DU DASHBOARD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard Propriétaire - Initialisation');
    
    // Mettre un délai avant la vérification d'authentification pour le développement
    setTimeout(() => {
        // Vérifier l'authentification (mode développement seulement)
        checkAuth();
    }, 1000);
    
    // Initialiser les composants
    initComponents();
    
    // Charger les données
    loadDashboardData();
    
    // Configurer les écouteurs d'événements
    setupEventListeners();
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Initialiser les corrections responsive
    initResponsiveFix();
});

// ============================================
// VÉRIFICATION D'AUTHENTIFICATION (MODE DÉVELOPPEMENT)
// ============================================
function checkAuth() {
    // Pour le développement, créer des données fictives
    const authToken = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!authToken || !userData) {
        console.log('🔧 Mode développement: création de données utilisateur fictives');
        
        // Créer un utilisateur fictif pour le développement
        const demoUser = {
            name: 'M. Mohamed Diallo',
            email: 'demo@pnsbil.bf',
            role: 'propriétaire',
            id: 'demo_12345'
        };
        
        // Stocker les données fictives
        localStorage.setItem('auth_token', 'demo_token_' + Date.now());
        localStorage.setItem('user_data', JSON.stringify(demoUser));
        
        // Mettre à jour l'affichage
        updateUserInfo(demoUser);
        
        // Afficher un message d'information
        showNotification('info', 'Mode démo activé. Bienvenue dans votre tableau de bord.');
        
        return; // Ne pas rediriger en mode développement
    }
    
    try {
        const user = JSON.parse(userData);
        updateUserInfo(user);
    } catch (error) {
        console.error('Erreur de parsing user data:', error);
        // En cas d'erreur, créer des données fictives
        createDemoUser();
    }
}

function updateUserInfo(user) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement && user.name) {
        userNameElement.textContent = user.name;
        userNameElement.title = `Connecté en tant que ${user.name}`;
    }
}

function createDemoUser() {
    const demoUser = {
        name: 'M. Mohamed Diallo',
        email: 'demo@pnsbil.bf',
        role: 'propriétaire',
        id: 'demo_' + Math.random().toString(36).substr(2, 9)
    };
    
    localStorage.setItem('auth_token', 'demo_token_' + Date.now());
    localStorage.setItem('user_data', JSON.stringify(demoUser));
    updateUserInfo(demoUser);
}

// ============================================
// DÉCONNEXION (MODIFIÉE POUR LE DÉVELOPPEMENT)
// ============================================
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // En développement, on peut simplement nettoyer et recharger
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        showNotification('info', 'Déconnexion réussie. Redirection...');
        
        // Petit délai avant de recharger
        setTimeout(() => {
            window.location.reload(); // Recharge la page plutôt que rediriger
        }, 1500);
    }
}

// ============================================
// MODIFICATION DE LA FONCTION showLoading
// ============================================
function showLoading(show) {
    if (show) {
        // Créer l'overlay de chargement s'il n'existe pas
        let loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Chargement des données...</p>
            `;
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
    } else {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                loadingOverlay.style.opacity = '1';
            }, 300);
        }
    }
}

// ============================================
// RESTE DU CODE SANS CHANGEMENT (version simplifiée)
// ============================================

function initComponents() {
    console.log('🎨 Initialisation des composants');
    
    // Initialiser les graphiques
    initCharts();
    
    // Initialiser les animations
    initAnimations();
    
    // Initialiser les compteurs animés
    initAnimatedCounters();
}

function initCharts() {
    const revenueChart = document.getElementById('revenueChart');
    if (!revenueChart) return;
    
    const ctx = revenueChart.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [{
                label: 'Revenus (FCFA)',
                data: [1800000, 1900000, 2100000, 2200000, 2300000, 2400000, 
                       2500000, 2400000, 2600000, 2700000, 2800000, 2900000],
                borderColor: '#DE0000',
                backgroundColor: 'rgba(222, 0, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#DE0000',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value) + ' FCFA';
                        }
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function initAnimations() {
    // Animation des cartes
    const cards = document.querySelectorAll('.metric-card, .chart-card, .stats-card, .activity-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Animation des barres
    animateStatBars();
}

function animateStatBars() {
    const statFills = document.querySelectorAll('.stat-fill');
    statFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.transition = 'width 1.5s ease';
            fill.style.width = width;
        }, 300);
    });
}

function initAnimatedCounters() {
    const metricValues = document.querySelectorAll('.metric-value');
    metricValues.forEach(element => {
        const text = element.textContent;
        const match = text.match(/(\d+(?:\.\d+)?)/);
        if (match) {
            const targetValue = parseFloat(match[1]);
            if (!isNaN(targetValue)) {
                const hasFCFA = text.includes('FCFA');
                animateCounter(element, targetValue, hasFCFA);
            }
        }
    });
}

function animateCounter(element, targetValue, isCurrency = false) {
    let current = 0;
    const increment = targetValue / 60;
    const interval = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(interval);
        }
        element.textContent = isCurrency ? 
            formatCurrency(Math.floor(current)) + ' FCFA' : 
            Math.floor(current);
    }, 30);
}

function showNotification(type, message) {
    // Supprimer les anciennes notifications
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove après 3 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

async function loadDashboardData() {
    showLoading(true);
    
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mettre à jour les données
    updateDashboard({
        metrics: {
            properties: { value: 8, change: '+2 cette année' },
            revenue: { value: 2500000, change: '+12%' },
            leases: { value: 6, change: '94% occupation' },
            pending: { value: 3, change: 'Paiements retard' }
        }
    });
    
    showNotification('success', 'Tableau de bord actualisé');
    showLoading(false);
}

function updateDashboard(data) {
    // Mettre à jour les métriques
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const valueElement = card.querySelector('.metric-value');
        const changeElement = card.querySelector('.metric-change');
        
        if (title === 'Propriétés') {
            valueElement.textContent = data.metrics.properties.value;
            changeElement.textContent = data.metrics.properties.change;
        } else if (title === 'Revenus Mensuels') {
            valueElement.textContent = formatCurrency(data.metrics.revenue.value) + ' FCFA';
            changeElement.textContent = data.metrics.revenue.change;
            changeElement.classList.add('positive');
        } else if (title === 'Baux Actifs') {
            valueElement.textContent = data.metrics.leases.value;
            changeElement.textContent = data.metrics.leases.change;
        } else if (title === 'En Attente') {
            valueElement.textContent = data.metrics.pending.value;
            changeElement.textContent = data.metrics.pending.change;
        }
    });
}

function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.title = 'Menu principal';
    
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        headerContent.insertBefore(menuToggle, headerContent.firstChild);
    }
    
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        this.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle') &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            menuToggle.innerHTML = '☰';
        }
    });
}

function initResponsiveFix() {
    adjustChartHeight();
    window.addEventListener('resize', adjustChartHeight);
}

function adjustChartHeight() {
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) return;
    
    const width = window.innerWidth;
    if (width <= 768) {
        chartContainer.style.height = '220px';
    } else if (width <= 992) {
        chartContainer.style.height = '250px';
    } else {
        chartContainer.style.height = '280px';
    }
}

function formatCurrency(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K';
    }
    return amount.toLocaleString('fr-FR');
}

function setupEventListeners() {
    // Rafraîchir avec F5
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F5') {
            e.preventDefault();
            loadDashboardData();
        }
    });
    
    // Rafraîchir en cliquant sur le titre
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        pageHeader.style.cursor = 'pointer';
        pageHeader.addEventListener('click', () => {
            loadDashboardData();
        });
    }
}

// Exposer les fonctions globales
window.logout = logout;
window.loadDashboardData = loadDashboardData;

// Démarrer l'application
setTimeout(() => {
    console.log('✅ Dashboard prêt !');
    adjustChartHeight();
}, 500);