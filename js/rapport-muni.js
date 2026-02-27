// JavaScript moderne pour la page Rapports Locaux
class ReportsManager {
    constructor() {
        this.reports = [];
        this.analyticsData = {};
        this.init();
    }

    init() {
        this.loadReports();
        this.loadAnalyticsData();
        this.setupEventListeners();
        this.renderCharts();
    }

    loadReports() {
        // Simulation de chargement des rapports
        this.reports = [
            {
                id: 1,
                title: "Rapport Mensuel - Mars 2024",
                description: "Analyse complète du marché locatif",
                type: "pdf",
                size: "2.4 MB",
                created: "25/03/2024",
                icon: "file-pdf"
            },
            {
                id: 2,
                title: "Données Brutes - Q1 2024",
                description: "Export complet des données cadastrales",
                type: "excel",
                size: "5.7 MB",
                created: "20/03/2024",
                icon: "file-excel"
            }
        ];
    }

    loadAnalyticsData() {
        // Simulation de données analytiques
        this.analyticsData = {
            marketTrends: {
                almadies: 450000,
                plateau: 380000,
                mermoz: 320000
            },
            propertyDistribution: {
                apartments: 45,
                houses: 30,
                villas: 15,
                commercial: 10
            },
            neighborhoodStats: [
                {
                    name: "Almadies",
                    properties: 425,
                    activeLeases: 312,
                    averageRent: 450000,
                    compliance: 96,
                    revenue: 45200000
                },
                {
                    name: "Plateau",
                    properties: 387,
                    activeLeases: 298,
                    averageRent: 380000,
                    compliance: 94,
                    revenue: 38700000
                },
                {
                    name: "Mermoz",
                    properties: 342,
                    activeLeases: 265,
                    averageRent: 320000,
                    compliance: 92,
                    revenue: 28900000
                },
                {
                    name: "Fann",
                    properties: 298,
                    activeLeases: 234,
                    averageRent: 350000,
                    compliance: 91,
                    revenue: 25400000
                }
            ]
        };
    }

    setupEventListeners() {
        // Gestion du sélecteur de période
        const periodSelector = document.getElementById('analyticsPeriod');
        if (periodSelector) {
            periodSelector.addEventListener('change', (e) => {
                this.updateAnalytics(e.target.value);
            });
        }

        // Gestion des clics sur les cartes de rapport rapide
        document.querySelectorAll('.report-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const reportType = this.getReportTypeFromCard(card);
                this.generateQuickReport(reportType);
            });
        });
    }

    getReportTypeFromCard(card) {
        const icon = card.querySelector('.report-icon').textContent;
        const types = {
            '🗺️': 'zone',
            '✅': 'compliance',
            '⚖️': 'mediation',
            '💸': 'revenue'
        };
        return types[icon] || 'general';
    }

    renderCharts() {
        // Simulation de rendu de graphiques
        this.renderMarketTrends();
        this.renderPropertyDistribution();
        this.renderNeighborhoodTable();
    }

    renderMarketTrends() {
        // Implémentation du graphique des tendances du marché
        console.log('Rendu du graphique des tendances du marché');
    }

    renderPropertyDistribution() {
        // Implémentation du graphique de répartition
        console.log('Rendu du graphique de répartition');
    }

    renderNeighborhoodTable() {
        const tableBody = document.querySelector('.data-table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = this.analyticsData.neighborhoodStats.map(neighborhood => `
            <tr>
                <td>${neighborhood.name}</td>
                <td>${neighborhood.properties}</td>
                <td>${neighborhood.activeLeases}</td>
                <td>${this.formatCurrency(neighborhood.averageRent)} FCFA</td>
                <td>${neighborhood.compliance}%</td>
                <td>${this.formatCurrency(neighborhood.revenue)} FCFA</td>
            </tr>
        `).join('');
    }

    // Génération de rapports
    async generateMonthlyReport() {
        this.showLoading('Génération du rapport mensuel...');
        
        try {
            // Simulation d'appel API
            await this.apiCall('/api/reports/monthly', {
                period: 'current-month',
                format: 'pdf'
            });
            
            const report = await this.createReport('monthly');
            this.showNotification('Rapport mensuel généré avec succès', 'success');
            this.downloadReport(report);
        } catch (error) {
            this.showNotification('Erreur lors de la génération du rapport', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async createCustomReport() {
        // Ouvrir le modal de création de rapport personnalisé
        this.openCustomReportModal();
    }

    async generateQuickReport(type) {
        const reportTypes = {
            'zone': { name: 'Rapport par Zone', endpoint: '/api/reports/zone' },
            'compliance': { name: 'Rapport de Conformité', endpoint: '/api/reports/compliance' },
            'mediation': { name: 'Rapport de Médiation', endpoint: '/api/reports/mediation' },
            'revenue': { name: 'Rapport de Revenus', endpoint: '/api/reports/revenue' }
        };

        const reportConfig = reportTypes[type];
        if (!reportConfig) return;

        this.showLoading(`Génération du ${reportConfig.name}...`);

        try {
            await this.apiCall(reportConfig.endpoint);
            const report = await this.createReport(type);
            this.showNotification(`${reportConfig.name} généré avec succès`, 'success');
            this.downloadReport(report);
        } catch (error) {
            this.showNotification(`Erreur lors de la génération du ${reportConfig.name}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async createReport(type) {
        // Simulation de création de rapport
        return new Promise((resolve) => {
            setTimeout(() => {
                const report = {
                    id: Date.now(),
                    title: `Rapport ${type} - ${new Date().toLocaleDateString()}`,
                    type: 'pdf',
                    content: `Contenu du rapport ${type}`,
                    size: `${(Math.random() * 5 + 1).toFixed(1)} MB`
                };
                resolve(report);
            }, 2000);
        });
    }

    // Gestion des rapports sauvegardés
    async downloadReport(reportId) {
        const report = typeof reportId === 'object' ? reportId : this.reports.find(r => r.id === reportId);
        if (!report) return;

        this.showLoading(`Téléchargement de ${report.title}...`);

        try {
            // Simulation de téléchargement
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const blob = new Blob([report.content], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${report.title}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showNotification('Rapport téléchargé avec succès', 'success');
        } catch (error) {
            this.showNotification('Erreur lors du téléchargement', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async shareReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        // Ouvrir l'interface de partage
        this.openShareModal(report);
    }

    async deleteReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        if (await this.showConfirmation(`Supprimer le rapport "${report.title}" ?`)) {
            try {
                await this.apiCall(`/api/reports/${reportId}`, {}, 'DELETE');
                this.reports = this.reports.filter(r => r.id !== reportId);
                this.renderSavedReports();
                this.showNotification('Rapport supprimé avec succès', 'success');
            } catch (error) {
                this.showNotification('Erreur lors de la suppression', 'error');
            }
        }
    }

    showReportTemplates() {
        // Afficher les modèles de rapport
        this.openTemplatesModal();
    }

    // Mise à jour des analytics
    async updateAnalytics(period) {
        this.showLoading('Mise à jour des données...');

        try {
            const data = await this.apiCall('/api/analytics', { period });
            this.analyticsData = data;
            this.renderCharts();
            this.showNotification('Données mises à jour', 'info');
        } catch (error) {
            this.showNotification('Erreur lors de la mise à jour', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Méthodes utilitaires
    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR').format(amount);
    }

    async apiCall(endpoint, data = {}, method = 'POST') {
        // Simulation d'appel API
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% de succès
                    console.log(`API ${method}: ${endpoint}`, data);
                    resolve({ success: true, data: {} });
                } else {
                    reject(new Error('Erreur API simulée'));
                }
            }, 1000);
        });
    }

    showLoading(message = 'Chargement...') {
        // Implémentation d'un indicateur de chargement moderne
        let loader = document.getElementById('reports-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'reports-loader';
            loader.className = 'reports-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <span>${message}</span>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    hideLoading() {
        const loader = document.getElementById('reports-loader');
        if (loader) {
            loader.style.display = 'none';
        }
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

    async showConfirmation(message) {
        return new Promise((resolve) => {
            const confirmed = confirm(message);
            resolve(confirmed);
        });
    }

    openCustomReportModal() {
        // Implémentation du modal de rapport personnalisé
        console.log('Ouverture du modal de rapport personnalisé');
    }

    openShareModal(report) {
        // Implémentation du modal de partage
        console.log('Ouverture du modal de partage pour:', report);
    }

    openTemplatesModal() {
        // Implémentation du modal des modèles
        console.log('Ouverture du modal des modèles de rapport');
    }

    renderSavedReports() {
        const reportsList = document.querySelector('.reports-list');
        if (!reportsList) return;

        reportsList.innerHTML = this.reports.map(report => `
            <div class="saved-report-item">
                <div class="report-info">
                    <div class="report-icon">
                        <i class="fas fa-${report.icon}"></i>
                    </div>
                    <div class="report-details">
                        <h6>${report.title}</h6>
                        <p>${report.description}</p>
                        <small>Généré le ${report.created} • ${report.type.toUpperCase()} • ${report.size}</small>
                    </div>
                </div>
                <div class="report-actions">
                    <button class="btn-icon" onclick="reportsManager.downloadReport(${report.id})">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" onclick="reportsManager.shareReport(${report.id})">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="btn-icon" onclick="reportsManager.deleteReport(${report.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialisation
const reportsManager = new ReportsManager();

// Fonctions globales pour compatibilité
function generateMonthlyReport() {
    reportsManager.generateMonthlyReport();
}

function createCustomReport() {
    reportsManager.createCustomReport();
}

function generateZoneReport() {
    reportsManager.generateQuickReport('zone');
}

function generateComplianceReport() {
    reportsManager.generateQuickReport('compliance');
}

function generateMediationReport() {
    reportsManager.generateQuickReport('mediation');
}

function generateRevenueReport() {
    reportsManager.generateQuickReport('revenue');
}

function updateAnalytics() {
    const period = document.getElementById('analyticsPeriod').value;
    reportsManager.updateAnalytics(period);
}

function downloadReport(reportId) {
    reportsManager.downloadReport(reportId);
}

function shareReport(reportId) {
    reportsManager.shareReport(reportId);
}

function deleteReport(reportId) {
    reportsManager.deleteReport(reportId);
}

function showReportTemplates() {
    reportsManager.showReportTemplates();
}

// Gestion de la déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        window.location.href = '../login.html';
    }
}

// Styles additionnels pour les composants UI
const additionalStyles = `
    .reports-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }

    .loader-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        min-width: 200px;
    }

    .loader-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e2e8f0;
        border-top: 4px solid #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

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

    .notification-info {
        border-left-color: #3b82f6;
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

// Ajouter les styles additionnels
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);