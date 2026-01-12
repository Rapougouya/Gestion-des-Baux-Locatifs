// ============================================
// INITIALISATION DE LA PAGE IMPÔTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('💰 Page Impôts - Initialisation');
    
    // Initialiser les composants
    initComponents();
    
    // Charger les données
    loadTaxData();
    
    // Configurer les interactions
    setupInteractions();
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Vérifier l'authentification
    checkAuth();
    
    // Initialiser le compte à rebours
    initCountdown();
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
    
    // Initialiser les compteurs animés
    initAnimatedCounters();
    
    // Initialiser les tooltips
    initTooltips();
}

function initAnimations() {
    // Animation des cartes au survol
    const taxCards = document.querySelectorAll('.tax-card');
    taxCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.12)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Animation des déclarations
    const declarationItems = document.querySelectorAll('.declaration-item');
    declarationItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

function initAnimatedCounters() {
    // Animer le montant de l'impôt
    const taxAmountElement = document.querySelector('.tax-card .tax-amount');
    if (taxAmountElement) {
        const amountText = taxAmountElement.textContent;
        const match = amountText.match(/[\d,.]+/);
        
        if (match) {
            const amount = parseFloat(match[0].replace(/,/g, ''));
            if (!isNaN(amount)) {
                animateMoneyCounter(taxAmountElement, amount, ' FCFA');
            }
        }
    }
    
    // Animer les montants des déclarations
    const declarationAmounts = document.querySelectorAll('.declaration-info strong');
    declarationAmounts.forEach(element => {
        const amountText = element.textContent;
        const match = amountText.match(/[\d,.]+/);
        
        if (match) {
            const amount = parseFloat(match[0].replace(/,/g, ''));
            if (!isNaN(amount)) {
                animateMoneyCounter(element, amount, ' FCFA');
            }
        }
    });
}

function animateMoneyCounter(element, targetValue, suffix = '') {
    let current = 0;
    const increment = targetValue / 60;
    const originalText = element.textContent;
    
    const interval = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(interval);
            element.textContent = formatCurrency(current) + suffix;
        } else {
            element.textContent = formatCurrency(Math.floor(current)) + suffix;
        }
    }, 30);
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

// ============================================
// COMPTE À REBOURS POUR L'ÉCHÉANCE
// ============================================
function initCountdown() {
    const countdownElement = document.querySelector('.tax-countdown');
    if (!countdownElement || !countdownElement.textContent.includes('jours')) return;
    
    const deadline = new Date('2024-12-31');
    updateCountdown(deadline, countdownElement);
    
    // Mettre à jour toutes les 24 heures
    setInterval(() => {
        updateCountdown(deadline, countdownElement);
    }, 24 * 60 * 60 * 1000);
}

function updateCountdown(deadline, element) {
    const now = new Date();
    const timeDiff = deadline - now;
    
    if (timeDiff <= 0) {
        element.textContent = 'Échéance dépassée';
        element.style.color = '#EF4444';
        element.style.animation = 'pulse 1s infinite';
        return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let text = `${days} jours restants`;
    if (days <= 30) {
        text += ` (${hours} heures)`;
        element.style.color = '#F59E0B';
        element.style.animation = 'pulse 2s infinite';
    } else if (days <= 7) {
        element.style.color = '#EF4444';
        element.style.animation = 'pulse 1s infinite';
    }
    
    element.textContent = text;
}

// ============================================
// CHARGEMENT DES DONNÉES FISCALES
// ============================================
async function loadTaxData() {
    try {
        showLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Calculer l'impôt estimé
        calculateEstimatedTax();
        
        // Mettre à jour les données
        updateTaxData();
        
        // Animer les éléments
        animateTaxElements();
        
        showNotification('success', 'Données fiscales chargées avec succès');
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showNotification('error', 'Erreur de chargement des données fiscales');
    } finally {
        showLoading(false);
    }
}

function calculateEstimatedTax() {
    // Données mockées pour le calcul
    const estimatedRevenue = 34200000; // 34.2M FCFA
    const taxRate = 0.10; // 10%
    const estimatedTax = estimatedRevenue * taxRate;
    
    // Mettre à jour l'affichage
    const revenueElement = document.querySelector('.calculation-row:nth-child(1) strong');
    const rateElement = document.querySelector('.calculation-row:nth-child(2) strong');
    const taxElement = document.querySelector('.calculation-row.total span:last-child');
    
    if (revenueElement) revenueElement.textContent = formatCurrency(estimatedRevenue) + ' FCFA';
    if (rateElement) rateElement.textContent = '10%';
    if (taxElement) taxElement.textContent = formatCurrency(estimatedTax) + ' FCFA';
}

function updateTaxData() {
    // Mettre à jour l'historique des déclarations
    const declarationItems = document.querySelectorAll('.declaration-item');
    declarationItems.forEach((item, index) => {
        const yearElement = item.querySelector('.declaration-year');
        const amountElement = item.querySelector('.declaration-info strong');
        
        // Données mockées
        const years = [2023, 2022];
        const amounts = [2850000, 2400000];
        
        if (yearElement && index < years.length) {
            yearElement.textContent = years[index];
        }
        
        if (amountElement && index < amounts.length) {
            setTimeout(() => {
                amountElement.textContent = formatCurrency(amounts[index]) + ' FCFA';
            }, index * 300 + 500);
        }
    });
}

function animateTaxElements() {
    // Animation des cartes d'aperçu
    const taxCards = document.querySelectorAll('.tax-card');
    taxCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animation des déclarations
    const declarationItems = document.querySelectorAll('.declaration-item');
    declarationItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200 + 600);
    });
}

// ============================================
// GESTION DES INTERACTIONS
// ============================================
function setupInteractions() {
    // Bouton "Déclarer revenus"
    const declareBtn = document.querySelector('.btn-primary');
    if (declareBtn && declareBtn.textContent.includes('Déclarer')) {
        declareBtn.addEventListener('click', function() {
            showDeclarationForm();
        });
    }
    
    // Bouton "Générer attestation"
    const generateBtn = document.querySelector('.btn-primary .fa-file-pdf');
    if (generateBtn) {
        const button = generateBtn.closest('button');
        button.addEventListener('click', function() {
            generateTaxCertificate();
        });
    }
    
    // Bouton "Payer en ligne"
    const payBtn = document.querySelector('.btn-outline .fa-credit-card');
    if (payBtn) {
        const button = payBtn.closest('button');
        button.addEventListener('click', function() {
            makeOnlinePayment();
        });
    }
    
    // Boutons de téléchargement des déclarations
    const downloadBtns = document.querySelectorAll('.declaration-item .btn-outline .fa-download');
    downloadBtns.forEach(icon => {
        const button = icon.closest('button');
        button.addEventListener('click', function() {
            const year = this.closest('.declaration-item').querySelector('.declaration-year').textContent;
            downloadTaxDeclaration(year);
        });
    });
}

function showDeclarationForm() {
    // Créer et afficher un modal de déclaration
    const modalHTML = `
        <div class="modal" id="taxDeclarationModal" style="display: block;">
            <div class="modal-overlay" onclick="closeTaxDeclarationModal()"></div>
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-file-invoice"></i> Déclaration de Revenus 2024</h2>
                    <button class="modal-close" onclick="closeTaxDeclarationModal()"><i class="fas fa-times"></i></button>
                </div>
                <form id="taxDeclarationForm" style="padding: 1.5rem;">
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Revenus locatifs bruts 2024 (FCFA)</label>
                        <input type="number" style="width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0; border-radius: 8px;" 
                               placeholder="Ex: 34200000" value="34200000">
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Montant estimé de l'impôt (10%)</label>
                        <div style="padding: 0.75rem; background: #F1F5F9; border-radius: 8px; font-weight: 700; color: #CE1126;">
                            3,420,000 FCFA
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Méthode de paiement</label>
                        <select style="width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0; border-radius: 8px;">
                            <option value="">Sélectionner une méthode</option>
                            <option value="online">Paiement en ligne</option>
                            <option value="bank">Virement bancaire</option>
                            <option value="treasury">Trésor public</option>
                        </select>
                    </div>
                    <div class="modal-actions" style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button type="button" class="btn btn-outline" style="flex: 1;" onclick="closeTaxDeclarationModal()">Annuler</button>
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Soumettre la déclaration</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Gérer la soumission du formulaire
    const form = document.getElementById('taxDeclarationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitTaxDeclaration(this);
        });
    }
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
}

function closeTaxDeclarationModal() {
    const modal = document.getElementById('taxDeclarationModal');
    if (modal) {
        modal.remove();
    }
    document.body.style.overflow = '';
}

function submitTaxDeclaration(form) {
    showLoading(true);
    
    // Simuler la soumission
    setTimeout(() => {
        showLoading(false);
        closeTaxDeclarationModal();
        
        // Mettre à jour l'interface
        updateAfterDeclaration();
        
        showNotification('success', 'Déclaration soumise avec succès');
    }, 2000);
}

function updateAfterDeclaration() {
    // Mettre à jour le statut de la carte d'aperçu
    const statusCard = document.querySelector('.tax-card:nth-child(3)');
    if (statusCard) {
        const amountElement = statusCard.querySelector('.tax-amount');
        const detailElement = statusCard.querySelector('.tax-detail');
        
        if (amountElement) {
            amountElement.textContent = 'Déclaré';
            amountElement.style.color = '#F59E0B';
        }
        
        if (detailElement) {
            detailElement.textContent = 'En attente de paiement';
            detailElement.style.color = '#F59E0B';
        }
    }
    
    // Ajouter à l'historique
    addToDeclarationHistory();
}

function addToDeclarationHistory() {
    const declarationsList = document.querySelector('.declarations-list');
    if (!declarationsList) return;
    
    const newDeclaration = document.createElement('div');
    newDeclaration.className = 'declaration-item';
    newDeclaration.style.opacity = '0';
    newDeclaration.style.transform = 'translateX(-20px)';
    
    newDeclaration.innerHTML = `
        <div class="declaration-year">2024</div>
        <div class="declaration-info">
            <strong>3,420,000 FCFA</strong> • Déclaré le ${new Date().toLocaleDateString('fr-FR')}
        </div>
        <span class="declaration-status pending">En attente</span>
        <button class="btn btn-outline" style="padding: 0.4rem 0.8rem;"><i class="fas fa-download"></i></button>
    `;
    
    declarationsList.insertBefore(newDeclaration, declarationsList.firstChild);
    
    // Animation d'entrée
    setTimeout(() => {
        newDeclaration.style.transition = 'all 0.5s ease';
        newDeclaration.style.opacity = '1';
        newDeclaration.style.transform = 'translateX(0)';
    }, 100);
    
    // Re-attacher les événements
    const downloadBtn = newDeclaration.querySelector('.btn-outline');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadTaxDeclaration('2024');
        });
    }
}

function generateTaxCertificate() {
    showLoading(true);
    
    // Simuler la génération du PDF
    setTimeout(() => {
        showLoading(false);
        showNotification('success', 'Attestation générée avec succès. Téléchargement en cours...');
        
        // Animation sur le bouton
        const button = event.target.closest('button');
        if (button) {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = '';
            }, 300);
        }
        
        // Simulation du téléchargement
        setTimeout(() => {
            showNotification('info', 'Attestation fiscale 2024 téléchargée');
        }, 1500);
    }, 2000);
}

function makeOnlinePayment() {
    if (confirm('Êtes-vous sûr de vouloir procéder au paiement en ligne de 3,420,000 FCFA ?')) {
        showLoading(true);
        
        // Simuler le processus de paiement
        setTimeout(() => {
            showLoading(false);
            
            // Créer une fenêtre de paiement simulée
            showPaymentGateway();
        }, 1500);
    }
}

function showPaymentGateway() {
    const paymentHTML = `
        <div class="modal" id="paymentGatewayModal" style="display: block;">
            <div class="modal-overlay" onclick="closePaymentGatewayModal()"></div>
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <div class="modal-header">
                    <h2><i class="fas fa-lock"></i> Paiement Sécurisé</h2>
                    <button class="modal-close" onclick="closePaymentGatewayModal()"><i class="fas fa-times"></i></button>
                </div>
                <div style="padding: 2rem;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #007A5E; margin-bottom: 1rem;">
                        3,420,000 FCFA
                    </div>
                    <div style="color: #64748b; margin-bottom: 2rem;">
                        Impôt locatif 2024
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                        <button class="btn btn-primary" onclick="processPayment('orange')" style="background: #FF6600;">
                            <i class="fas fa-mobile-alt"></i> Orange Money
                        </button>
                        <button class="btn btn-primary" onclick="processPayment('moov')" style="background: #00A859;">
                            <i class="fas fa-mobile-alt"></i> Moov Money
                        </button>
                        <button class="btn btn-outline" onclick="processPayment('card')">
                            <i class="fas fa-credit-card"></i> Carte bancaire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const paymentContainer = document.createElement('div');
    paymentContainer.innerHTML = paymentHTML;
    document.body.appendChild(paymentContainer);
}

function closePaymentGatewayModal() {
    const modal = document.getElementById('paymentGatewayModal');
    if (modal) {
        modal.remove();
    }
}

function processPayment(method) {
    closePaymentGatewayModal();
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        
        if (Math.random() > 0.1) { // 90% de succès
            showNotification('success', 'Paiement effectué avec succès !');
            
            // Mettre à jour l'interface
            updateAfterPayment();
        } else {
            showNotification('error', 'Échec du paiement. Veuillez réessayer.');
        }
    }, 3000);
}

function updateAfterPayment() {
    // Mettre à jour le statut de la déclaration 2024
    const statusElement = document.querySelector('.declaration-status.pending');
    if (statusElement) {
        statusElement.textContent = 'Payé';
        statusElement.className = 'declaration-status paid';
        statusElement.style.animation = 'pulse 2s ease';
    }
    
    // Mettre à jour la carte d'aperçu
    const taxCard = document.querySelector('.tax-card:nth-child(3)');
    if (taxCard) {
        const amountElement = taxCard.querySelector('.tax-amount');
        const detailElement = taxCard.querySelector('.tax-detail');
        
        if (amountElement) {
            amountElement.textContent = 'Payé';
            amountElement.style.color = '#10B981';
        }
        
        if (detailElement) {
            detailElement.textContent = 'Payé le ' + new Date().toLocaleDateString('fr-FR');
            detailElement.style.color = '#10B981';
        }
    }
}

function downloadTaxDeclaration(year) {
    showLoading(true);
    
    // Simuler le téléchargement
    setTimeout(() => {
        showLoading(false);
        showNotification('success', `Déclaration ${year} téléchargée avec succès`);
        
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
        loadTaxData();
    }
    
    // Échap pour fermer les modals
    if (e.key === 'Escape') {
        closeTaxDeclarationModal();
        closePaymentGatewayModal();
    }
    
    // Ctrl+D pour déclarer
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        showDeclarationForm();
    }
});

// ============================================
// EXPOSER LES FONCTIONS GLOBALES
// ============================================
window.logout = logout;
window.showDeclarationForm = showDeclarationForm;
window.closeTaxDeclarationModal = closeTaxDeclarationModal;
window.loadTaxData = loadTaxData;
window.closePaymentGatewayModal = closePaymentGatewayModal;
window.processPayment = processPayment;

// Initialisation finale
setTimeout(() => {
    console.log('✅ Page Impôts prête !');
    
    // Vérifier que tout est bien affiché
    const taxCards = document.querySelectorAll('.tax-card');
    const declarationItems = document.querySelectorAll('.declaration-item');
    
    console.log(`📊 Cartes d'aperçu: ${taxCards.length}`);
    console.log(`📋 Déclarations historiques: ${declarationItems.length}`);
    
    if (taxCards.length === 0) {
        console.warn('⚠️ Aucune carte d\'aperçu fiscal trouvée');
    }
    
    if (declarationItems.length === 0) {
        console.warn('⚠️ Aucun historique de déclaration trouvé');
    }
}, 500);