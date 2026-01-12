// ============================================
// INITIALISATION DE LA PAGE PROPRIÉTÉS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Page Propriétés - Initialisation');
    
    // Initialiser les composants
    initComponents();
    
    // Charger les données
    loadPropertiesData();
    
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
    // Mode développement: créer des données fictives
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
    
    // Initialiser la recherche
    initSearch();
    
    // Initialiser les filtres
    initFilters();
    
    // Initialiser les tooltips
    initTooltips();
}

function initAnimations() {
    // Animation des cartes au survol
    const cards = document.querySelectorAll('.property-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animation des boutons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        filterProperties(searchTerm);
    });
}

function initFilters() {
    const filterSelect = document.querySelector('.filter-select');
    if (!filterSelect) return;
    
    filterSelect.addEventListener('change', function() {
        const filterValue = this.value;
        filterPropertiesByStatus(filterValue);
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

// ============================================
// FILTRAGE DES PROPRIÉTÉS
// ============================================
function filterProperties(searchTerm) {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        const propertyName = card.querySelector('h3').textContent.toLowerCase();
        const propertyLocation = card.querySelector('.property-location').textContent.toLowerCase();
        const propertyTenant = card.querySelector('.property-tenant').textContent.toLowerCase();
        
        if (searchTerm === '' || 
            propertyName.includes(searchTerm) ||
            propertyLocation.includes(searchTerm) ||
            propertyTenant.includes(searchTerm)) {
            card.style.display = 'flex';
            card.style.animation = 'slideInUp 0.4s ease forwards';
        } else {
            card.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Animation CSS
    if (!document.querySelector('#filter-animations')) {
        const style = document.createElement('style');
        style.id = 'filter-animations';
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function filterPropertiesByStatus(status) {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        const statusBadge = card.querySelector('.status-badge');
        const cardStatus = statusBadge.classList.contains('occupied') ? 'occupied' :
                          statusBadge.classList.contains('vacant') ? 'vacant' :
                          statusBadge.classList.contains('maintenance') ? 'maintenance' : '';
        
        if (status === '' || cardStatus === status) {
            card.style.display = 'flex';
            card.style.animation = 'slideInUp 0.4s ease forwards';
        } else {
            card.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================
async function loadPropertiesData() {
    try {
        showLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Animer les cartes
        animateCards();
        
        // Mettre à jour les statistiques
        updateStats();
        
        showNotification('success', 'Propriétés chargées avec succès');
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showNotification('error', 'Erreur de chargement des données');
    } finally {
        showLoading(false);
    }
}

function animateCards() {
    const cards = document.querySelectorAll('.property-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function updateStats() {
    // Compter les propriétés par statut
    const cards = document.querySelectorAll('.property-card');
    let occupied = 0;
    let vacant = 0;
    
    cards.forEach(card => {
        const statusBadge = card.querySelector('.status-badge');
        if (statusBadge.classList.contains('occupied')) {
            occupied++;
        } else if (statusBadge.classList.contains('vacant')) {
            vacant++;
        }
    });
    
    // Afficher les statistiques dans la console (pourrait être affiché dans l'UI)
    console.log(`📊 Statistiques: Occupées: ${occupied}, Vacantes: ${vacant}, Total: ${cards.length}`);
}

// ============================================
// GESTION DES INTERACTIONS
// ============================================
function setupInteractions() {
    // Bouton "Ajouter une propriété"
    const addBtn = document.querySelector('.btn-primary[onclick*="showAddPropertyModal"]');
    if (addBtn) {
        addBtn.addEventListener('click', function(e) {
            if (!e.defaultPrevented) {
                showAddPropertyModal();
            }
        });
    }
    
    // Boutons "Voir" (œil)
    const viewButtons = document.querySelectorAll('.btn-outline .fa-eye').forEach(icon => {
        const button = icon.closest('button');
        button.addEventListener('click', function() {
            const card = this.closest('.property-card');
            const propertyName = card.querySelector('h3').textContent;
            viewPropertyDetails(propertyName);
        });
    });
    
    // Boutons "Modifier"
    const editButtons = document.querySelectorAll('.btn-primary .fa-edit').forEach(icon => {
        const button = icon.closest('button');
        button.addEventListener('click', function() {
            const card = this.closest('.property-card');
            const propertyName = card.querySelector('h3').textContent;
            editProperty(propertyName);
        });
    });
    
    // Boutons "Louer"
    const rentButtons = document.querySelectorAll('.btn-success .fa-file-contract').forEach(icon => {
        const button = icon.closest('button');
        button.addEventListener('click', function() {
            const card = this.closest('.property-card');
            const propertyName = card.querySelector('h3').textContent;
            rentProperty(propertyName);
        });
    });
    
    // Gestion du formulaire modal
    const addPropertyForm = document.getElementById('addPropertyForm');
    if (addPropertyForm) {
        addPropertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProperty(this);
        });
    }
}

function viewPropertyDetails(propertyName) {
    showNotification('info', `Détails de ${propertyName} - Fonctionnalité en développement`);
    // Ici vous intégrerez l'ouverture d'un modal détaillé ou navigation vers une page dédiée
}

function editProperty(propertyName) {
    showNotification('info', `Modification de ${propertyName} - Fonctionnalité en développement`);
    // Ici vous intégrerez l'ouverture d'un modal d'édition
}

function rentProperty(propertyName) {
    if (confirm(`Souhaitez-vous louer la propriété "${propertyName}" ?`)) {
        showLoading(true);
        
        // Simuler le traitement
        setTimeout(() => {
            showLoading(false);
            showNotification('success', `Processus de location initié pour ${propertyName}`);
            
            // Mettre à jour l'affichage de la carte
            const card = document.querySelector(`.property-card:has(h3:contains("${propertyName}"))`);
            if (card) {
                // Changer le statut
                const statusBadge = card.querySelector('.status-badge');
                statusBadge.className = 'status-badge occupied';
                statusBadge.textContent = 'Occupé';
                
                // Ajouter un locataire fictif
                const tenantDiv = card.querySelector('.property-tenant');
                tenantDiv.innerHTML = '<i class="fas fa-user-circle"></i> Locataire: <strong>Nouveau Locataire</strong>';
                
                // Changer le bouton
                const rentBtn = card.querySelector('.btn-success');
                rentBtn.className = 'btn btn-primary';
                rentBtn.innerHTML = '<i class="fas fa-edit"></i> Modifier';
            }
        }, 1500);
    }
}

// ============================================
// GESTION DU MODAL
// ============================================
function showAddPropertyModal() {
    const modal = document.getElementById('addPropertyModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus sur le premier champ
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeAddPropertyModal() {
    const modal = document.getElementById('addPropertyModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Réinitialiser le formulaire
        const form = document.getElementById('addPropertyForm');
        if (form) form.reset();
    }
}

function addNewProperty(form) {
    const formData = new FormData(form);
    const propertyName = formData.get('propertyName') || 'Nouvelle Propriété';
    const rentAmount = formData.get('rentAmount');
    
    showLoading(true);
    
    // Simuler l'ajout
    setTimeout(() => {
        showLoading(false);
        closeAddPropertyModal();
        
        // Créer une nouvelle carte
        createNewPropertyCard(propertyName, rentAmount);
        
        showNotification('success', `Propriété "${propertyName}" ajoutée avec succès`);
    }, 1500);
}

function createNewPropertyCard(name, rent) {
    const propertiesGrid = document.querySelector('.properties-grid');
    if (!propertiesGrid) return;
    
    const newCard = document.createElement('div');
    newCard.className = 'property-card';
    newCard.style.opacity = '0';
    newCard.style.transform = 'translateY(30px)';
    
    newCard.innerHTML = `
        <div class="property-header">
            <h3>${name}</h3>
            <span class="status-badge vacant">Vacant</span>
        </div>
        <div class="property-info">
            <div class="property-location">
                <i class="fas fa-map-marker-alt"></i>
                Localisation à définir
            </div>
            <div class="property-details">
                <span><i class="fas fa-building"></i> Type à définir</span>
                <span><i class="fas fa-expand-arrows-alt"></i> Surface à définir</span>
                <span><i class="fas fa-money-bill-wave" style="color: #007A5E;"></i> ${rent ? rent + ' FCFA' : 'Prix à définir'}</span>
            </div>
            <div class="property-tenant">
                <span style="color: #CE1126;"><i class="fas fa-info-circle"></i> Libre immédiatement</span>
            </div>
        </div>
        <div class="property-actions">
            <button class="btn btn-outline" title="Voir détails"><i class="fas fa-eye"></i></button>
            <button class="btn btn-success"><i class="fas fa-file-contract"></i> Louer</button>
        </div>
    `;
    
    propertiesGrid.insertBefore(newCard, propertiesGrid.firstChild);
    
    // Animation d'entrée
    setTimeout(() => {
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
        newCard.style.transition = 'all 0.6s ease';
    }, 100);
    
    // Re-attacher les événements
    setTimeout(() => {
        setupCardInteractions(newCard);
    }, 500);
}

function setupCardInteractions(card) {
    const viewBtn = card.querySelector('.btn-outline');
    const rentBtn = card.querySelector('.btn-success');
    
    if (viewBtn) {
        viewBtn.addEventListener('click', function() {
            const propertyName = card.querySelector('h3').textContent;
            viewPropertyDetails(propertyName);
        });
    }
    
    if (rentBtn) {
        rentBtn.addEventListener('click', function() {
            const propertyName = card.querySelector('h3').textContent;
            rentProperty(propertyName);
        });
    }
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
// NOTIFICATIONS ET LOADING
// ============================================
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
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(30px)';
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
        loadPropertiesData();
    }
    
    // Échap pour fermer le modal
    if (e.key === 'Escape') {
        closeAddPropertyModal();
    }
    
    // Ctrl+N pour ajouter une propriété
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showAddPropertyModal();
    }
});

// ============================================
// EXPOSER LES FONCTIONS GLOBALES
// ============================================
window.logout = logout;
window.showAddPropertyModal = showAddPropertyModal;
window.closeAddPropertyModal = closeAddPropertyModal;
window.loadPropertiesData = loadPropertiesData;

// Initialisation finale
setTimeout(() => {
    console.log('✅ Page Propriétés prête !');
    
    // Vérifier que tout est bien affiché
    const propertyCards = document.querySelectorAll('.property-card');
    console.log(`🏠 Propriétés chargées: ${propertyCards.length} cartes`);
    
    if (propertyCards.length === 0) {
        console.warn('⚠️ Aucune carte de propriété trouvée');
    }
}, 500);