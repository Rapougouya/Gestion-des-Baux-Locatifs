// Script spécifique pour les paiements propriétaires

class PaymentsProprietaire {
    constructor() {
        this.payments = [];
        this.init();
    }

    init() {
        this.loadPaymentData();
        this.setupEventListeners();
    }

    loadPaymentData() {
        // Simulation de données propriétaire
        this.payments = [
            {
                id: 1,
                tenant: 'Aminata Sy',
                property: 'Appartement B12',
                amount: 450000,
                dueDate: '2024-11-05',
                status: 'paid',
                method: 'orange_money',
                date: '2024-11-01'
            },
            {
                id: 2,
                tenant: 'Mariam Sow',
                property: 'Studio C5',
                amount: 250000,
                dueDate: '2024-11-05',
                status: 'overdue',
                method: null,
                date: null
            }
        ];
    }

    setupEventListeners() {
        // Écouteurs spécifiques aux propriétaires
        document.addEventListener('click', (e) => {
            if (e.target.closest('.send-reminder')) {
                const paymentId = e.target.closest('.send-reminder').dataset.paymentId;
                this.sendReminder(paymentId);
            }
        });
    }

    sendReminder(paymentId) {
        const payment = this.payments.find(p => p.id == paymentId);
        if (payment) {
            // Simulation d'envoi de rappel
            console.log(`Rappel envoyé à ${payment.tenant} pour ${payment.amount} FCFA`);
            
            // Mise à jour de l'interface
            this.showNotification('Rappel envoyé avec succès', 'success');
        }
    }

    generateMonthlyReport() {
        // Génération de rapport mensuel
        const monthlyData = this.calculateMonthlyStats();
        this.downloadReport(monthlyData);
    }

    calculateMonthlyStats() {
        const currentMonth = new Date().getMonth();
        const monthlyPayments = this.payments.filter(p => {
            const paymentDate = new Date(p.date);
            return paymentDate.getMonth() === currentMonth && p.status === 'paid';
        });

        return {
            totalRevenue: monthlyPayments.reduce((sum, p) => sum + p.amount, 0),
            paymentCount: monthlyPayments.length,
            averagePayment: monthlyPayments.reduce((sum, p) => sum + p.amount, 0) / monthlyPayments.length
        };
    }

    showNotification(message, type = 'info') {
        // Affichage de notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.main-content').prepend(notification);
    }

    downloadReport(data) {
        // Simulation de téléchargement de rapport
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-paiements-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialisation
let paymentsManager;

document.addEventListener('DOMContentLoaded', function() {
    paymentsManager = new PaymentsProprietaire();
});