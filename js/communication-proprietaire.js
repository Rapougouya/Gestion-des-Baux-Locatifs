// Communication System Spécialisé pour PROPRIÉTAIRES PNSBIL

class CommunicationCenterProprietaire {
    constructor() {
        this.contacts = [];
        this.currentChat = null;
        this.messages = [];
        this.userType = 'proprietaire';
        this.init();
    }

    init() {
        this.loadContacts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.setupQuickActions();
    }

    loadContacts() {
        // Contacts groupés pour propriétaires
        this.contacts = [
            // Locataires actuels
            {
                id: 1,
                name: "Aminata Sy",
                role: "Locataire - Appartement B12",
                property: "Loyer: ₣ 450,000/mois - Contrat jusqu'au 31/12/2024",
                lastMessage: "Demande attestation de loyer",
                online: true,
                unread: 3,
                type: "locataire",
                status: "active",
                paymentStatus: "paid"
            },
            {
                id: 2,
                name: "Jean Dupont",
                role: "Locataire - Villa 45",
                property: "Loyer: ₣ 1,200,000/mois - Contrat jusqu'au 31/01/2025",
                lastMessage: "Paiement reçu",
                online: false,
                unread: 0,
                type: "locataire",
                status: "active",
                paymentStatus: "paid"
            },
            // Services
            {
                id: 3,
                name: "Service Fiscal",
                role: "Déclaration et perception impôts",
                property: "Administration fiscale nationale",
                lastMessage: "Échéance déclaration 31/12",
                online: true,
                unread: 1,
                type: "fiscal"
            },
            {
                id: 4,
                name: "Service Maintenance",
                role: "Interventions et réparations",
                property: "Partenaires agréés",
                lastMessage: "Rapport d'intervention disponible",
                online: true,
                unread: 0,
                type: "maintenance"
            },
            // Anciens locataires
            {
                id: 5,
                name: "Mariam Sow",
                role: "Ancienne locataire - Studio C5",
                property: "Solde tout réglé - Dernier loyer: ₣ 250,000",
                lastMessage: "Solde tout réglé",
                online: false,
                unread: 0,
                type: "ancien_locataire",
                status: "inactive"
            }
        ];

        this.renderContacts();
    }

    createContactElement(contact) {
        const div = document.createElement('div');
        div.className = `contact-item ${contact.online ? 'online' : ''} ${contact.type} ${contact.status || ''}`;
        div.innerHTML = `
            <div class="contact-avatar">${this.getAvatarForContact(contact)}</div>
            <div class="status-indicator ${contact.online ? 'online' : 'offline'}"></div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-role">${contact.role}</div>
                <div class="contact-property">${contact.property}</div>
                <div class="contact-lastmsg">${contact.lastMessage}</div>
            </div>
            <div class="contact-meta">
                <div class="contact-time">${this.getLastMessageTime()}</div>
                ${contact.unread > 0 ? `<div class="unread-badge">${contact.unread}</div>` : ''}
                ${contact.paymentStatus ? `<div class="payment-status ${contact.paymentStatus}">${contact.paymentStatus === 'paid' ? 'Payé' : 'En attente'}</div>` : ''}
            </div>
        `;

        div.addEventListener('click', () => this.selectContact(contact));
        return div;
    }

    getAvatarForContact(contact) {
        const avatars = {
            'locataire': '👤',
            'ancien_locataire': '👤',
            'maintenance': '⚙️',
            'fiscal': '💰'
        };
        return avatars[contact.type] || '👤';
    }

    selectContact(contact) {
        this.currentChat = contact;
        
        document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        this.loadChatHistory(contact.id);
        this.updateChatHeader(contact);
        this.updateQuickActions(contact.type);
        this.updateHeaderActions(contact);
    }

    loadChatHistory(contactId) {
        const chatHistories = {
            1: [ // Aminata Sy - Locataire
                {
                    id: 1,
                    contactId: contactId,
                    text: "Bonjour Monsieur Diallo, pourriez-vous m'envoyer l'attestation de loyer pour mes impôts s'il vous plaît ?",
                    time: "10:15",
                    type: "received"
                },
                {
                    id: 2,
                    contactId: contactId,
                    text: "Bonjour Aminata, bien sûr. Je la génère et vous l'envoie dans l'après-midi.",
                    time: "10:18",
                    type: "sent"
                },
                {
                    id: 3,
                    contactId: contactId,
                    text: "Merci beaucoup ! Aussi, la chaudière fait un bruit étrange depuis ce matin.",
                    time: "10:30",
                    type: "received"
                }
            ],
            2: [ // Jean Dupont
                {
                    id: 1,
                    contactId: contactId,
                    text: "Bonjour, j'ai effectué le virement pour le loyer de ce mois.",
                    time: "05/12",
                    type: "received"
                },
                {
                    id: 2,
                    contactId: contactId,
                    text: "Parfait, je confirme la réception. Merci pour votre ponctualité.",
                    time: "05/12",
                    type: "sent"
                }
            ],
            3: [ // Service Fiscal
                {
                    id: 1,
                    contactId: contactId,
                    text: "Rappel : Déclaration des loyers 2024 à effectuer avant le 31/12/2024",
                    time: "01/12",
                    type: "received"
                },
                {
                    id: 2,
                    contactId: contactId,
                    text: "Merci, je prépare les documents nécessaires.",
                    time: "01/12",
                    type: "sent"
                }
            ]
        };

        this.messages = chatHistories[contactId] || [];
        this.renderMessages();
    }

    updateChatHeader(contact) {
        const header = document.querySelector('.chat-header');
        if (header) {
            header.querySelector('.chat-avatar').textContent = this.getAvatarForContact(contact);
            header.querySelector('h3').textContent = contact.name;
            header.querySelector('.chat-status').textContent = `${contact.online ? 'En ligne' : 'Hors ligne'} • ${contact.role}`;
            
            const contextElement = header.querySelector('.chat-context') || document.createElement('div');
            contextElement.className = 'chat-context';
            contextElement.textContent = contact.property;
            
            if (!header.querySelector('.chat-context')) {
                header.querySelector('.chat-header-info').appendChild(contextElement);
            }
        }
    }

    updateHeaderActions(contact) {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => btn.style.display = 'block');

        // Masquer certaines actions pour les anciens locataires
        if (contact.type === 'ancien_locataire') {
            actionButtons[0].style.display = 'none'; // Voir contrat
            actionButtons[1].style.display = 'none'; // Historique paiements
        }
    }

    setupQuickActions() {
        const quickActionsHTML = `
            <div class="quick-actions-chat">
                <button class="quick-btn" onclick="communicationCenter.sendRentReceipt()">🧾 Envoyer quittance</button>
                <button class="quick-btn" onclick="communicationCenter.sendTaxCertificate()">📄 Envoyer attestation fiscale</button>
                <button class="quick-btn" onclick="communicationCenter.scheduleVisit()">📅 Planifier une visite</button>
            </div>
        `;
        
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer && !messagesContainer.querySelector('.quick-actions-chat')) {
            messagesContainer.insertAdjacentHTML('beforeend', quickActionsHTML);
        }
    }

    updateQuickActions(contactType) {
        const actionsContainer = document.querySelector('.quick-actions-chat');
        if (!actionsContainer) return;

        const actionConfigs = {
            'locataire': [
                { text: '🧾 Envoyer quittance', action: 'sendRentReceipt' },
                { text: '📄 Attestation fiscale', action: 'sendTaxCertificate' },
                { text: '📅 Planifier visite', action: 'scheduleVisit' },
                { text: '📋 Renouvellement bail', action: 'renewContract' }
            ],
            'fiscal': [
                { text: '📊 Déclarer loyers', action: 'declareRents' },
                { text: '📋 Documents fiscaux', action: 'taxDocuments' },
                { text: '❓ Aide déclaration', action: 'taxHelp' }
            ],
            'maintenance': [
                { text: '🔧 Demander intervention', action: 'requestIntervention' },
                { text: '💰 Devis réparation', action: 'requestQuote' },
                { text: '📋 Rapport entretien', action: 'maintenanceReport' }
            ],
            'ancien_locataire': [
                { text: '📋 Solde des comptes', action: 'checkBalance' },
                { text: '📄 Attestation fin bail', action: 'endLeaseCertificate' }
            ]
        };

        const actions = actionConfigs[contactType] || [];
        actionsContainer.innerHTML = actions.map(action => 
            `<button class="quick-btn" onclick="communicationCenter.${action.action}()">${action.text}</button>`
        ).join('');
    }

    // Actions spécifiques aux propriétaires
    sendRentReceipt() {
        this.sendAutoMessage("Je vous envoie la quittance de loyer par email. Bonne réception.");
    }

    sendTaxCertificate() {
        this.sendAutoMessage("Votre attestation fiscale est disponible dans votre espace locataire.");
    }

    scheduleVisit() {
        this.sendAutoMessage("Proposons-nous une visite de contrôle la semaine prochaine ? Quels jours vous conviennent ?");
    }

    renewContract() {
        this.sendAutoMessage("Souhaitez-vous renouveler votre bail pour l'année prochaine ?");
    }

    declareRents() {
        this.sendAutoMessage("Bonjour, je souhaite déclarer mes loyers perçus cette année.");
    }

    requestIntervention() {
        this.sendAutoMessage("Bonjour, je souhaite programmer une intervention de maintenance.");
    }

    sendAutoMessage(text) {
        const input = document.getElementById('messageInput');
        input.value = text;
        this.sendMessage();
    }

    // Surcharge de la méthode d'envoi avec réponses contextuelles propriétaires
    sendMessage() {
        const input = document.getElementById('messageInput');
        const text = input.value.trim();

        if (!text || !this.currentChat) return;

        const newMessage = {
            id: this.messages.length + 1,
            contactId: this.currentChat.id,
            text: text,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            type: 'sent'
        };

        this.messages.push(newMessage);
        this.renderMessages();

        setTimeout(() => this.simulateContextualReply(text), 1000 + Math.random() * 2000);

        input.value = '';
    }

    simulateContextualReply(userMessage) {
        if (!this.currentChat) return;

        const replyStrategies = {
            'locataire': () => this.getLocataireReply(userMessage),
            'fiscal': () => this.getFiscalReply(userMessage),
            'maintenance': () => this.getMaintenanceReply(userMessage),
            'ancien_locataire': () => this.getAncienLocataireReply(userMessage)
        };

        const replyFunction = replyStrategies[this.currentChat.type] || this.getDefaultReply;
        const reply = replyFunction.call(this, userMessage);

        const replyMessage = {
            id: this.messages.length + 1,
            contactId: this.currentChat.id,
            text: reply,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            type: 'received'
        };

        this.messages.push(replyMessage);
        this.renderMessages();
    }

    getLocataireReply(userMessage) {
        if (userMessage.toLowerCase().includes('quittance')) {
            return "Merci, je la consulte dès réception.";
        } else if (userMessage.toLowerCase().includes('attestation') || userMessage.toLowerCase().includes('fiscale')) {
            return "Parfait, c'est pour ma déclaration d'impôts.";
        } else if (userMessage.toLowerCase().includes('visite')) {
            return "Je suis disponible mercredi ou vendredi après-midi.";
        } else if (userMessage.toLowerCase().includes('renouveler') || userMessage.toLowerCase().includes('bail')) {
            return "Oui, je souhaite renouveler pour une année supplémentaire.";
        }
        return "Merci pour votre message, je prends note.";
    }

    getFiscalReply(userMessage) {
        return "Votre déclaration a été enregistrée. Vous recevrez l'avis d'imposition sous 15 jours.";
    }

    getMaintenanceReply(userMessage) {
        return "Votre demande d'intervention est programmée. Un technicien vous contactera pour confirmation.";
    }

    getAncienLocataireReply(userMessage) {
        return "Merci, tous les comptes sont soldés. Bonne continuation.";
    }

    getDefaultReply() {
        return "Message reçu. Nous traitons votre demande.";
    }

    // Gestion des groupes de contacts dans la recherche
    searchContacts(query) {
        const filteredContacts = this.contacts.filter(contact =>
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            contact.role.toLowerCase().includes(query.toLowerCase()) ||
            contact.property.toLowerCase().includes(query.toLowerCase())
        );

        const contactsContainer = document.querySelector('.contacts-list');
        const existingGroups = contactsContainer.querySelectorAll('.contact-group');
        existingGroups.forEach(group => group.remove());

        this.renderGroupedContacts(filteredContacts);
    }

    renderGroupedContacts(contacts) {
        const contactsContainer = document.querySelector('.contacts-list');
        const searchBox = contactsContainer.querySelector('.search-box');
        
        // Vider le conteneur sauf la barre de recherche
        contactsContainer.innerHTML = '';
        contactsContainer.appendChild(searchBox);

        // Grouper les contacts par type
        const groups = {
            'Locataires Actuels': contacts.filter(c => c.type === 'locataire' && c.status === 'active'),
            'Services': contacts.filter(c => ['fiscal', 'maintenance'].includes(c.type)),
            'Anciens Locataires': contacts.filter(c => c.type === 'ancien_locataire')
        };

        Object.entries(groups).forEach(([groupName, groupContacts]) => {
            if (groupContacts.length > 0) {
                const groupElement = document.createElement('div');
                groupElement.className = 'contact-group';
                groupElement.innerHTML = `<div class="group-header">${groupName}</div>`;
                
                groupContacts.forEach(contact => {
                    const contactElement = this.createContactElement(contact);
                    groupElement.appendChild(contactElement);
                });
                
                contactsContainer.appendChild(groupElement);
            }
        });
    }

    renderContacts() {
        const contactsContainer = document.querySelector('.contacts-list');
        if (!contactsContainer) return;

        // Supprimer les anciens contacts mais garder la barre de recherche
        const searchBox = contactsContainer.querySelector('.search-box');
        contactsContainer.innerHTML = '';
        if (searchBox) contactsContainer.appendChild(searchBox);

        this.renderGroupedContacts(this.contacts);
    }

    getLastMessageTime() {
        const times = ['10:30', 'Hier', '05/12', '01/12'];
        return times[Math.floor(Math.random() * times.length)];
    }

    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.querySelector('.send-btn');

        if (messageInput && sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
            
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        const searchInput = document.getElementById('contactSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchContacts(e.target.value));
        }

        // Actions du header
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleHeaderAction(e.target.title));
        });
    }

    handleHeaderAction(action) {
        const actions = {
            'Voir le contrat': () => this.showContract(),
            'Historique paiements': () => this.showPayments(),
            'Fiche locataire': () => this.showTenantInfo()
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    showContract() {
        alert('📑 Ouverture du contrat de location...');
    }

    showPayments() {
        alert('💰 Affichage de l historique des paiements...');
    }

    showTenantInfo() {
        alert('📋 Fiche locataire :\n• Garanties déposées\n• Références\n• Historique location');
    }
}

// Initialisation pour propriétaires
let communicationCenter;

document.addEventListener('DOMContentLoaded', function() {
    communicationCenter = new CommunicationCenterProprietaire();
});

function sendMessage() {
    if (communicationCenter) {
        communicationCenter.sendMessage();
    }
}