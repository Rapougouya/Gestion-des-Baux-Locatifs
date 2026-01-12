// =============================================
// GESTIONNAIRE D'AUTHENTIFICATION
// =============================================

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupEventListeners();
        this.checkSession();
    }

    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem('pnsbil_admin_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.updateUI();
            } else {
                this.redirectToLogin();
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'utilisateur:', error);
            this.redirectToLogin();
        }
    }

    updateUI() {
        if (this.currentUser) {
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = this.currentUser.name || 'Admin Système';
            }
            
            // Mettre à jour le rôle dans l'interface
            const userRoleElement = document.querySelector('.user-role');
            if (userRoleElement) {
                userRoleElement.textContent = this.currentUser.role || 'Administrateur';
            }
        }
    }

    setupEventListeners() {
        // Écouteur pour la déconnexion
        const logoutBtn = document.querySelector('[onclick="logout()"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Empêcher le retour après déconnexion
        window.addEventListener('popstate', () => {
            if (!this.currentUser) {
                this.redirectToLogin();
            }
        });
    }

    checkSession() {
        // Vérifier la session toutes les minutes
        setInterval(() => {
            if (!this.currentUser) {
                this.redirectToLogin();
            }
        }, 60000);
    }

    redirectToLogin() {
        window.location.href = '../auth/login.html';
    }

    redirectToUnauthorized() {
        window.location.href = '../errors/unauthorized.html';
    }

    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            // Journaliser la déconnexion
            this.logActivity('Déconnexion utilisateur', 'system');
            
            localStorage.removeItem('pnsbil_admin_user');
            this.currentUser = null;
            
            // Redirection avec délai pour voir le message
            setTimeout(() => {
                window.location.href = '../auth/login.html';
            }, 1000);
        }
    }

    checkAuth(requiredRole = null) {
        if (!this.currentUser) {
            this.redirectToLogin();
            return false;
        }

        if (requiredRole && this.currentUser.role !== requiredRole) {
            this.redirectToUnauthorized();
            return false;
        }

        return true;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    logActivity(action, type = 'info') {
        const activity = {
            action,
            type,
            user: this.currentUser?.name || 'Système',
            timestamp: new Date().toISOString(),
            ip: 'localhost' // En production, récupérer l'IP réelle
        };
        
        // Sauvegarder dans l'historique des activités
        const activities = JSON.parse(localStorage.getItem('pnsbil_activities') || '[]');
        activities.unshift(activity);
        localStorage.setItem('pnsbil_activities', JSON.stringify(activities.slice(0, 1000))); // Garder les 1000 dernières
    }
}

// =============================================
// GESTIONNAIRE D'ACTIVITÉS
// =============================================

class ActivityManager {
    constructor() {
        this.activities = [];
        this.currentFilter = 'all';
        this.isLoading = false;
        this.realTimeInterval = null;
        this.init();
    }

    init() {
        this.loadActivities();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    async loadActivities() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();

        try {
            const activities = await this.fetchActivities();
            this.activities = activities;
            this.renderActivities();
        } catch (error) {
            console.error('Erreur lors du chargement des activités:', error);
            this.showErrorState('Erreur de chargement des activités');
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    async fetchActivities() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Essayer de récupérer les activités depuis le localStorage d'abord
                    const savedActivities = JSON.parse(localStorage.getItem('pnsbil_activities') || '[]');
                    
                    if (savedActivities.length > 0) {
                        // Convertir les activités sauvegardées au format de l'interface
                        const formattedActivities = savedActivities.map((activity, index) => ({
                            id: index + 1,
                            type: activity.type || 'system',
                            icon: this.getIconForType(activity.type),
                            title: activity.action,
                            description: `Activité système enregistrée`,
                            user: activity.user,
                            time: this.formatTimeDifference(new Date(activity.timestamp)),
                            timestamp: new Date(activity.timestamp),
                            badge: { text: this.getBadgeText(activity.type), type: activity.type }
                        }));
                        
                        resolve(formattedActivities);
                    } else {
                        // Données par défaut si aucune activité sauvegardée
                        resolve(this.getDefaultActivities());
                    }
                } catch (error) {
                    reject(error);
                }
            }, 800); // Simuler un délai réseau
        });
    }

    getDefaultActivities() {
        return [
            {
                id: 1,
                type: 'user',
                icon: '👤',
                title: 'Nouveau propriétaire inscrit',
                description: 'Inscription validée pour M. Abdoulaye Diop - Propriétaire à Ouagadougou Plateau',
                user: 'Abdoulaye Diop',
                time: 'Il y a 2 min',
                timestamp: new Date(Date.now() - 2 * 60000),
                badge: { text: 'Nouveau', type: 'success' },
                new: true,
                priority: 'high'
            },
            {
                id: 2,
                type: 'payment',
                icon: '💰',
                title: 'Paiement de loyer confirmé',
                description: 'Loyer du mois de Décembre 2024 pour la villa #V-56789',
                user: 'Marie Ndiaye',
                time: 'Il y a 8 min',
                timestamp: new Date(Date.now() - 8 * 60000),
                badge: { text: 'Réussi', type: 'success' },
                amount: '450,000 FCFA',
                priority: 'medium'
            },
            {
                id: 3,
                type: 'alert',
                icon: '⚠️',
                title: 'Bail expirant dans 7 jours',
                description: 'Le bail #B-23456 pour l\'appartement A4 arrive à expiration',
                user: 'Système Alerte',
                time: 'Il y a 15 min',
                timestamp: new Date(Date.now() - 15 * 60000),
                badge: { text: 'Urgent', type: 'warning' },
                priority: 'high'
            },
            {
                id: 4,
                type: 'tax',
                icon: '🏛️',
                title: 'Déclaration fiscale soumise',
                description: 'Déclaration trimestrielle des revenus locatifs - Q3 2024',
                user: 'Service Fiscal',
                time: 'Il y a 25 min',
                timestamp: new Date(Date.now() - 25 * 60000),
                badge: { text: 'Fiscal', type: 'info' },
                priority: 'medium'
            }
        ];
    }

    getIconForType(type) {
        const icons = {
            'user': '👤',
            'payment': '💰',
            'tax': '🏛️',
            'alert': '⚠️',
            'security': '🔒',
            'document': '📄',
            'maintenance': '🔧',
            'audit': '📋',
            'communication': '💬',
            'system': '🔄',
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || '📝';
    }

    getBadgeText(type) {
        const texts = {
            'user': 'Utilisateur',
            'payment': 'Paiement',
            'tax': 'Fiscal',
            'alert': 'Alerte',
            'security': 'Sécurité',
            'success': 'Succès',
            'error': 'Erreur',
            'warning': 'Attention',
            'info': 'Information'
        };
        return texts[type] || 'Système';
    }

    formatTimeDifference(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours} h`;
        if (days === 1) return 'Hier';
        return `Il y a ${days} j`;
    }

    renderActivities() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        const filteredActivities = this.filterActivities();
        
        if (filteredActivities.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }

        container.innerHTML = `
            <div class="activity-header">
                <div class="activity-filters">
                    <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" 
                            onclick="activityManager.setFilter('all')">
                        Toutes (${this.activities.length})
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'user' ? 'active' : ''}" 
                            onclick="activityManager.setFilter('user')">
                        👤 Utilisateurs (${this.activities.filter(a => a.type === 'user').length})
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'payment' ? 'active' : ''}" 
                            onclick="activityManager.setFilter('payment')">
                        💰 Paiements (${this.activities.filter(a => a.type === 'payment').length})
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'alert' ? 'active' : ''}" 
                            onclick="activityManager.setFilter('alert')">
                        ⚠️ Alertes (${this.activities.filter(a => a.type === 'alert').length})
                    </button>
                </div>
                <div class="activity-actions">
                    <button class="btn btn-outline btn-sm" onclick="activityManager.markAllAsRead()" title="Tout marquer comme lu">
                        ✓ Tout lire
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="activityManager.exportActivities()" title="Exporter les activités">
                        📤 Exporter
                    </button>
                </div>
            </div>
            <div class="activity-list">
                ${filteredActivities.slice(0, 20).map(activity => this.renderActivityItem(activity)).join('')}
            </div>
            ${filteredActivities.length > 20 ? `
                <div class="activity-footer">
                    <button class="btn btn-outline" onclick="activityManager.loadMore()">
                        Charger plus d'activités (${filteredActivities.length - 20} restantes)
                    </button>
                </div>
            ` : ''}
        `;
    }

    renderActivityItem(activity) {
        const isNew = activity.new && !activity.read;
        
        return `
            <div class="activity-item ${isNew ? 'new' : ''} ${activity.priority || 'medium'}" 
                 data-activity-id="${activity.id}">
                ${isNew ? '<div class="activity-indicator"></div>' : ''}
                <div class="activity-icon ${activity.type}">
                    ${activity.icon}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-meta">
                        <div class="activity-user">
                            <span>👤</span>
                            <span>${activity.user}</span>
                        </div>
                        <div class="activity-time">
                            <span>🕒</span>
                            <span>${activity.time}</span>
                        </div>
                        ${activity.amount ? `
                            <div class="activity-amount">
                                <span>💳</span>
                                <span>${activity.amount}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="activity-badge badge-${activity.badge.type}">
                    ${activity.badge.text}
                </div>
                <div class="activity-actions">
                    <button class="action-btn" onclick="activityManager.viewDetails(${activity.id})" title="Voir les détails">
                        👁️
                    </button>
                    <button class="action-btn" onclick="activityManager.markAsRead(${activity.id})" title="Marquer comme lu">
                        ✓
                    </button>
                    ${activity.priority === 'high' ? `
                        <button class="action-btn action-urgent" onclick="activityManager.handleUrgent(${activity.id})" titleAction urgente">
                            🚨
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    filterActivities() {
        let filtered = this.activities;
        
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(activity => activity.type === this.currentFilter);
        }
        
        // Trier par priorité et date
        return filtered.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority] || 1;
            const bPriority = priorityOrder[b.priority] || 1;
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderActivities();
        
        // Sauvegarder le filtre préféré
        localStorage.setItem('pnsbil_activity_filter', filter);
    }

    viewDetails(activityId) {
        const activity = this.activities.find(a => a.id === activityId);
        if (activity) {
            this.showDetailModal(activity);
        }
    }

    showDetailModal(activity) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Détails de l'activité</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="activity-detail">
                        <div class="detail-header">
                            <div class="detail-icon ${activity.type}">
                                ${activity.icon}
                            </div>
                            <div class="detail-title">
                                <h4>${activity.title}</h4>
                                <div class="detail-badge badge-${activity.badge.type}">
                                    ${activity.badge.text}
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <label>Description:</label>
                            <p>${activity.description}</p>
                        </div>
                        
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Utilisateur:</label>
                                <span>${activity.user}</span>
                            </div>
                            <div class="detail-item">
                                <label>Heure:</label>
                                <span>${activity.time}</span>
                            </div>
                            <div class="detail-item">
                                <label>Type:</label>
                                <span>${this.getActivityTypeLabel(activity.type)}</span>
                            </div>
                            ${activity.amount ? `
                            <div class="detail-item">
                                <label>Montant:</label>
                                <span class="amount">${activity.amount}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        ${activity.timestamp ? `
                        <div class="detail-section">
                            <label>Horodatage exact:</label>
                            <p>${new Date(activity.timestamp).toLocaleString('fr-FR')}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="activityManager.markAsRead(${activity.id}); this.closest('.modal-overlay').remove()">
                        ✓ Marquer comme lu
                    </button>
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
                        Fermer
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    markAsRead(activityId) {
        const activity = this.activities.find(a => a.id === activityId);
        if (activity) {
            activity.new = false;
            activity.read = true;
            this.renderActivities();
            this.showNotification(`Activité marquée comme lue: ${activity.title}`);
        }
    }

    markAllAsRead() {
        this.activities.forEach(activity => {
            activity.new = false;
            activity.read = true;
        });
        this.renderActivities();
        this.showNotification('Toutes les activités ont été marquées comme lues');
    }

    handleUrgent(activityId) {
        const activity = this.activities.find(a => a.id === activityId);
        if (activity) {
            this.showNotification(`Action urgente traitée: ${activity.title}`, 'warning');
            // Ici, vous pourriez déclencher une action spécifique
        }
    }

    exportActivities() {
        const data = JSON.stringify(this.activities, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activites-pnsbil-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Activités exportées avec succès');
    }

    loadMore() {
        // Implémentation pour charger plus d'activités
        this.showNotification('Fonctionnalité de chargement supplémentaire à implémenter');
    }

    addNewActivity(activityData) {
        const newActivity = {
            id: Date.now(),
            timestamp: new Date(),
            new: true,
            read: false,
            priority: 'medium',
            ...activityData
        };
        
        this.activities.unshift(newActivity);
        
        // Limiter à 100 activités en mémoire
        if (this.activities.length > 100) {
            this.activities = this.activities.slice(0, 100);
        }
        
        this.renderActivities();
        
        // Notification visuelle pour nouvelle activité
        if (newActivity.priority === 'high') {
            this.showNotification(`Nouvelle activité urgente: ${newActivity.title}`, 'warning');
        }
    }

    startRealTimeUpdates() {
        // Arrêter tout intervalle existant
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }
        
        // Démarrer de nouvelles mises à jour
        this.realTimeInterval = setInterval(() => {
            this.simulateRealTimeActivity();
        }, 45000); // Toutes les 45 secondes
    }

    simulateRealTimeActivity() {
        const activityTypes = [
            {
                type: 'payment',
                icon: '💰',
                title: 'Nouveau paiement traité',
                description: 'Paiement automatique de loyer mensuel',
                user: 'Système Paiement',
                badge: { text: 'Automatique', type: 'success' },
                amount: `${Math.floor(Math.random() * 200) + 100},000 FCFA`
            },
            {
                type: 'user',
                icon: '👤',
                title: 'Inscription en attente',
                description: 'Nouvelle demande d\'inscription à valider',
                user: 'Nouvel Utilisateur',
                badge: { text: 'En attente', type: 'warning' }
            },
            {
                type: 'system',
                icon: '🔄',
                title: 'Synchronisation des données',
                description: 'Mise à jour automatique des bases de données',
                user: 'Système',
                badge: { text: 'Système', type: 'info' }
            }
        ];
        
        const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        this.addNewActivity(randomActivity);
    }

    showLoadingState() {
        const container = document.getElementById('recentActivity');
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Chargement des activités...</p>
                </div>
            `;
        }
    }

    hideLoadingState() {
        // Le rendu normal gère cela
    }

    showErrorState(message) {
        const container = document.getElementById('recentActivity');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">❌</div>
                    <h4>Erreur de chargement</h4>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="activityManager.loadActivities()">
                        Réessayer
                    </button>
                </div>
            `;
        }
    }

    getEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <h4>Aucune activité récente</h4>
                <p>Les activités du système apparaîtront ici lorsqu'elles seront disponibles</p>
                <button class="btn btn-outline" onclick="activityManager.loadActivities()">
                    Actualiser
                </button>
            </div>
        `;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '⚠️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Suppression automatique
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    getActivityTypeLabel(type) {
        const labels = {
            'user': 'Utilisateur',
            'payment': 'Paiement',
            'tax': 'Fiscal',
            'alert': 'Alerte',
            'security': 'Sécurité',
            'document': 'Document',
            'maintenance': 'Maintenance',
            'audit': 'Audit',
            'communication': 'Communication',
            'system': 'Système'
        };
        return labels[type] || type;
    }

    setupEventListeners() {
        // Rafraîchissement avec F5
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                e.preventDefault();
                this.loadActivities();
            }
        });

        // Rafraîchissement périodique
        setInterval(() => {
            this.loadActivities();
        }, 300000); // Toutes les 5 minutes
    }

    destroy() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }
    }
}


// Gestionnaire simplifié pour les activités statiques
class ActivityManager {
    constructor() {
        this.activities = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    viewDetails(activityId) {
        const activitiesData = {
            1: {
                title: 'Nouveau propriétaire inscrit',
                description: 'Inscription validée pour M. Abdoulaye Diop - Propriétaire à Ouagadougou Plateau',
                user: 'Abdoulaye Diop',
                time: 'Il y a 2 min',
                type: 'Utilisateur',
                details: {
                    email: 'abdoulaye.diop@email.com',
                    telephone: '+226 77 123 45 67',
                    type: 'Propriétaire',
                    ville: 'Ouagadougou Plateau'
                }
            },
            2: {
                title: 'Paiement de loyer confirmé',
                description: 'Loyer du mois de Décembre 2024 pour la villa #V-56789',
                user: 'Marie Ndiaye',
                time: 'Il y a 8 min',
                type: 'Paiement',
                details: {
                    propriété: 'Villa #V-56789 - Ouakam',
                    locataire: 'Marie Ndiaye',
                    période: 'Décembre 2024',
                    méthode: 'Wave',
                    montant: '450,000 FCFA'
                }
            },
            3: {
                title: 'Bail expirant dans 7 jours',
                description: 'Le bail #B-23456 pour l\'appartement A4 arrive à expiration',
                user: 'Système Alerte',
                time: 'Il y a 15 min',
                type: 'Alerte',
                details: {
                    bail: '#B-23456',
                    propriétaire: 'Papa Diallo',
                    locataire: 'Fatou Bâ',
                    expiration: '15/12/2024',
                    jours: '7 jours restants'
                }
            },
            4: {
                title: 'Déclaration fiscale soumise',
                description: 'Déclaration trimestrielle des revenus locatifs - Q3 2024',
                user: 'Service Fiscal',
                time: 'Il y a 25 min',
                type: 'Fiscal',
                details: {
                    période: 'Trimestre 3 - 2024',
                    propriétés: '12 propriétés déclarées',
                    revenus: '3,450,000 FCFA',
                    statut: 'En attente validation'
                }
            },
            5: {
                title: 'Synchronisation des données',
                description: 'Mise à jour automatique des bases de données terminée avec succès',
                user: 'Système',
                time: 'Il y a 1 heure',
                type: 'Système',
                details: {
                    type: 'Synchronisation automatique',
                    tables: '15 tables mises à jour',
                    durée: '2 minutes 34 secondes',
                    statut: 'Complété sans erreur'
                }
            },
            6: {
                title: 'Connexion administrateur',
                description: 'Accès administrateur détecté depuis une nouvelle adresse IP',
                user: 'Admin Principal',
                time: 'Il y a 2 heures',
                type: 'Sécurité',
                details: {
                    utilisateur: 'admin.system',
                    ip: '196.200.45.123',
                    localisation: 'Ouagadougou, Burkina Faso',
                    navigateur: 'Chrome 120',
                    statut: 'Connexion sécurisée'
                }
            }
        };

        const activity = activitiesData[activityId];
        if (activity) {
            this.showDetailModal(activity);
        }
    }

    showDetailModal(activity) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Détails de l'activité</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="activity-detail">
                        <div class="detail-header">
                            <div class="detail-title">
                                <h4>${activity.title}</h4>
                                <div class="detail-badge badge-info">
                                    ${activity.type}
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <label>Description:</label>
                            <p>${activity.description}</p>
                        </div>
                        
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Utilisateur:</label>
                                <span>${activity.user}</span>
                            </div>
                            <div class="detail-item">
                                <label>Heure:</label>
                                <span>${activity.time}</span>
                            </div>
                            <div class="detail-item">
                                <label>Type:</label>
                                <span>${activity.type}</span>
                            </div>
                        </div>
                        
                        ${activity.details ? `
                        <div class="detail-section">
                            <label>Détails supplémentaires:</label>
                            <div class="detail-grid">
                                ${Object.entries(activity.details).map(([key, value]) => `
                                    <div class="detail-item">
                                        <label>${this.formatLabel(key)}:</label>
                                        <span>${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
                        Fermer
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    formatLabel(key) {
        const labels = {
            'email': 'Email',
            'telephone': 'Téléphone',
            'ville': 'Ville',
            'propriété': 'Propriété',
            'locataire': 'Locataire',
            'période': 'Période',
            'méthode': 'Méthode',
            'montant': 'Montant',
            'bail': 'Bail',
            'expiration': 'Date expiration',
            'jours': 'Jours restants',
            'revenus': 'Revenus déclarés',
            'statut': 'Statut',
            'ip': 'Adresse IP',
            'localisation': 'Localisation',
            'navigateur': 'Navigateur',
            'type': 'Type',
            'tables': 'Tables mises à jour',
            'durée': 'Durée'
        };
        return labels[key] || key;
    }

    markAsRead(activityId) {
        const activityItem = document.querySelector(`[data-activity-id="${activityId}"]`);
        if (activityItem) {
            activityItem.classList.remove('new');
            const indicator = activityItem.querySelector('.activity-indicator');
            if (indicator) {
                indicator.remove();
            }
            this.showNotification('Activité marquée comme lue');
        }
    }

    handleUrgent(activityId) {
        this.showNotification('Action urgente traitée', 'warning');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '⚠️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    setupEventListeners() {
        // Gestion du filtre (si vous ajoutez des filtres plus tard)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.filter-btn')) {
                const filter = e.target.closest('.filter-btn').dataset.filter;
                if (filter) {
                    this.setFilter(filter);
                }
            }
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        // Implémentation basique du filtrage
        const activities = document.querySelectorAll('.activity-item');
        activities.forEach(activity => {
            if (filter === 'all' || activity.classList.contains(filter)) {
                activity.style.display = 'flex';
            } else {
                activity.style.display = 'none';
            }
        });
    }
}

// Initialisation
const activityManager = new ActivityManager();

// Fonction globale pour le rafraîchissement
function refreshActivities() {
    activityManager.showNotification('Activités actualisées');
}

// Exposer globalement pour les onclick
window.activityManager = activityManager;

// =============================================
// GESTIONNAIRE PRINCIPAL DU DASHBOARD
// =============================================

class DashboardManager {
    constructor() {
        this.authManager = new AuthManager();
        this.activityManager = null;
        this.metrics = {
            users: 2847,
            properties: 15623,
            leases: 12458,
            revenue: 4.2
        };
        this.init();
    }

    init() {
        if (!this.authManager.checkAuth('administrateur')) {
            return;
        }

        this.initializeManagers();
        this.setupMobileMenu();
        this.loadDashboardData();
        this.setupAutoRefresh();
        this.setupEventListeners();
        
        // Journaliser l'accès au dashboard
        this.authManager.logActivity('Accès au tableau de bord administrateur', 'system');
    }

    initializeManagers() {
        this.activityManager = new ActivityManager();
    }

    setupMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobileOverlay');

        if (menuBtn && sidebar && overlay) {
            const toggleMenu = () => {
                sidebar.classList.toggle('mobile-open');
                overlay.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
            };

            menuBtn.addEventListener('click', toggleMenu);
            overlay.addEventListener('click', toggleMenu);

            // Fermer le menu en cliquant sur un lien
            sidebar.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    toggleMenu();
                }
            });

            // Fermer le menu avec la touche Échap
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
                    toggleMenu();
                }
            });
        }
    }

    async loadDashboardData() {
        try {
            this.showLoadingState();
            
            // Charger les données en parallèle
            await Promise.all([
                this.loadMetricsData(),
                this.loadChartData(),
                this.loadSystemStatus()
            ]);
            
            this.updateDashboard();
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Erreur lors du chargement du dashboard:', error);
            this.showErrorState('Impossible de charger les données du dashboard');
        }
    }

    async loadMetricsData() {
        // Simuler le chargement des métriques
        return new Promise((resolve) => {
            setTimeout(() => {
                // Données simulées avec variations réalistes
                this.metrics = {
                    users: 2847 + Math.floor(Math.random() * 50),
                    properties: 15623 + Math.floor(Math.random() * 100),
                    leases: 12458 + Math.floor(Math.random() * 80),
                    revenue: 4.2 + (Math.random() * 0.3)
                };
                resolve();
            }, 1200);
        });
    }

    async loadChartData() {
        // Préparer les données pour les graphiques futurs
        return new Promise((resolve) => {
            setTimeout(resolve, 800);
        });
    }

    async loadSystemStatus() {
        // Vérifier le statut du système
        return new Promise((resolve) => {
            setTimeout(resolve, 600);
        });
    }

    updateDashboard() {
        this.animateMetricCounter('usersCount', this.metrics.users);
        this.animateMetricCounter('propertiesCount', this.metrics.properties);
        this.animateMetricCounter('leasesCount', this.metrics.leases);
        this.animateMetricCounter('revenueCount', this.metrics.revenue, true);
        
        this.updateSystemStatus();
    }

    animateMetricCounter(elementId, targetValue, isCurrency = false) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const currentText = element.textContent;
        let currentValue;

        if (isCurrency) {
            currentValue = parseFloat(currentText.replace(/[^\d.]/g, '')) || 0;
        } else {
            currentValue = parseInt(currentText.replace(/[^\d]/g, '')) || 0;
        }

        const duration = 1800;
        const startTime = performance.now();
        const startValue = currentValue;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function pour un effet plus naturel
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            const current = startValue + (targetValue - startValue) * easeOutCubic;
            
            if (isCurrency) {
                element.textContent = ` ${current.toFixed(1)}B FCFA`;
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateSystemStatus() {
        // Mettre à jour les indicateurs de statut du système
        const statusElements = document.querySelectorAll('.system-status');
        statusElements.forEach(element => {
            element.classList.add('online');
            element.title = 'Système en ligne et opérationnel';
        });
    }

    setupAutoRefresh() {
        // Rafraîchir les données toutes les 2 minutes
        setInterval(() => {
            this.loadDashboardData();
        }, 120000);
    }

    setupEventListeners() {
        // Gestion des erreurs globales
        window.addEventListener('error', (e) => {
            console.error('Erreur globale:', e.error);
            this.authManager.logActivity(`Erreur système: ${e.message}`, 'error');
        });

        // Gestion des promesses rejetées
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promesse rejetée:', e.reason);
            this.authManager.logActivity(`Erreur de promesse: ${e.reason}`, 'error');
            e.preventDefault();
        });

        // Sauvegarder l'état avant déchargement
        window.addEventListener('beforeunload', () => {
            this.authManager.logActivity('Navigation hors du dashboard', 'system');
        });

        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            // Ctrl + R pour rafraîchir (avec confirmation)
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                if (confirm('Rafraîchir les données du dashboard ?')) {
                    this.loadDashboardData();
                }
            }
            
            // Échap pour fermer les modals
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay');
                if (openModal) {
                    openModal.remove();
                }
            }
        });
    }

    showLoadingState() {
        document.body.classList.add('dashboard-loading');
    }

    hideLoadingState() {
        document.body.classList.remove('dashboard-loading');
    }

    showErrorState(message) {
        const notification = document.createElement('div');
        notification.className = 'global-notification error';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">❌</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    destroy() {
        if (this.activityManager) {
            this.activityManager.destroy();
        }
    }
}

// =============================================
// FONCTIONS GLOBALES ET INITIALISATION
// =============================================

// Fonctions globales accessibles depuis HTML
function logout() {
    const authManager = new AuthManager();
    authManager.logout();
}

function getCurrentUser() {
    const authManager = new AuthManager();
    return authManager.getCurrentUser();
}

function checkAuth(requiredRole) {
    const authManager = new AuthManager();
    return authManager.checkAuth(requiredRole);
}

function refreshActivities() {
    if (window.activityManager) {
        window.activityManager.loadActivities();
    }
}

function refreshDashboard() {
    if (window.dashboardManager) {
        window.dashboardManager.loadDashboardData();
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le gestionnaire principal
    window.dashboardManager = new DashboardManager();
    
    // Exposer les gestionnaires globalement pour le débogage
    window.authManager = window.dashboardManager.authManager;
    window.activityManager = window.dashboardManager.activityManager;
    
    console.log('Dashboard PNSBIL initialisé avec succès');
});

// Gestion de la visibilité de la page
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.dashboardManager) {
        // Rafraîchir les données quand la page redevient visible
        window.dashboardManager.loadDashboardData();
    }
});

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, ActivityManager, DashboardManager };
}
