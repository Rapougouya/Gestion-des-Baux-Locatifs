// Classe pour la gestion du dashboard
class DashboardManager {
    constructor() {
        this.metrics = {
            properties: 8,
            revenue: 2500000,
            activeLeases: 6,
            pending: 3
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeCharts();
        this.animateMetrics();
        this.startRealTimeUpdates();
    }

    bindEvents() {
        // Navigation rapide
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('onclick')?.match(/location\.href='(.*?)'/)?.[1];
                if (href) {
                    this.navigateWithAnimation(href);
                }
            });
        });

        // Refresh des données
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.refreshData();
            }
        });

        // Observateur d'intersection pour l'animation
        this.setupIntersectionObserver();
    }

    initializeCharts() {
        // Graphique des revenus avec Chart.js
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        
        // Gradient pour le graphique
        const gradient = revenueCtx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
        gradient.addColorStop(1, 'rgba(102, 126, 234, 0.05)');

        this.revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Revenus (FCFA)',
                    data: [1800000, 1950000, 2100000, 2200000, 2300000, 2400000, 2350000, 2450000, 2500000, 2450000, 2500000, 2600000],
                    borderColor: '#667eea',
                    backgroundColor: gradient,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `Revenus: ${(context.parsed.y / 1000000).toFixed(1)}M FCFA`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            color: '#6b7280',
                            callback: function(value) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            }
        });

        // Animation des barres de statistiques
        this.animateStatBars();
    }

    animateStatBars() {
        const statFills = document.querySelectorAll('.stat-fill');
        statFills.forEach(fill => {
            const finalWidth = fill.style.width;
            fill.style.width = '0%';
            
            setTimeout(() => {
                fill.style.width = finalWidth;
            }, 500);
        });
    }

    animateMetrics() {
        const metricValues = document.querySelectorAll('.metric-value');
        
        metricValues.forEach((element, index) => {
            const finalValue = this.metrics[Object.keys(this.metrics)[index]];
            this.animateValue(element, 0, finalValue, 2000);
        });
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            let currentValue;
            if (typeof end === 'number') {
                currentValue = Math.floor(progress * (end - start) + start);
                if (element.classList.contains('metric-value') && end > 1000) {
                    element.textContent = this.formatCurrency(currentValue);
                } else {
                    element.textContent = currentValue;
                }
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    formatCurrency(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K';
        }
        return value.toString();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });

        // Observer les éléments animés
        document.querySelectorAll('.metric-card, .chart-card, .stats-card').forEach(el => {
            observer.observe(el);
        });
    }

    startRealTimeUpdates() {
        // Simulation de mises à jour en temps réel
        setInterval(() => {
            this.updateRandomMetric();
        }, 10000);
    }

    updateRandomMetric() {
        const metrics = ['properties', 'revenue', 'activeLeases', 'pending'];
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        const change = Math.random() > 0.5 ? 1 : -1;
        
        this.metrics[randomMetric] += change;
        
        // Mettre à jour l'affichage
        const metricIndex = metrics.indexOf(randomMetric);
        const element = document.querySelectorAll('.metric-value')[metricIndex];
        
        if (randomMetric === 'revenue') {
            element.textContent = this.formatCurrency(this.metrics[randomMetric]);
        } else {
            element.textContent = this.metrics[randomMetric];
        }
        
        // Ajouter une animation de pulse
        element.parentElement.classList.add('metric-update');
        setTimeout(() => {
            element.parentElement.classList.remove('metric-update');
        }, 1000);
    }

    refreshData() {
        // Simulation de rafraîchissement des données
        document.querySelectorAll('.metric-card').forEach(card => {
            card.classList.add('refreshing');
        });

        setTimeout(() => {
            document.querySelectorAll('.metric-card').forEach(card => {
                card.classList.remove('refreshing');
            });
            
            this.showNotification('Données mises à jour', 'success');
        }, 1000);
    }

    navigateWithAnimation(url) {
        // Animation de transition avant la navigation
        document.querySelector('.main-content').style.opacity = '0';
        document.querySelector('.main-content').style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }
}

// Initialisation du dashboard
let dashboardManager;

document.addEventListener('DOMContentLoaded', function() {
    // Vérification de l'authentification
    if (typeof checkAuth === 'function' && !checkAuth('proprietaire')) {
        return;
    }
    
    // Affichage du nom d'utilisateur
    if (typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user) {
            document.getElementById('userName').textContent = user.name;
        }
    }
    
    // Initialisation du gestionnaire de dashboard
    dashboardManager = new DashboardManager();
});

// Fonction de déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // Animation de déconnexion
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 300);
    }
}

// Rendre disponible globalement
window.dashboardManager = dashboardManager;