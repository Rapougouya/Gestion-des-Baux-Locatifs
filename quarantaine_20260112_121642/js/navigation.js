// Navigation et routing pour PNSBIL

class NavigationManager {
    constructor() {
        this.currentPage = '';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.updateActiveNav();
    }

    setupNavigation() {
        // Gestion des liens de navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');
                this.navigateTo(link.href);
            }
        });

        // Gestion du bouton retour
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.pathname);
        });
    }

    navigateTo(url) {
        history.pushState(null, '', url);
        this.loadPage(url);
    }

    loadPage(url) {
        // Simulation de chargement de page
        console.log('Navigation vers:', url);
        // En réalité, on chargerait le contenu via AJAX
        // Pour la maquette, on laisse les redirections normales
    }

    updateActiveNav() {
        // Met à jour la navigation active basée sur l'URL courante
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.href === window.location.href) {
                link.classList.add('active');
            }
        });
    }

    // Simulation de chargement de données
    async simulateAPIcall(endpoint, mockData) {
        console.log(`API Call: ${endpoint}`);
        
        // Simulation de délai réseau
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        return {
            success: true,
            data: mockData,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialisation
const navigation = new NavigationManager();

// Données simulées pour la démonstration
const mockData = {
    proprietaires: {
        properties: [
            { id: 1, name: 'Appartement B12', type: 'Appartement', location: 'Ouagadougou', loyer: 450000, status: 'Occupé' },
            { id: 2, name: 'Villa 45', type: 'Villa', location: 'Almadies', loyer: 1200000, status: 'Occupé' },
            { id: 3, name: 'Studio C5', type: 'Studio', location: 'Point E', loyer: 250000, status: 'Vacant' }
        ],
        baux: [
            { id: 1, property: 'Appartement B12', locataire: 'Aminata Sy', debut: '2024-01-01', fin: '2024-12-31', loyer: 450000 },
            { id: 2, property: 'Villa 45', locataire: 'Jean Dupont', debut: '2024-02-01', fin: '2025-01-31', loyer: 1200000 }
        ]
    },
    locataires: {
        contrats: [
            { id: 1, property: 'Appartement B12', proprietaire: 'Mohamed Diallo', loyer: 450000, prochainPaiement: '2024-12-01' }
        ]
    }
    // ... autres données simulées pour chaque type d'utilisateur
};

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager, mockData };
}
