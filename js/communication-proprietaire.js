// ============================================
// INITIALISATION DE LA PAGE COMMUNICATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('💬 Page Communication - Initialisation');
    
    // Initialiser les composants
    initComponents();
    
    // Charger les données
    loadCommunicationData();
    
    // Configurer les interactions
    setupInteractions();
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Vérifier l'authentification
    checkAuth();
    
    // Initialiser le gestionnaire de communication
    window.communicationManager = new CommunicationManager();
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
            id: 'demo_user_' + Date.now(),
            avatar: 'MD'
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
            // Créer un utilisateur démo en cas d'erreur
            const demoUser = {
                name: 'M. Mohamed Diallo',
                email: 'demo@pnsbil.bf',
                role: 'propriétaire',
                id: 'demo_user_' + Date.now(),
                avatar: 'MD'
            };
            updateUserInfo(demoUser);
        }
    }
}

function updateUserInfo(user) {
    const userNameElement = document.getElementById('userName');
    const userAvatarElement = document.getElementById('userAvatar');
    
    if (userNameElement && user.name) {
        userNameElement.textContent = user.name;
    }
    
    if (userAvatarElement && user.avatar) {
        userAvatarElement.textContent = user.avatar;
    }
}

// ============================================
// INITIALISATION DES COMPOSANTS
// ============================================
function initComponents() {
    console.log('🎨 Initialisation des composants');
    
    // Initialiser la recherche
    initSearch();
    
    // Initialiser les tooltips
    initTooltips();
    
    // Initialiser le chat
    initChat();
    
    // Initialiser le responsive
    initResponsive();
    
    // Animer l'entrée des éléments
    animateEntrance();
    
    // Initialiser les notifications
    initNotifications();
}

function initSearch() {
    const searchInput = document.getElementById('contactSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const contactItems = document.querySelectorAll('.contact-item');
        let hasVisibleItems = false;
        
        contactItems.forEach(item => {
            const contactName = item.querySelector('.contact-name')?.textContent.toLowerCase() || '';
            const contactRole = item.querySelector('.contact-role')?.textContent.toLowerCase() || '';
            const lastMessage = item.querySelector('.contact-lastmsg')?.textContent.toLowerCase() || '';
            
            const isVisible = contactName.includes(searchTerm) || 
                            contactRole.includes(searchTerm) || 
                            lastMessage.includes(searchTerm);
            
            item.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) hasVisibleItems = true;
        });
        
        // Gérer l'affichage des messages "aucun résultat"
        const noResultsElement = document.getElementById('no-results-message');
        if (!hasVisibleItems && searchTerm.length > 0) {
            if (!noResultsElement) {
                const noResults = document.createElement('div');
                noResults.id = 'no-results-message';
                noResults.className = 'no-results-message';
                noResults.innerHTML = `
                    <i class="fas fa-search"></i>
                    <div>
                        <strong>Aucun contact trouvé</strong>
                        <p>Aucun contact ne correspond à "${searchTerm}"</p>
                    </div>
                `;
                document.querySelector('.contacts-list')?.appendChild(noResults);
            }
        } else if (noResultsElement) {
            noResultsElement.remove();
        }
        
        // Gérer l'animation de recherche
        if (searchTerm.length > 0) {
            searchInput.classList.add('searching');
        } else {
            searchInput.classList.remove('searching');
        }
    });
    
    // Ajouter un bouton pour effacer la recherche
    const searchClearBtn = document.createElement('button');
    searchClearBtn.className = 'search-clear-btn';
    searchClearBtn.innerHTML = '<i class="fas fa-times"></i>';
    searchClearBtn.title = 'Effacer la recherche';
    searchClearBtn.style.display = 'none';
    
    searchClearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });
    
    searchInput.parentNode.appendChild(searchClearBtn);
    
    // Afficher/masquer le bouton d'effacement
    searchInput.addEventListener('input', function() {
        searchClearBtn.style.display = this.value.length > 0 ? 'flex' : 'none';
    });
}

function initTooltips() {
    // Créer des tooltips pour les boutons d'action
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            if (!tooltipText) return;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
    
    // Tooltips pour les statuts des contacts
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach(indicator => {
        const status = indicator.classList.contains('online') ? 'En ligne' : 
                      indicator.classList.contains('offline') ? 'Hors ligne' :
                      indicator.classList.contains('away') ? 'Absent' : 'Occupé';
        
        indicator.setAttribute('data-tooltip', status);
    });
}

function initChat() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.querySelector('.send-btn');
    
    if (messageInput) {
        // Auto-resize de la zone de texte
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });
        
        // Envoi avec Enter (sans Shift)
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Focus automatique sur la zone de texte
        messageInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        messageInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }
    
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Initialiser les boutons d'action rapide
    const quickButtons = document.querySelectorAll('.quick-btn');
    quickButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            handleQuickAction(action);
        });
    });
}

function initResponsive() {
    // Détecter les changements de taille d'écran
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, 250);
    });
    
    // Initialiser l'état responsive
    handleResize();
}

function handleResize() {
    const isMobile = window.innerWidth <= 992;
    const contactsPanel = document.querySelector('.contacts-panel');
    const chatPanel = document.querySelector('.chat-panel');
    
    if (isMobile) {
        // Mode mobile
        contactsPanel?.classList.remove('active');
        chatPanel?.classList.add('mobile-view');
    } else {
        // Mode desktop
        contactsPanel?.classList.add('active');
        chatPanel?.classList.remove('mobile-view');
    }
}

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-contacts-toggle');
    if (!mobileToggle) {
        // Créer le bouton de bascule mobile s'il n'existe pas
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-contacts-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-users"></i>';
        toggleBtn.title = 'Afficher les contacts';
        
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.insertBefore(toggleBtn, chatHeader.firstChild);
            
            toggleBtn.addEventListener('click', function() {
                const contactsPanel = document.querySelector('.contacts-panel');
                contactsPanel?.classList.toggle('active');
                
                // Animer l'icône
                this.classList.toggle('active');
            });
        }
    }
}

function animateEntrance() {
    // Animation d'entrée des contacts
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
        item.classList.add('animate-in');
    });
    
    // Animation d'entrée du chat
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.style.opacity = '0';
        chatMessages.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            chatMessages.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            chatMessages.style.opacity = '1';
            chatMessages.style.transform = 'translateY(0)';
        }, 300);
    }
}

function initNotifications() {
    // Créer un conteneur pour les notifications
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
}

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================
async function loadCommunicationData() {
    console.log('📡 Chargement des données de communication');
    
    try {
        // Simulation de chargement asynchrone
        await simulateLoading();
        
        // Charger les contacts
        await loadContacts();
        
        // Charger les conversations récentes
        await loadRecentConversations();
        
        // Mettre à jour les statistiques
        updateCommunicationStats();
        
        console.log('✅ Données de communication chargées avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        showError('Impossible de charger les données. Utilisation du mode démo.');
        loadDemoData();
    }
}

async function simulateLoading() {
    return new Promise(resolve => {
        setTimeout(resolve, 500);
    });
}

async function loadContacts() {
    // Simulation de chargement d'API
    const demoContacts = [
        {
            id: 1,
            name: "Aminata Sy",
            avatar: "AS",
            role: "Locataire - Appartement B12",
            lastMessage: "Demande attestation de loyer",
            time: "10:30",
            unread: 3,
            status: "online",
            type: "tenant",
            property: "Appartement B12, Ouaga 2000",
            lastContact: "2024-01-15T10:30:00"
        },
        {
            id: 2,
            name: "Ibrahim Traoré",
            avatar: "IT",
            role: "Locataire - Maison A5",
            lastMessage: "Problème fuite salle de bain",
            time: "Hier",
            unread: 0,
            status: "offline",
            type: "tenant",
            property: "Maison A5, Secteur 15",
            lastContact: "2024-01-14T15:45:00"
        },
        {
            id: 3,
            name: "Service Fiscal",
            avatar: "SF",
            role: "Direction Générale des Impôts",
            lastMessage: "Déclaration trimestrielle à compléter",
            time: "09:15",
            unread: 1,
            status: "online",
            type: "service",
            department: "Service des Impôts Locatifs",
            lastContact: "2024-01-15T09:15:00"
        },
        {
            id: 4,
            name: "Fatoumata Diallo",
            avatar: "FD",
            role: "Locataire - Studio C8",
            lastMessage: "Paiement janvier effectué",
            time: "11:45",
            unread: 0,
            status: "online",
            type: "tenant",
            property: "Studio C8, Zone du Bois",
            lastContact: "2024-01-15T11:45:00"
        }
    ];
    
    // Stocker les contacts dans le gestionnaire
    if (window.communicationManager) {
        window.communicationManager.contacts = demoContacts;
        window.communicationManager.initializeContacts();
    }
    
    // Mettre à jour le compteur de contacts
    updateContactCounter(demoContacts.length);
}

async function loadRecentConversations() {
    // Simulation de chargement des conversations récentes
    const recentConversations = [
        {
            contactId: 1,
            lastMessage: "Merci pour l'attestation !",
            timestamp: "2024-01-15T10:45:00"
        },
        {
            contactId: 3,
            lastMessage: "Formulaire reçu, merci.",
            timestamp: "2024-01-15T09:30:00"
        }
    ];
    
    // Ici, vous pourriez charger les dernières conversations depuis une API
    console.log(`📨 ${recentConversations.length} conversations récentes chargées`);
}

function updateCommunicationStats() {
    // Mettre à jour les statistiques affichées
    const statsElement = document.getElementById('communication-stats');
    if (statsElement) {
        const totalContacts = window.communicationManager?.contacts?.length || 0;
        const unreadCount = window.communicationManager?.contacts?.reduce((sum, contact) => sum + (contact.unread || 0), 0) || 0;
        const onlineCount = window.communicationManager?.contacts?.filter(c => c.status === 'online').length || 0;
        
        statsElement.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-users"></i>
                <span>${totalContacts} contacts</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-envelope"></i>
                <span>${unreadCount} non lus</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-circle"></i>
                <span>${onlineCount} en ligne</span>
            </div>
        `;
    }
}

function updateContactCounter(count) {
    const counterElement = document.getElementById('contact-counter');
    if (counterElement) {
        counterElement.textContent = `${count} contacts`;
    }
}

function loadDemoData() {
    // Charger des données de démonstration
    console.log('🔄 Chargement des données de démonstration');
    
    // Mettre à jour avec des données par défaut
    updateCommunicationStats();
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    const header = document.querySelector('.comm-header .container');
    if (header) {
        header.appendChild(errorElement);
        
        // Supprimer automatiquement après 5 secondes
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
}

// ============================================
// CONFIGURATION DES INTERACTIONS
// ============================================
function setupInteractions() {
    console.log('🔄 Configuration des interactions');
    
    // Gestionnaire de déconnexion
    setupLogoutHandler();
    
    // Gestionnaire de sélection de contact
    setupContactSelection();
    
    // Gestionnaire des actions du chat
    setupChatActions();
    
    // Gestionnaire des pièces jointes
    setupAttachmentHandler();
    
    // Gestionnaire des modèles de messages
    setupTemplatesHandler();
}

function setupLogoutHandler() {
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animation de déconnexion
            this.classList.add('logging-out');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                // Effacer les données d'authentification
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                
                // Rediriger vers la page de connexion
                window.location.href = '../index.html';
            }, 1000);
        });
    }
    
    // Ajouter un gestionnaire pour le bouton de déconnexion existant
    const oldLogoutBtn = document.querySelector('button[onclick*="logout"]');
    if (oldLogoutBtn) {
        oldLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function setupContactSelection() {
    // Utiliser la délégation d'événements pour les contacts
    document.addEventListener('click', function(e) {
        const contactItem = e.target.closest('.contact-item');
        if (contactItem) {
            const contactId = contactItem.dataset.id;
            if (contactId && window.communicationManager) {
                window.communicationManager.selectContactById(parseInt(contactId));
                
                // Ajouter une animation de sélection
                contactItem.classList.add('selected');
                setTimeout(() => {
                    contactItem.classList.remove('selected');
                }, 300);
            }
        }
    });
}

function setupChatActions() {
    // Boutons d'action dans l'en-tête du chat
    document.addEventListener('click', function(e) {
        const actionBtn = e.target.closest('.action-btn');
        if (actionBtn && window.communicationManager) {
            const action = actionBtn.dataset.action;
            window.communicationManager.handleChatAction(action);
        }
    });
}

function setupAttachmentHandler() {
    const attachmentBtn = document.querySelector('.attachment-btn');
    if (attachmentBtn) {
        attachmentBtn.addEventListener('click', function() {
            // Créer un input file caché
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt';
            
            fileInput.addEventListener('change', function(e) {
                const files = Array.from(e.target.files);
                if (files.length > 0 && window.communicationManager) {
                    files.forEach((file, index) => {
                        setTimeout(() => {
                            const size = (file.size / (1024 * 1024)).toFixed(2);
                            const message = `📎 ${file.name} (${size} MB)`;
                            window.communicationManager.addMessageToChat(message, 'sent');
                            
                            if (index === files.length - 1) {
                                window.communicationManager.showNotification(
                                    `${files.length} fichier(s) joint(s)`,
                                    'success'
                                );
                            }
                        }, index * 300);
                    });
                }
            });
            
            fileInput.click();
        });
    }
}

function setupTemplatesHandler() {
    const templatesBtn = document.querySelector('.templates-btn');
    if (!templatesBtn) {
        // Créer le bouton s'il n'existe pas
        const btn = document.createElement('button');
        btn.className = 'templates-btn';
        btn.innerHTML = '<i class="fas fa-layer-group"></i>';
        btn.title = 'Modèles de messages';
        
        const inputActions = document.querySelector('.input-actions');
        if (inputActions) {
            inputActions.appendChild(btn);
            
            btn.addEventListener('click', function() {
                showTemplatesModal();
            });
        }
    }
}

function showTemplatesModal() {
    const modal = document.createElement('div');
    modal.className = 'templates-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📝 Modèles de messages</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="template-category">
                    <h4>Gestion locative</h4>
                    <div class="template-item" data-template="rent_reminder">
                        <strong>Rappel de loyer</strong>
                        <p>Bonjour, je vous rappelle que le loyer du mois en cours est dû.</p>
                    </div>
                    <div class="template-item" data-template="visit_confirmation">
                        <strong>Confirmation de visite</strong>
                        <p>Je confirme notre rendez-vous pour la visite du bien.</p>
                    </div>
                </div>
                <div class="template-category">
                    <h4>Documents administratifs</h4>
                    <div class="template-item" data-template="rent_receipt">
                        <strong>Quittance de loyer</strong>
                        <p>Veuillez trouver ci-joint la quittance de loyer pour le mois.</p>
                    </div>
                    <div class="template-item" data-template="tax_certificate">
                        <strong>Attestation fiscale</strong>
                        <p>Je vous envoie l'attestation fiscale demandée.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Gérer la fermeture
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Gérer la sélection d'un modèle
    modal.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', function() {
            const template = this.dataset.template;
            insertTemplate(template);
            modal.remove();
        });
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

function insertTemplate(template) {
    const templates = {
        rent_reminder: "Bonjour, je vous rappelle que le loyer du mois en cours est dû. Le montant de [montant] FCFA doit être réglé avant le [date]. Merci.",
        visit_confirmation: "Je confirme notre rendez-vous pour la visite du bien le [date] à [heure]. Merci de votre ponctualité.",
        rent_receipt: "Veuillez trouver ci-joint la quittance de loyer pour le mois de [mois]. Bonne réception.",
        tax_certificate: "Je vous envoie l'attestation fiscale demandée pour l'année [année]. N'hésitez pas à me contacter pour toute information complémentaire."
    };
    
    const messageInput = document.getElementById('messageInput');
    if (messageInput && templates[template]) {
        messageInput.value = templates[template];
        messageInput.focus();
        messageInput.dispatchEvent(new Event('input'));
        
        if (window.communicationManager) {
            window.communicationManager.showNotification('Modèle inséré', 'success');
        }
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================
function sendMessage() {
    if (window.communicationManager) {
        window.communicationManager.sendMessage();
    } else {
        // Fallback si le gestionnaire n'est pas initialisé
        const messageInput = document.getElementById('messageInput');
        const message = messageInput?.value.trim();
        
        if (message) {
            // Simulation d'envoi
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                const messageElement = document.createElement('div');
                messageElement.className = 'message sent';
                messageElement.innerHTML = `
                    <div class="message-text">${message}</div>
                    <div class="message-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                `;
                
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                messageInput.value = '';
                messageInput.style.height = 'auto';
                
                // Simulation de réponse
                setTimeout(() => {
                    const responses = [
                        "Message reçu, merci.",
                        "Je prends note, merci.",
                        "D'accord, je vous recontacte rapidement.",
                        "Merci de l'information."
                    ];
                    
                    const response = responses[Math.floor(Math.random() * responses.length)];
                    const responseElement = document.createElement('div');
                    responseElement.className = 'message received';
                    responseElement.innerHTML = `
                        <div class="message-text">${response}</div>
                        <div class="message-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    `;
                    
                    chatMessages.appendChild(responseElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            }
        }
    }
}

function handleQuickAction(action) {
    if (window.communicationManager) {
        window.communicationManager.handleQuickAction(action);
    }
}

// ============================================
// GESTION DES ÉVÉNEMENTS GLOBAUX
// ============================================
// Réinitialiser l'application en cas d'erreur
window.addEventListener('error', function(e) {
    console.error('Erreur globale:', e.error);
    
    // Afficher une notification d'erreur
    const errorMsg = `Erreur: ${e.message}`;
    if (window.communicationManager) {
        window.communicationManager.showNotification(errorMsg, 'error');
    }
});

// Sauvegarder l'état avant de quitter
window.addEventListener('beforeunload', function(e) {
    // Ici, vous pourriez sauvegarder l'état des conversations
    console.log('💾 Sauvegarde de l\'état avant fermeture');
});

// ============================================
// STYLES DYNAMIQUES
// ============================================
// Ajouter des styles pour les nouveaux composants
const dynamicStyles = `
    .no-results-message {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--dark-gray);
        background: var(--light-color);
        border-radius: var(--border-radius);
        margin: 2rem;
        border: 1px solid var(--medium-gray);
    }
    
    .no-results-message i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--burkina-red);
        opacity: 0.5;
    }
    
    .no-results-message strong {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
    }
    
    .no-results-message p {
        color: var(--dark-gray);
        font-size: 0.9rem;
    }
    
    .search-clear-btn {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--dark-gray);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        transition: var(--transition-fast);
    }
    
    .search-clear-btn:hover {
        background: var(--medium-gray);
        color: var(--burkina-red);
    }
    
    .custom-tooltip {
        position: fixed;
        background: var(--dark-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius-sm);
        font-size: 0.8rem;
        z-index: 9999;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: var(--shadow-lg);
        animation: tooltipFadeIn 0.2s ease;
    }
    
    @keyframes tooltipFadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .contact-item.animate-in {
        animation: slideInRight 0.3s ease forwards;
        opacity: 0;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .contact-item.selected {
        animation: selectPulse 0.3s ease;
    }
    
    @keyframes selectPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .logout-btn.logging-out {
        pointer-events: none;
        opacity: 0.7;
    }
    
    .error-message {
        background: rgba(229, 62, 62, 0.1);
        border: 1px solid rgba(229, 62, 62, 0.2);
        color: var(--burkina-red);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-sm);
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInDown 0.3s ease;
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .communication-stats {
        display: flex;
        gap: 2rem;
        margin-top: 1.5rem;
        flex-wrap: wrap;
    }
    
    .stat-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: white;
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .stat-item i {
        color: var(--burkina-yellow);
    }
    
    .templates-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .templates-modal .modal-content {
        background: white;
        border-radius: var(--border-radius-lg);
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: var(--shadow-xl);
        animation: slideInUp 0.3s ease;
    }
    
    .modal-header {
        padding: 1.5rem;
        background: linear-gradient(135deg, var(--burkina-red), var(--burkina-green));
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h3 {
        margin: 0;
        font-size: 1.25rem;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: var(--transition-fast);
    }
    
    .close-modal:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .modal-body {
        padding: 1.5rem;
        max-height: 60vh;
        overflow-y: auto;
    }
    
    .template-category {
        margin-bottom: 2rem;
    }
    
    .template-category h4 {
        margin: 0 0 1rem 0;
        color: var(--primary-color);
        font-size: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--burkina-yellow);
    }
    
    .template-item {
        background: var(--light-color);
        border: 1px solid var(--medium-gray);
        border-radius: var(--border-radius-sm);
        padding: 1rem;
        margin-bottom: 0.75rem;
        cursor: pointer;
        transition: var(--transition-fast);
    }
    
    .template-item:hover {
        background: var(--light-gray);
        border-color: var(--burkina-red);
        transform: translateX(5px);
    }
    
    .template-item strong {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--dark-color);
    }
    
    .template-item p {
        margin: 0;
        color: var(--dark-gray);
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .notification-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 350px;
    }
`;

// Ajouter les styles dynamiques au document
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// ============================================
// EXPORT DES FONCTIONS POUR L'UTILISATION GLOBALE
// ============================================
window.Components = {
    initComponents,
    loadCommunicationData,
    sendMessage,
    handleQuickAction,
    showTemplatesModal,
    insertTemplate
};

console.log('✅ Script de communication chargé avec succès');