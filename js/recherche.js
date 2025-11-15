// Classes ES6 pour la gestion des propriétés
class PropertyManager {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.filters = {
            location: '',
            type: '',
            minPrice: '',
            maxPrice: '',
            rooms: '',
            sort: 'recent'
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProperties();
        this.updateResultsCount();
    }

    bindEvents() {
        // Filtres
        document.querySelectorAll('.filter-select, .range-input, .sort-select').forEach(element => {
            element.addEventListener('change', this.handleFilterChange.bind(this));
            element.addEventListener('input', this.debounce(this.handleFilterChange.bind(this), 300));
        });

        // Recherche
        document.getElementById('searchButton').addEventListener('click', this.handleSearch.bind(this));

        // Pagination
        document.getElementById('pagination').addEventListener('click', this.handlePagination.bind(this));

        // Formulaire de contact
        document.getElementById('contactForm').addEventListener('submit', this.handleContactSubmit.bind(this));

        // Actions des cartes (déléguation d'événements)
        document.getElementById('propertiesGrid').addEventListener('click', (e) => {
            const card = e.target.closest('.property-card');
            if (!card) return;

            const propertyId = card.dataset.propertyId;
            
            if (e.target.closest('[data-action="view"]')) {
                this.viewProperty(propertyId);
            }
            if (e.target.closest('[data-action="contact"]')) {
                this.contactOwner(propertyId);
            }
        });
    }

    async loadProperties() {
        try {
            this.showLoading();
            
            // Simulation de chargement depuis une API
            const response = await this.fetchProperties();
            this.properties = response;
            this.applyFilters();
            
        } catch (error) {
            console.error('Erreur lors du chargement des propriétés:', error);
            this.showError('Erreur de chargement des propriétés');
        }
    }

    async fetchProperties() {
        // Simulation d'une API - remplacer par un vrai endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        title: "Appartement moderne 3 pièces",
                        price: 350000,
                        location: "Ouagadougou Plateau, Rue 12",
                        surface: 85,
                        rooms: 3,
                        bathrooms: 2,
                        type: "appartement",
                        image: "../assets/images/property1.jpg",
                        badge: "new",
                        description: "Bel appartement lumineux avec vue sur la mer, entièrement rénové et proche de tous les commodités.",
                        features: ["Parking", "Ascenseur", "Balcon"]
                    },
                    {
                        id: 2,
                        title: "Villa spacieuse 5 pièces",
                        price: 1200000,
                        location: "Almadies, Corniche",
                        surface: 220,
                        rooms: 5,
                        bathrooms: 3,
                        type: "villa",
                        image: "../assets/images/property2.jpg",
                        badge: "popular",
                        description: "Magnifique villa avec jardin, piscine et garage. Quartier résidentiel calme et sécurisé.",
                        features: ["Piscine", "Jardin", "Garage", "Parking"]
                    },
                    {
                        id: 3,
                        title: "Studio fonctionnel",
                        price: 250000,
                        originalPrice: 275000,
                        location: "Point E, Avenue 10",
                        surface: 35,
                        rooms: 1,
                        bathrooms: 1,
                        type: "studio",
                        image: "../assets/images/property3.jpg",
                        badge: "discount",
                        description: "Studio entièrement meublé, proche des universités et des transports. Idéal pour étudiant ou jeune actif.",
                        features: ["Meublé", "Internet", "Proche transport"]
                    }
                ]);
            }, 1000);
        });
    }

    handleFilterChange(e) {
        const { name, value } = e.target;
        
        if (name === 'minPrice' || name === 'maxPrice') {
            this.filters[name] = value ? parseInt(value) : '';
        } else {
            this.filters[name] = value;
        }

        this.debounce(this.applyFilters.bind(this), 300)();
    }

    handleSearch() {
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            return (
                (!this.filters.location || property.location.toLowerCase().includes(this.filters.location.toLowerCase())) &&
                (!this.filters.type || property.type === this.filters.type) &&
                (!this.filters.minPrice || property.price >= this.filters.minPrice) &&
                (!this.filters.maxPrice || property.price <= this.filters.maxPrice) &&
                (!this.filters.rooms || property.rooms.toString() === this.filters.rooms)
            );
        });

        this.sortProperties();
        this.renderProperties();
        this.updateResultsCount();
        this.updatePagination();
    }

    sortProperties() {
        switch (this.filters.sort) {
            case 'price-asc':
                this.filteredProperties.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProperties.sort((a, b) => b.price - a.price);
                break;
            case 'surface':
                this.filteredProperties.sort((a, b) => b.surface - a.surface);
                break;
            default: // recent
                this.filteredProperties.sort((a, b) => b.id - a.id);
        }
    }

    renderProperties() {
        const grid = document.getElementById('propertiesGrid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentProperties = this.filteredProperties.slice(startIndex, endIndex);

        if (currentProperties.length === 0) {
            grid.innerHTML = this.createNoResultsMessage();
        } else {
            grid.innerHTML = currentProperties.map(property => this.createPropertyCard(property)).join('');
            
            // Animation d'entrée
            setTimeout(() => {
                document.querySelectorAll('.property-card').forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                });
            }, 50);
        }
    }

    createNoResultsMessage() {
        return `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search fa-3x"></i>
                </div>
                <h3>Aucun logement trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
                <button class="btn btn-primary" onclick="propertyManager.resetFilters()">
                    <i class="fas fa-refresh me-2"></i>Réinitialiser les filtres
                </button>
            </div>
        `;
    }

    createPropertyCard(property) {
        const badgeClass = {
            new: 'new',
            popular: 'popular',
            discount: 'discount'
        }[property.badge] || '';

        const badgeText = {
            new: 'Nouveau',
            popular: 'Populaire',
            discount: '-10%'
        }[property.badge] || '';

        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2Ugbm9uIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+'">
                    ${property.badge ? `<div class="property-badge ${badgeClass}">${badgeText}</div>` : ''}
                </div>
                <div class="property-content">
                    <div class="property-header">
                        <h3>${property.title}</h3>
                        <div class="property-price">
                            ${property.originalPrice ? `
                                <span class="original-price">${this.formatPrice(property.originalPrice)}</span>
                                <span class="discount-price">${this.formatPrice(property.price)}</span>
                            ` : this.formatPrice(property.price)}
                        </div>
                    </div>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.location}
                    </div>
                    <div class="property-features">
                        <span><i class="fas fa-ruler-combined"></i> ${property.surface}m²</span>
                        <span><i class="fas fa-bed"></i> ${property.rooms} pièce${property.rooms > 1 ? 's' : ''}</span>
                        <span><i class="fas fa-bath"></i> ${property.bathrooms} salle${property.bathrooms > 1 ? 's' : ''} de bain</span>
                    </div>
                    <div class="property-description">
                        ${property.description}
                    </div>
                    <div class="property-actions">
                        <button class="btn btn-outline" data-action="view">
                            <i class="fas fa-eye me-1"></i> Voir détails
                        </button>
                        <button class="btn btn-primary" data-action="contact">
                            <i class="fas fa-envelope me-1"></i> Contacter
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    handlePagination(e) {
        const button = e.target.closest('.page-btn');
        if (!button || button.classList.contains('disabled') || button.classList.contains('active')) return;

        const currentActive = document.querySelector('.page-btn.active');
        if (currentActive) currentActive.classList.remove('active');

        if (button.querySelector('.fa-chevron-left')) {
            this.currentPage = Math.max(1, this.currentPage - 1);
        } else if (button.querySelector('.fa-chevron-right')) {
            this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
        } else {
            this.currentPage = parseInt(button.textContent);
        }

        this.renderProperties();
        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (this.totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';

        const prevButton = pagination.querySelector('.page-btn:first-child');
        const nextButton = pagination.querySelector('.page-btn:last-child');
        const numberButtons = pagination.querySelectorAll('.page-btn:not(:first-child):not(:last-child)');

        // Gérer les boutons précédent/suivant
        prevButton.classList.toggle('disabled', this.currentPage === 1);
        nextButton.classList.toggle('disabled', this.currentPage === this.totalPages);

        // Mettre à jour les numéros de page
        numberButtons.forEach((btn, index) => {
            const pageNum = index + 1;
            if (pageNum <= this.totalPages) {
                btn.textContent = pageNum;
                btn.classList.toggle('active', pageNum === this.currentPage);
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        if (this.filteredProperties.length === 0) {
            countElement.textContent = 'Aucun logement trouvé';
        } else {
            countElement.textContent = `${this.filteredProperties.length} logement${this.filteredProperties.length > 1 ? 's' : ''} disponible${this.filteredProperties.length > 1 ? 's' : ''}`;
        }
    }

    viewProperty(propertyId) {
        const property = this.properties.find(p => p.id == propertyId);
        if (property) {
            // Redirection vers la page de détails
            this.showNotification(`Redirection vers les détails de "${property.title}"`, 'info');
            // window.location.href = `property-details.html?id=${propertyId}`;
        }
    }

    contactOwner(propertyId) {
        const property = this.properties.find(p => p.id == propertyId);
        if (property) {
            this.openContactModal(property);
        }
    }

    openContactModal(property) {
        const modal = document.getElementById('contactModal');
        const titleElement = document.getElementById('propertyTitle');
        
        titleElement.textContent = `Pour le bien: ${property.title}`;
        modal.style.display = 'flex';
        
        // Stocker l'ID de la propriété pour le formulaire
        modal.dataset.propertyId = property.id;
    }

    handleContactSubmit(e) {
        e.preventDefault();
        
        const modal = document.getElementById('contactModal');
        const propertyId = modal.dataset.propertyId;
        const message = document.getElementById('contactMessage').value;
        
        this.sendContactMessage(propertyId, message);
        modal.style.display = 'none';
        document.getElementById('contactForm').reset();
    }

    async sendContactMessage(propertyId, message) {
        try {
            // Simulation d'envoi de message
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Message envoyé avec succès! Le propriétaire vous contactera bientôt.', 'success');
        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi du message', 'error');
        }
    }

    resetFilters() {
        // Réinitialiser tous les filtres
        this.filters = {
            location: '',
            type: '',
            minPrice: '',
            maxPrice: '',
            rooms: '',
            sort: 'recent'
        };

        // Réinitialiser les champs du formulaire
        document.getElementById('location').value = '';
        document.getElementById('type').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('rooms').value = '';
        document.getElementById('sortSelect').value = 'recent';

        this.currentPage = 1;
        this.applyFilters();
    }

    showLoading() {
        const grid = document.getElementById('propertiesGrid');
        grid.innerHTML = Array(3).fill(0).map(() => `
            <div class="property-card loading">
                <div class="property-image skeleton"></div>
                <div class="property-content">
                    <div class="skeleton" style="height: 24px; width: 70%; margin-bottom: 10px;"></div>
                    <div class="skeleton" style="height: 20px; width: 50%; margin-bottom: 15px;"></div>
                    <div class="skeleton" style="height: 16px; margin-bottom: 8px;"></div>
                    <div class="skeleton" style="height: 16px; width: 80%;"></div>
                </div>
            </div>
        `).join('');
    }

    showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        document.querySelectorAll('.notification').forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(price);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialisation globale
let propertyManager;

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du gestionnaire de propriétés
    propertyManager = new PropertyManager();
});

// Rendre disponible globalement pour les fonctions inline
window.propertyManager = propertyManager;