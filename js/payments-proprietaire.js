// ============================================
// INITIALISATION DE LA PAGE PAIEMENTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('💰 Page Paiements - Initialisation');
    
    // Initialiser les composants
    initComponents();
    
    // Charger les données
    loadPaymentsData();
    
    // Configurer les interactions
    setupInteractions();
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Vérifier l'authentification
    checkAuth();
});

// ============================================
// VÉRIFICATION D'AUTHENTIFICATION
// ============================================
function checkAuth() {
    const authToken = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!authToken || !userData) {
        console.log('🔧 Création de données utilisateur démo');
        
        const demoUser = {
            name: 'M. Mohamed Diallo',
            email: 'demo@pnsbil.bf',
            role: 'propriétaire',
            id: 'demo_user_' + Date.now()
        };
        
        localStorage.setItem('auth_token', 'demo_token_' + Date.now());
        localStorage.setItem('user_data', JSON.stringify(demoUser));
        
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
    console.log('🎨 Initialisation des composants');
    
    // Initialiser les animations
    initAnimations();
    
    // Initialiser le filtre par mois
    initMonthFilter();
    
    // Initialiser les tooltips
    initTooltips();
    
    // Initialiser les compteurs animés
    initAnimatedCounters();
}

function initAnimations() {
    // Animation des cartes statistiques au survol
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animation des lignes du tableau
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            row.style.transition = 'all 0.5s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 100 + 300);
    });
}

function initMonthFilter() {
    const monthInput = document.querySelector('input[type="month"]');
    if (!monthInput) return;
    
    // Définir le mois actuel par défaut
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    monthInput.value = currentMonth;
    
    monthInput.addEventListener('change', function() {
        const selectedMonth = this.value;
        filterPaymentsByMonth(selectedMonth);
    });
}

function initTooltips() {
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
            tooltip.style.background = 'rgba(26, 54, 93, 0.9)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem 0.75rem';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.zIndex = '10000';
            tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            
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

function initAnimatedCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(element => {
        const text = element.textContent.trim();
        
        // Vérifier si c'est un montant en FCFA
        if (text.includes('FCFA')) {
            const match = text.match(/([\d.]+)([MK]?)/);
            if (match) {
                let targetValue = parseFloat(match[1]);
                const multiplier = match[2];
                
                // Convertir en nombre
                if (multiplier === 'M') {
                    targetValue *= 1000000;
                } else if (multiplier === 'K') {
                    targetValue *= 1000;
                }
                
                animateMoneyCounter(element, targetValue);
            }
        } else {
            // C'est un simple nombre
            const targetValue = parseInt(text);
            if (!isNaN(targetValue)) {
                animateCounter(element, targetValue);
            }
        }
    });
}

function animateCounter(element, targetValue) {
    let current = 0;
    const increment = targetValue / 50;
    const interval = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(interval);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

function animateMoneyCounter(element, targetValue) {
    let current = 0;
    const increment = targetValue / 50;
    const interval = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(interval);
        }
        element.textContent = formatCurrency(Math.floor(current)) + ' FCFA';
    }, 30);
}

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================
async function loadPaymentsData() {
    try {
        showLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mettre à jour les statistiques
        updatePaymentStats();
        
        // Animer les éléments
        animateElements();
        
        showNotification('success', 'Données de paiement chargées avec succès');
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showNotification('error', 'Erreur de chargement des données');
    } finally {
        showLoading(false);
    }
}

function updatePaymentStats() {
    // Compter les paiements par statut
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    let validated = 0;
    let pending = 0;
    let overdue = 0;
    let totalAmount = 0;
    
    tableRows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        const amountCell = row.querySelector('td:nth-child(4)');
        
        if (statusBadge && amountCell) {
            const status = statusBadge.textContent.trim();
            const amountText = amountCell.textContent.replace(/[^\d]/g, '');
            const amount = parseInt(amountText) || 0;
            
            if (status === 'Validé') {
                validated++;
                totalAmount += amount;
            } else if (status === 'En attente') {
                pending++;
            } else if (status === 'Retard') {
                overdue++;
            }
        }
    });
    
    // Mettre à jour l'affichage des statistiques
    updateStatDisplay(validated, pending, overdue, totalAmount);
}

function updateStatDisplay(validated, pending, overdue, totalAmount) {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const icon = card.querySelector('.stat-icon');
        const valueElement = card.querySelector('.stat-value');
        
        if (icon.classList.contains('validated')) {
            valueElement.textContent = validated;
        } else if (icon.classList.contains('pending')) {
            valueElement.textContent = pending;
        } else if (icon.classList.contains('overdue')) {
            valueElement.textContent = overdue;
        } else if (icon.classList.contains('revenue')) {
            valueElement.textContent = formatCurrency(totalAmount) + ' FCFA';
        }
    });
}

function animateElements() {
    // Animation des cartes de statistiques
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ============================================
// FILTRAGE DES DONNÉES
// ============================================
function filterPaymentsByMonth(month) {
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    const [year, monthNum] = month.split('-');
    
    tableRows.forEach(row => {
        const periodCell = row.querySelector('td:nth-child(3)');
        if (periodCell) {
            const periodText = periodCell.textContent.trim();
            const [rowMonth, rowYear] = periodText.split(' ');
            
            // Vérifier si le paiement correspond au mois sélectionné
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
            const selectedMonthName = monthNames[parseInt(monthNum) - 1];
            
            if (rowMonth === selectedMonthName && rowYear === year) {
                row.style.display = '';
                row.style.animation = 'fadeIn 0.5s ease';
            } else {
                row.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    row.style.display = 'none';
                }, 300);
            }
        }
    });
    
    // Mettre à jour les statistiques après filtrage
    setTimeout(() => {
        updatePaymentStats();
    }, 400);
}

// ============================================
// GESTION DES INTERACTIONS
// ============================================
function setupInteractions() {
    // Bouton "Nouveau paiement"
    const newPaymentBtn = document.querySelector('.btn-primary[onclick*="showNewPaymentModal"]');
    if (newPaymentBtn) {
        newPaymentBtn.addEventListener('click', function(e) {
            if (!e.defaultPrevented) {
                showNewPaymentModal();
            }
        });
    }
    
    // Boutons "Facture" (icône)
    const invoiceButtons = document.querySelectorAll('.btn-outline .fa-file-invoice').forEach(icon => {
        const button = icon.closest('button');
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const tenantName = row.querySelector('.user-info span').textContent;
            const amount = row.querySelector('td:nth-child(4)').textContent;
            downloadInvoice(tenantName, amount);
        });
    });
    
    // Boutons "Relancer"
    const reminderButtons = document.querySelectorAll('.btn-primary:not([onclick])').forEach(button => {
        if (button.textContent.includes('Relancer')) {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const tenantName = row.querySelector('.user-info span').textContent;
                sendReminder(tenantName);
            });
        }
    });
    
    // Gestion des clics sur les lignes
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                const tenantName = this.querySelector('.user-info span').textContent;
                const property = this.querySelector('td:nth-child(2)').textContent;
                showPaymentDetails(tenantName, property);
            }
        });
        
        // Effet de survol
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(252, 209, 22, 0.05)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

function showPaymentDetails(tenantName, property) {
    showNotification('info', `Détails du paiement - ${tenantName} (${property}) - Fonctionnalité en développement`);
    // Ici vous intégrerez l'ouverture d'un modal détaillé
}

function downloadInvoice(tenantName, amount) {
    showLoading(true);
    
    // Simuler le téléchargement
    setTimeout(() => {
        showLoading(false);
        showNotification('success', `Facture de ${amount} pour ${tenantName} téléchargée`);
        
        // Animation sur le bouton
        const button = event.target.closest('button');
        if (button) {
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = '';
            }, 300);
        }
    }, 1500);
}

function sendReminder(tenantName) {
    if (confirm(`Souhaitez-vous envoyer un rappel à ${tenantName} ?`)) {
        showLoading(true);
        
        // Simuler l'envoi du rappel
        setTimeout(() => {
            showLoading(false);
            showNotification('success', `Rappel envoyé à ${tenantName}`);
            
            // Mettre à jour le statut
            const row = event.target.closest('tr');
            const statusCell = row.querySelector('.status-badge');
            if (statusCell) {
                statusCell.textContent = 'En attente';
                statusCell.className = 'status-badge pending';
                statusCell.style.animation = 'pulse 1s ease';
            }
            
            // Changer le bouton
            const button = event.target.closest('button');
            if (button) {
                button.textContent = 'Suivi';
                button.className = 'btn btn-outline';
                button.style.padding = '0.4rem 0.8rem';
                button.innerHTML = '<i class="fas fa-clock"></i>';
            }
        }, 2000);
    }
}

function showNewPaymentModal() {
    // Créer et afficher un modal pour ajouter un nouveau paiement
    const modalHTML = `
        <div class="modal" id="newPaymentModal" style="display: block;">
            <div class="modal-overlay" onclick="closeNewPaymentModal()"></div>
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2><i class="fas fa-money-check-alt"></i> Nouveau Paiement</h2>
                    <button class="modal-close" onclick="closeNewPaymentModal()"><i class="fas fa-times"></i></button>
                </div>
                <form id="newPaymentForm" style="padding: 1.5rem;">
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Locataire</label>
                        <select style="width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0; border-radius: 8px;">
                            <option value="">Sélectionner un locataire</option>
                            <option value="aminata">Aminata Sy - Appartement B12</option>
                            <option value="jean">Jean Dupont - Villa 45</option>
                            <option value="mariam">Mariam Sow - Studio C5</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Montant (FCFA)</label>
                        <input type="number" style="width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0; border-radius: 8px;" placeholder="Ex: 450000">
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Méthode de paiement</label>
                        <select style="width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0; border-radius: 8px;">
                            <option value="">Sélectionner une méthode</option>
                            <option value="orange">Orange Money</option>
                            <option value="moov">Moov Money</option>
                            <option value="virement">Virement bancaire</option>
                            <option value="especes">Espèces</option>
                        </select>
                    </div>
                    <div class="modal-actions" style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button type="button" class="btn btn-outline" style="flex: 1;" onclick="closeNewPaymentModal()">Annuler</button>
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Gérer la soumission du formulaire
    const form = document.getElementById('newPaymentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            processNewPayment(this);
        });
    }
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
}

function closeNewPaymentModal() {
    const modal = document.getElementById('newPaymentModal');
    if (modal) {
        modal.remove();
    }
    document.body.style.overflow = '';
}

function processNewPayment(form) {
    showLoading(true);
    
    // Simuler le traitement
    setTimeout(() => {
        showLoading(false);
        closeNewPaymentModal();
        showNotification('success', 'Paiement enregistré avec succès');
        
        // Ajouter une nouvelle ligne au tableau
        addNewPaymentRow();
    }, 1500);
}

function addNewPaymentRow() {
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <div class="user-info">
                <div class="avatar" style="background: #8B5CF6;">ND</div>
                <span>Nouveau Locataire</span>
            </div>
        </td>
        <td>Nouvelle Propriété</td>
        <td>${new Date().toLocaleDateString('fr-FR', {month: 'short', year: 'numeric'})}</td>
        <td style="font-weight: 700;">250,000 FCFA</td>
        <td>Orange Money</td>
        <td><span class="status-badge success">Validé</span></td>
        <td><button class="btn btn-outline" style="padding: 0.4rem 0.8rem;"><i class="fas fa-file-invoice"></i></button></td>
    `;
    
    tableBody.appendChild(newRow);
    
    // Animation d'entrée
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        newRow.style.transition = 'all 0.5s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateX(0)';
    }, 100);
    
    // Re-attacher les événements
    setupRowInteractions(newRow);
}

function setupRowInteractions(row) {
    const invoiceBtn = row.querySelector('.btn-outline');
    if (invoiceBtn) {
        invoiceBtn.addEventListener('click', function() {
            const tenantName = row.querySelector('.user-info span').textContent;
            const amount = row.querySelector('td:nth-child(4)').textContent;
            downloadInvoice(tenantName, amount);
        });
    }
    
    row.addEventListener('click', function(e) {
        if (!e.target.closest('button')) {
            const tenantName = this.querySelector('.user-info span').textContent;
            const property = this.querySelector('td:nth-child(2)').textContent;
            showPaymentDetails(tenantName, property);
        }
    });
}

// ============================================
// MENU MOBILE
// ============================================
function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.title = 'Menu principal';
    menuToggle.style.display = 'none';
    
    const headerLeft = document.querySelector('.header-left');
    if (headerLeft) {
        headerLeft.appendChild(menuToggle);
    }
    
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        this.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });
    
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
// FONCTIONS UTILITAIRES
// ============================================
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K';
    }
    return amount.toLocaleString('fr-FR');
}

function showLoading(show) {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (show) {
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Traitement en cours...</p>
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                #loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(26, 54, 93, 0.95);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    color: white;
                }
                .loading-spinner {
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(252, 209, 22, 0.3);
                    border-top: 4px solid #FCD116;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1.5rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                #loading-overlay p {
                    font-size: 1.1rem;
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

function showNotification(type, message) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span style="margin-right: 0.75rem; font-size: 1.1rem;">${
            type === 'success' ? '✅' : 
            type === 'error' ? '❌' : 
            type === 'warning' ? '⚠️' : 'ℹ️'
        }</span>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; font-size: 1.25rem;">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        max-width: 400px;
        font-weight: 500;
        font-size: 0.95rem;
        background: ${
            type === 'success' ? 'linear-gradient(135deg, #007A5E 0%, #009A73 100%)' : 
            type === 'error' ? 'linear-gradient(135deg, #CE1126 0%, #E53E3E 100%)' : 
            type === 'warning' ? 'linear-gradient(135deg, #D69E2E 0%, #F59E0B 100%)' : 
            'linear-gradient(135deg, #1A365D 0%, #2D4B8E 100%)'
        };
        color: white;
    `;
    
    document.body.appendChild(notification);
    
    // Ajouter l'animation CSS si nécessaire
    if (!document.querySelector('#notification-animation')) {
        const style = document.createElement('style');
        style.id = 'notification-animation';
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(30px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
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
        
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 1000);
    }
}

// ============================================
// ÉCOUTEURS CLAVIER
// ============================================
document.addEventListener('keydown', function(e) {
    // Rafraîchir avec F5
    if (e.key === 'F5') {
        e.preventDefault();
        loadPaymentsData();
    }
    
    // Échap pour fermer les modals
    if (e.key === 'Escape') {
        closeNewPaymentModal();
    }
    
    // Ctrl+P pour ajouter un paiement
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        showNewPaymentModal();
    }
});

// ============================================
// EXPOSER LES FONCTIONS GLOBALES
// ============================================
window.logout = logout;
window.showNewPaymentModal = showNewPaymentModal;
window.closeNewPaymentModal = closeNewPaymentModal;
window.loadPaymentsData = loadPaymentsData;

// Initialisation finale
setTimeout(() => {
    console.log('✅ Page Paiements prête !');
    
    // Vérifier que tout est bien affiché
    const statCards = document.querySelectorAll('.stat-card');
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    console.log(`📊 Statistiques: ${statCards.length} cartes`);
    console.log(`📋 Paiements: ${tableRows.length} lignes`);
    
    if (statCards.length === 0) {
        console.warn('⚠️ Aucune carte de statistique trouvée');
    }
    
    if (tableRows.length === 0) {
        console.warn('⚠️ Aucune ligne de paiement trouvée');
    }
}, 500);