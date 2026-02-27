// Script spécifique pour les paiements locataires

class PaymentsLocataire {
    constructor() {
        this.paymentHistory = [];
        this.currentRent = null;
        this.init();
    }

    init() {
        this.loadPaymentData();
        this.setupEventListeners();
        this.setupAutoPayment();
    }

    loadPaymentData() {
        // Simulation de données locataire
        this.paymentHistory = [
            {
                id: 1,
                period: 'Octobre 2024',
                amount: 450000,
                method: 'orange_money',
                date: '2024-10-01',
                status: 'paid',
                receiptUrl: '#'
            },
            {
                id: 2,
                period: 'Septembre 2024',
                amount: 450000,
                method: 'moov_money',
                date: '2024-09-02',
                status: 'paid',
                receiptUrl: '#'
            }
        ];

        this.currentRent = {
            amount: 450000,
            dueDate: '2024-12-05',
            property: 'Appartement B12',
            landlord: 'Mohamed Diallo'
        };
    }

    setupEventListeners() {
        // Écouteurs spécifiques aux locataires
        document.getElementById('setupAutoPayment')?.addEventListener('click', () => {
            this.setupAutoPayment();
        });

        // Rappel de paiement
        document.getElementById('paymentReminder')?.addEventListener('click', () => {
            this.setPaymentReminder();
        });
    }

    setupAutoPayment() {
        // Configuration du paiement automatique
        const modal = new bootstrap.Modal(document.getElementById('autoPaymentModal'));
        modal.show();
    }

    setPaymentReminder() {
        // Définition de rappel de paiement
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.schedulePaymentReminder();
                }
            });
        }
    }

    schedulePaymentReminder() {
        // Planification de rappel (3 jours avant échéance)
        const dueDate = new Date(this.currentRent.dueDate);
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(reminderDate.getDate() - 3);

        const now = new Date();
        const delay = reminderDate.getTime() - now.getTime();

        if (delay > 0) {
            setTimeout(() => {
                this.showPaymentNotification();
            }, delay);
        }
    }

    showPaymentNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Rappel de paiement PNSBIL', {
                body: `Pensez à payer votre loyer de ${this.currentRent.amount} FCFA avant le ${this.currentRent.dueDate}`,
                icon: '/images/logo.png'
            });
        }
    }

    downloadPaymentHistory() {
        // Téléchargement de l'historique
        const csv = this.generatePaymentCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historique-paiements-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generatePaymentCSV() {
        let csv = 'Période,Montant,Méthode,Date,Statut\n';
        this.paymentHistory.forEach(payment => {
            csv += `"${payment.period}",${payment.amount},"${payment.method}","${payment.date}","${payment.status}"\n`;
        });
        return csv;
    }

    getPaymentSuggestions() {
        // Suggestions IA pour le locataire
        const today = new Date();
        const dueDate = new Date(this.currentRent.dueDate);
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        let suggestions = [];

        if (daysUntilDue <= 3) {
            suggestions.push({
                type: 'urgent',
                message: 'Paiement urgent à effectuer',
                action: 'Payer maintenant'
            });
        }

        if (daysUntilDue >= 7) {
            suggestions.push({
                type: 'saving',
                message: `Payez avant ${new Date(today.setDate(today.getDate() + 5)).toLocaleDateString()} pour économiser 5%`,
                action: 'Payer en avance'
            });
        }

        return suggestions;
    }
}

// Initialisation
let locatairePayments;

document.addEventListener('DOMContentLoaded', function() {
    locatairePayments = new PaymentsLocataire();
});
