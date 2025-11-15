// JavaScript moderne pour la page de médiation
class MediationManager {
    constructor() {
        this.cases = [];
        this.init();
    }

    init() {
        this.loadCases();
        this.setupEventListeners();
        this.updateStats();
    }

    loadCases() {
        // Simulation de chargement des données
        this.cases = [
            {
                id: 158,
                reference: 'MED-2024-0158',
                type: 'rent',
                status: 'urgent',
                parties: {
                    landlord: 'M. Diop',
                    tenant: 'Mme Sy'
                },
                amount: 1350000,
                startDate: '15/01/2024',
                hearingDate: '25/03/2024',
                timeline: [
                    { date: '15/01/2024', action: 'Début du conflit', details: '3 mois de loyer impayé - 1,350,000 FCFA' },
                    { date: '20/02/2024', action: 'Première médiation', details: 'Accord de paiement échelonné non respecté' },
                    { date: '23/03/2024', action: 'Convocation audience', details: 'Audience programmée pour le 25/03/2024' }
                ]
            },
            {
                id: 142,
                reference: 'MED-2024-0142',
                type: 'maintenance',
                status: 'in-progress',
                parties: {
                    landlord: 'SARL Premium',
                    tenant: 'M. Ndiaye'
                },
                issue: 'Fuite d\'eau - Salle de bain',
                startDate: '05/03/2024',
                lastAction: '20/03/2024 - Expertise technique'
            }
        ];
    }

    setupEventListeners() {
        // Recherche en temps réel
        const searchInput = document.getElementById('mediationSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterCases(e.target.value);
            });
        }

        // Filtres
        const filters = ['caseStatus', 'conflictType', 'priorityFilter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });
    }

    filterCases(searchTerm) {
        const filteredCases = this.cases.filter(caseItem => {
            return caseItem.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   caseItem.parties.landlord.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   caseItem.parties.tenant.toLowerCase().includes(searchTerm.toLowerCase());
        });
        this.renderCases(filteredCases);
    }

    applyFilters() {
        const statusFilter = document.getElementById('caseStatus').value;
        const typeFilter = document.getElementById('conflictType').value;
        const priorityFilter = document.getElementById('priorityFilter').value;

        const filteredCases = this.cases.filter(caseItem => {
            let matches = true;

            if (statusFilter && caseItem.status !== statusFilter) {
                matches = false;
            }

            if (typeFilter && caseItem.type !== typeFilter) {
                matches = false;
            }

            if (priorityFilter && caseItem.status !== priorityFilter) {
                matches = false;
            }

            return matches;
        });

        this.renderCases(filteredCases);
    }

    renderCases(cases) {
        const casesContainer = document.querySelector('.cases-list');
        if (!casesContainer) return;

        casesContainer.innerHTML = cases.map(caseItem => this.renderCaseItem(caseItem)).join('');
    }

    renderCaseItem(caseItem) {
        return `
            <div class="case-item ${caseItem.status}">
                ${this.renderCaseHeader(caseItem)}
                ${this.renderCaseDetails(caseItem)}
                ${this.renderCaseActions(caseItem)}
            </div>
        `;
    }

    renderCaseHeader(caseItem) {
        return `
            <div class="case-header case-top">
                <div class="case-info">
                    <h4>${caseItem.reference} - ${this.getConflictTypeLabel(caseItem.type)}</h4>
                    <div class="case-parties">
                        <span class="party landlord">👤 Propriétaire: ${caseItem.parties.landlord}</span>
                        <span class="party tenant">👤 Locataire: ${caseItem.parties.tenant}</span>
                    </div>
                </div>
                <div class="case-status">
                    <span class="status-badge ${caseItem.status}">${this.getStatusLabel(caseItem.status)}</span>
                    ${caseItem.hearingDate ? `<span class="hearing-date">📅 Audience: ${caseItem.hearingDate}</span>` : ''}
                </div>
            </div>
        `;
    }

    renderCaseDetails(caseItem) {
        return `
            <div class="case-details case-body">
                <div class="conflict-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Type de conflit:</label>
                            <span class="conflict-type ${caseItem.type}">${this.getConflictTypeLabel(caseItem.type)}</span>
                        </div>
                        ${caseItem.amount ? `
                        <div class="info-item">
                            <label>Montant en jeu:</label>
                            <span class="amount">${this.formatAmount(caseItem.amount)} FCFA</span>
                        </div>
                        ` : ''}
                        <div class="info-item">
                            <label>Début du conflit:</label>
                            <span>${caseItem.startDate}</span>
                        </div>
                        <div class="info-item">
                            <label>Dernière action:</label>
                            <span>${caseItem.lastAction || 'En attente'}</span>
                        </div>
                    </div>
                </div>
                ${caseItem.timeline ? this.renderTimeline(caseItem.timeline) : ''}
            </div>
        `;
    }

    renderTimeline(timeline) {
        const timelineItems = timeline.map(item => `
            <div class="timeline-item">
                <div class="timeline-date">${item.date}</div>
                <div class="timeline-content">
                    <strong>${item.action}</strong>
                    <p>${item.details}</p>
                </div>
            </div>
        `).join('');

        return `
            <div class="case-timeline">
                <h5>🕒 Chronologie du dossier:</h5>
                <div class="timeline timeline-flow">
                    ${timelineItems}
                </div>
            </div>
        `;
    }

    renderCaseActions(caseItem) {
        return `
            <div class="case-actions action-bar">
                <button class="btn btn-primary" onclick="mediationManager.scheduleHearing(${caseItem.id})">
                    <i class="fas fa-calendar-alt me-1"></i> Programmer audience
                </button>
                <button class="btn btn-success" onclick="mediationManager.recordAgreement(${caseItem.id})">
                    <i class="fas fa-handshake me-1"></i> Enregistrer accord
                </button>
                <button class="btn btn-warning" onclick="mediationManager.escalateCase(${caseItem.id})">
                    <i class="fas fa-level-up-alt me-1"></i> Escalader
                </button>
                <button class="btn btn-info" onclick="mediationManager.contactParties(${caseItem.id})">
                    <i class="fas fa-phone me-1"></i> Contacter parties
                </button>
            </div>
        `;
    }

    getConflictTypeLabel(type) {
        const types = {
            'rent': 'Loyer impayé',
            'maintenance': 'Entretien',
            'deposit': 'Caution',
            'eviction': 'Expulsion',
            'contract': 'Litige contractuel'
        };
        return types[type] || type;
    }

    getStatusLabel(status) {
        const statuses = {
            'urgent': 'Urgent',
            'in-progress': 'En médiation',
            'new': 'Nouveau',
            'hearing': 'Audience programmée',
            'resolved': 'Résolu',
            'escalated': 'Escaladé'
        };
        return statuses[status] || status;
    }

    formatAmount(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    updateStats() {
        // Mise à jour des statistiques en temps réel
        const activeCases = this.cases.filter(c => c.status !== 'resolved').length;
        const urgentCases = this.cases.filter(c => c.status === 'urgent').length;
        
        // Mettre à jour l'interface utilisateur
        this.updateStatCard('active', activeCases);
        this.updateStatCard('urgent', urgentCases);
    }

    updateStatCard(statType, value) {
        // Implémentation de la mise à jour des cartes de statistiques
    }

    // Méthodes de gestion des cas
    async scheduleHearing(caseId) {
        const caseItem = this.cases.find(c => c.id === caseId);
        if (!caseItem) return;

        const date = prompt("Date de l'audience (JJ/MM/AAAA):");
        const time = prompt("Heure de l'audience:");
        
        if (date && time) {
            try {
                // Simulation d'appel API
                await this.apiCall('/api/mediation/schedule-hearing', {
                    caseId,
                    date,
                    time
                });
                
                this.showNotification('Audience programmée avec succès', 'success');
                this.loadCases(); // Recharger les données
            } catch (error) {
                this.showNotification('Erreur lors de la programmation', 'error');
            }
        }
    }

    async recordAgreement(caseId) {
        const agreement = prompt("Termes de l'accord:");
        if (agreement) {
            try {
                await this.apiCall('/api/mediation/record-agreement', {
                    caseId,
                    agreement
                });
                
                this.showNotification('Accord enregistré avec succès', 'success');
                this.loadCases();
            } catch (error) {
                this.showNotification('Erreur lors de l\'enregistrement', 'error');
            }
        }
    }

    async escalateCase(caseId) {
        const reason = prompt("Raison de l'escalade:");
        if (reason) {
            try {
                await this.apiCall('/api/mediation/escalate', {
                    caseId,
                    reason
                });
                
                this.showNotification('Cas escaladé avec succès', 'warning');
                this.loadCases();
            } catch (error) {
                this.showNotification('Erreur lors de l\'escalade', 'error');
            }
        }
    }

    contactParties(caseId) {
        const caseItem = this.cases.find(c => c.id === caseId);
        if (caseItem) {
            // Ouvrir l'interface de communication
            this.openCommunicationPanel(caseItem);
        }
    }

    newMediationCase() {
        // Ouvrir le formulaire de création de nouveau dossier
        this.openCaseForm();
    }

    exportMediationCases() {
        // Générer et télécharger l'export
        const data = JSON.stringify(this.cases, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mediation-cases-export.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    syncCalendar() {
        // Synchroniser avec le calendrier externe
        this.showNotification('Calendrier synchronisé', 'info');
    }

    // Méthodes utilitaires
    async apiCall(endpoint, data) {
        // Simulation d'appel API
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('API Call:', endpoint, data);
                resolve({ success: true });
            }, 1000);
        });
    }

    showNotification(message, type = 'info') {
        // Créer une notification toast moderne
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 100);

        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    openCommunicationPanel(caseItem) {
        // Implémentation de l'interface de communication
        console.log('Ouverture du panneau de communication pour:', caseItem);
    }

    openCaseForm() {
        // Implémentation du formulaire de création de dossier
        console.log('Ouverture du formulaire de création de dossier');
    }
}

// Initialisation
const mediationManager = new MediationManager();

// Fonctions globales pour les événements onclick
function scheduleHearing(caseId) {
    mediationManager.scheduleHearing(caseId);
}

function recordAgreement(caseId) {
    mediationManager.recordAgreement(caseId);
}

function escalateCase(caseId) {
    mediationManager.escalateCase(caseId);
}

function contactParties(caseId) {
    mediationManager.contactParties(caseId);
}

function newMediationCase() {
    mediationManager.newMediationCase();
}

function exportMediationCases() {
    mediationManager.exportMediationCases();
}

function syncCalendar() {
    mediationManager.syncCalendar();
}

// Gestion de la déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // Redirection vers la page de connexion
        window.location.href = '../login.html';
    }
}

// Styles pour les notifications
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        border-left: 4px solid #3b82f6;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left-color: #10b981;
    }

    .notification-error {
        border-left-color: #ef4444;
    }

    .notification-warning {
        border-left-color: #f59e0b;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-content i {
        font-size: 1.25rem;
    }

    .notification-success .notification-content i {
        color: #10b981;
    }

    .notification-error .notification-content i {
        color: #ef4444;
    }

    .notification-warning .notification-content i {
        color: #f59e0b;
    }

    .notification-info .notification-content i {
        color: #3b82f6;
    }
`;

// Ajouter les styles des notifications au document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);