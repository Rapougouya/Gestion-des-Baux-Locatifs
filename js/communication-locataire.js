// Communication System Spécialisé pour LOCATAIRES PNSBIL

class CommunicationCenterLocataire {
    constructor() {
        this.contacts = [];
        this.currentChat = null;
        this.messages = [];
        this.userType = 'locataire';
        this.init();
    }

    init() {
        this.loadContacts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.setupQuickActions();
    }

    loadContacts() {
        // Contacts spécifiques aux locataires
        this.contacts = [
            {
                id: 1,
                name: "Mohamed Diallo",
                role: "Mon Propriétaire",
                property: "Appartement B12 - Dakar Plateau",
                lastMessage: "A confirmé réception du loyer",
                online: true,
                unread: 2,
                type: "proprietaire"
            },
            {
                id: 2,
                name: "Service Maintenance",
                role: "Support technique - Urgences",
                property: "Tous vos biens",
                lastMessage: "Votre demande #MT456 est en cours",
                online: true,
                unread: 0,
                type: "maintenance"
            },
            {
                id: 3,
                name: "Service Fiscal",
                role: "Attestations et documents",
                property: "Administration fiscale",
                lastMessage: "Attestation de loyer disponible",
                online: true,
                unread: 1,
                type: "fiscal"
            },
            {
                id: 4,
                name: "Syndic de l'immeuble",
                role: "Gestion des parties communes",
                property: "Immeuble Les Almadies",
                lastMessage: "Réunion copropriété le 15/12",
                online: false,
                unread: 0,
                type: "syndic"
            }
        ];

        this.renderContacts();
    }

    createContactElement(contact) {
        const div = document.createElement('div');
        div.className = `contact-item ${contact.online ? 'online' : ''} ${contact.type}`;
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
            </div>
        `;

        div.addEventListener('click', () => this.selectContact(contact));
        return div;
    }

    getAvatarForContact(contact) {
        const avatars = {
            'proprietaire': '👨‍💼',
            'maintenance': '⚙️',
            'fiscal': '💰',
            'syndic': '🏢'
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
    }

    loadChatHistory(contactId) {
        // Historiques de conversation spécifiques selon le type de contact
        const chatHistories = {
            1: [ // Propriétaire
                {
                    id: 1,
                    contactId: contactId,
                    text: "Bonjour, j'ai bien reçu votre paiement de loyer pour ce mois-ci. Merci de votre ponctualité.",
                    time: "10:15",
                    type: "received"
                },
                {
                    id: 2,
                    contactId: contactId,
                    text: "Bonjour, avec plaisir. Pourriez-vous m'envoyer l'attestation de loyer pour mes impôts ?",
                    time: "10:18",
                    type: "sent"
                },
                {
                    id: 3,
                    contactId: contactId,
                    text: "Bien sûr, je la génère et vous l'envoie dans l'après-midi. Avez-vous d'autres questions concernant l'appartement ?",
                    time: "10:30",
                    type: "received"
                }
            ],
            2: [ // Maintenance
                {
                    id: 1,
                    contactId: contactId,
                    text: "Votre demande de maintenance #MT456 a été prise en compte.",
                    time: "09:00",
                    type: "received"
                },
                {
                    id: 2,
                    contactId: contactId,
                    text: "Merci, le problème persiste dans la salle de bain.",
                    time: "09:15",
                    type: "sent"
                },
                {
                    id: 3,
                    contactId: contactId,
                    text: "Un technicien interviendra demain entre 14h et 16h.",
                    time: "09:30",
                    type: "received"
                }
            ],
            3: [ // Fiscal
                {
                    id: 1,
                    contactId: contactId,
                    text: "Votre attestation de loyer 2024 est disponible dans votre espace.",
                    time: "11:00",
                    type: "received"
                },
                {
                    id: 2,
                    contactId: contactId,
                    text: "Merci, je la télécharge immédiatement.",
                    time: "11:05",
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

    setupQuickActions() {
        // Ajouter les actions rapides spécifiques aux locataires
        const quickActionsHTML = `
            <div class="quick-actions-chat">
                <button class="quick-btn" onclick="communicationCenter.askForDocument()">📄 Demander un document</button>
                <button class="quick-btn" onclick="communicationCenter.reportMaintenance()">🔧 Signaler une panne</button>
                <button class="quick-btn" onclick="communicationCenter.askQuestion()">❓ Poser une question</button>
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
            'proprietaire': [
                { text: '📄 Demander un document', action: 'askForDocument' },
                { text: '🔧 Signaler une panne', action: 'reportMaintenance' },
                { text: '📅 Proposer une visite', action: 'scheduleVisit' }
            ],
            'maintenance': [
                { text: '🚨 Urgence maintenance', action: 'reportEmergency' },
                { text: '📷 Envoyer des photos', action: 'sendPhotos' },
                { text: '❓ Suivi intervention', action: 'checkStatus' }
            ],
            'fiscal': [
                { text: '📋 Demander attestation', action: 'requestCertificate' },
                { text: '❓ Question fiscale', action: 'askTaxQuestion' },
                { text: '📊 Comprendre mes impôts', action: 'understandTaxes' }
            ]
        };

        const actions = actionConfigs[contactType] || [];
        actionsContainer.innerHTML = actions.map(action => 
            `<button class="quick-btn" onclick="communicationCenter.${action.action}()">${action.text}</button>`
        ).join('');
    }

    // Actions spécifiques aux locataires
    askForDocument() {
        const documents = ['Attestation de loyer', 'Quittance de loyer', 'État des lieux', 'Contrat de location'];
        const selectedDoc = documents[Math.floor(Math.random() * documents.length)];
        this.sendAutoMessage(`Je souhaite recevoir ${selectedDoc.toLowerCase()} s'il vous plaît.`);
    }

    reportMaintenance() {
        const issues = ['Problème de plomberie', 'Panne électrique', 'Fuite d eau', 'Chaudière en panne'];
        const issue = issues[Math.floor(Math.random() * issues.length)];
        this.sendAutoMessage(`Je signale un problème : ${issue}. Pouvez-vous envoyer un technicien ?`);
    }

    askQuestion() {
        const questions = [
            "Pouvez-vous m'expliquer le fonctionnement du chauffage ?",
            "Quand est prévue la prochaine visite ?",
            "Puis-je recevoir un colis en mon absence ?"
        ];
        const question = questions[Math.floor(Math.random() * questions.length)];
        this.sendAutoMessage(question);
    }

    reportEmergency() {
        this.sendAutoMessage("🚨 URGENCE : J'ai un problème nécessitant une intervention immédiate !");
    }

    sendPhotos() {
        this.sendAutoMessage("📷 Je joins des photos du problème en pièce jointe.");
    }

    requestCertificate() {
        this.sendAutoMessage("Bonjour, je souhaite recevoir mon attestation de loyer pour déclaration fiscale.");
    }

    sendAutoMessage(text) {
        const input = document.getElementById('messageInput');
        input.value = text;
        this.sendMessage();
    }

    // Surcharge de la méthode d'envoi pour inclure des réponses contextuelles
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

        // Réponses contextuelles selon le type de contact
        setTimeout(() => this.simulateContextualReply(text), 1000 + Math.random() * 2000);

        input.value = '';
    }

    simulateContextualReply(userMessage) {
        if (!this.currentChat) return;

        const replyStrategies = {
            'proprietaire': () => this.getProprietaireReply(userMessage),
            'maintenance': () => this.getMaintenanceReply(userMessage),
            'fiscal': () => this.getFiscalReply(userMessage),
            'syndic': () => this.getSyndicReply(userMessage)
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

    getProprietaireReply(userMessage) {
        const replies = {
            'document': "Je vous envoie le document demandé dans la journée.",
            'panne': "Je contacte le service maintenance pour intervention.",
            'visite': "Proposons un rendez-vous la semaine prochaine.",
            'default': "Je prends note de votre message et reviens vers vous."
        };

        if (userMessage.toLowerCase().includes('document') || userMessage.toLowerCase().includes('attestation')) {
            return replies.document;
        } else if (userMessage.toLowerCase().includes('panne') || userMessage.toLowerCase().includes('problème')) {
            return replies.panne;
        } else if (userMessage.toLowerCase().includes('visite') || userMessage.toLowerCase().includes('rendez-vous')) {
            return replies.visite;
        }
        return replies.default;
    }

    getMaintenanceReply(userMessage) {
        return "Votre demande a été enregistrée. Un technicien vous contactera pour planifier l'intervention.";
    }

    getFiscalReply(userMessage) {
        return "Votre document est disponible dans votre espace personnel. Vous pouvez le télécharger dès maintenant.";
    }

    getSyndicReply(userMessage) {
        return "Merci pour votre message. L'information a été transmise au conseil syndical.";
    }

    getDefaultReply() {
        return "Merci pour votre message. Nous traitons votre demande dans les meilleurs délais.";
    }

    // Surcharge des autres méthodes existantes
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

        // Écouteurs pour les boutons d'action du header
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleHeaderAction(e.target.title));
        });
    }

    handleHeaderAction(action) {
        const actions = {
            'Voir le contrat': () => this.showContract(),
            'Signaler un problème': () => this.reportMaintenance(),
            'Informations propriétaire': () => this.showProprietaireInfo()
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    showContract() {
        alert('📑 Ouverture de votre contrat de location...');
        // En réalité, rediriger vers la page du contrat
    }

    showProprietaireInfo() {
        alert('👨‍💼 Informations du propriétaire : Mohamed Diallo\nTél: +221 77 123 45 67\nEmail: m.diallo@email.com');
    }

    getLastMessageTime() {
        const times = ['10:30', '09:15', 'Hier', '23/11'];
        return times[Math.floor(Math.random() * times.length)];
    }
}

// Initialisation pour locataires
let communicationCenter;

document.addEventListener('DOMContentLoaded', function() {
    communicationCenter = new CommunicationCenterLocataire();
});

function sendMessage() {
    if (communicationCenter) {
        communicationCenter.sendMessage();
    }
}