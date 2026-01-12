// Classe principale pour la gestion des utilisateurs
class UserManager {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.selectedUsers = new Set();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            search: '',
            type: '',
            status: ''
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUsers();
        this.updateMetrics();
    }

    bindEvents() {
        // Recherche avec debounce
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', this.debounce(() => {
            this.filters.search = searchInput.value;
            this.applyFilters();
        }, 300));

        // Filtres
        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filters.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.applyFilters();
        });

        // Bouton de filtrage
        document.getElementById('filterButton').addEventListener('click', () => {
            this.applyFilters();
        });

        // Réinitialisation des filtres
        document.getElementById('resetFilters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Sélection globale
        document.getElementById('selectAll').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Actions groupées
        document.getElementById('bulkActionSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                this.applyBulkAction(e.target.value);
                e.target.value = '';
            }
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.nextPage();
        });

        // Formulaire d'ajout
        document.getElementById('addUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });

        // Modal de confirmation
        document.getElementById('confirmCancel').addEventListener('click', () => {
            this.closeConfirmModal();
        });

        document.getElementById('confirmOk').addEventListener('click', () => {
            this.executeConfirmedAction();
        });
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

    async loadUsers() {
        this.showLoading();
        
        try {
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Données de démonstration
            this.users = [
                {
                    id: 1,
                    name: 'Mohamed Diallo',
                    email: 'm.diallo@email.com',
                    phone: '+226 77 123 45 67',
                    type: 'proprietaire',
                    status: 'active',
                    registrationDate: '2023-01-15',
                    lastLogin: '2024-01-10',
                    avatar: 'MD'
                },
                {
                    id: 2,
                    name: 'Aminata Sy',
                    email: 'a.sy@email.com',
                    phone: '+226 76 234 56 78',
                    type: 'locataire',
                    status: 'active',
                    registrationDate: '2024-03-22',
                    lastLogin: '2024-01-15',
                    avatar: 'AS'
                },
                {
                    id: 3,
                    name: 'Agent Municipal',
                    email: 'agent.municipal@gouv.sn',
                    phone: '+226 33 889 45 12',
                    type: 'agent',
                    status: 'inactive',
                    registrationDate: '2023-06-10',
                    lastLogin: '2023-12-01',
                    avatar: 'AM'
                },
                {
                    id: 4,
                    name: 'Admin System',
                    email: 'admin@pnsbil.sn',
                    phone: '+226 70 111 22 33',
                    type: 'admin',
                    status: 'active',
                    registrationDate: '2023-01-01',
                    lastLogin: '2024-01-20',
                    avatar: 'AD'
                },
                {
                    id: 5,
                    name: 'Kader Traoré',
                    email: 'k.traore@email.com',
                    phone: '+226 79 345 67 89',
                    type: 'proprietaire',
                    status: 'suspended',
                    registrationDate: '2023-08-15',
                    lastLogin: '2023-12-20',
                    avatar: 'KT'
                }
            ];
            
            this.filteredUsers = [...this.users];
            this.renderUsers();
            this.updateMetrics();
            
        } catch (error) {
            this.showError('Erreur lors du chargement des utilisateurs: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    renderUsers() {
        const tbody = document.getElementById('usersTableBody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const usersToShow = this.filteredUsers.slice(startIndex, endIndex);

        if (usersToShow.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();

        tbody.innerHTML = usersToShow.map(user => `
            <tr data-user-id="${user.id}">
                <td class="checkbox-column">
                    <input type="checkbox" class="user-checkbox" 
                           ${this.selectedUsers.has(user.id) ? 'checked' : ''}
                           onchange="userManager.toggleUserSelection(${user.id})">
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${user.avatar}</div>
                        <div class="user-details">
                            <div class="user-name">${user.name}</div>
                            <div class="user-id">ID: USR-${user.id.toString().padStart(6, '0')}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="user-type ${user.type}">${this.getTypeLabel(user.type)}</span>
                </td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${this.formatDate(user.registrationDate)}</td>
                <td>
                    <span class="status-badge ${user.status}">${this.getStatusLabel(user.status)}</span>
                </td>
                <td class="actions-column">
                    <div class="action-buttons">
                        <button class="btn-icon" title="Voir profil" onclick="userManager.viewUserProfile(${user.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" title="Modifier" onclick="userManager.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${user.status === 'active' ? `
                            <button class="btn-icon" title="Suspendre" onclick="userManager.suspendUser(${user.id})">
                                <i class="fas fa-pause"></i>
                            </button>
                        ` : `
                            <button class="btn-icon" title="Réactiver" onclick="userManager.activateUser(${user.id})">
                                <i class="fas fa-play"></i>
                            </button>
                        `}
                        <button class="btn-icon danger" title="Supprimer" onclick="userManager.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updatePagination();
        this.updateBulkActions();
    }

    applyFilters() {
        this.filteredUsers = this.users.filter(user => {
            const matchesSearch = !this.filters.search || 
                user.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                user.phone.includes(this.filters.search);
            
            const matchesType = !this.filters.type || user.type === this.filters.type;
            const matchesStatus = !this.filters.status || user.status === this.filters.status;
            
            return matchesSearch && matchesType && matchesStatus;
        });

        this.currentPage = 1;
        this.selectedUsers.clear();
        this.renderUsers();
    }

    resetFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('statusFilter').value = '';
        
        this.filters = {
            search: '',
            type: '',
            status: ''
        };
        
        this.applyFilters();
    }

    toggleSelectAll(checked) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPageUsers = this.filteredUsers.slice(startIndex, endIndex);

        currentPageUsers.forEach(user => {
            if (checked) {
                this.selectedUsers.add(user.id);
            } else {
                this.selectedUsers.delete(user.id);
            }
        });

        this.renderUsers();
    }

    toggleUserSelection(userId) {
        if (this.selectedUsers.has(userId)) {
            this.selectedUsers.delete(userId);
        } else {
            this.selectedUsers.add(userId);
        }
        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulkActions');
        const selectedCount = document.getElementById('selectedCount');
        const hasSelection = this.selectedUsers.size > 0;
        
        selectedCount.textContent = `${this.selectedUsers.size} utilisateur(s) sélectionné(s)`;
        
        if (hasSelection) {
            bulkActions.classList.add('active');
        } else {
            bulkActions.classList.remove('active');
        }
    }

    async applyBulkAction(action) {
        if (this.selectedUsers.size === 0) {
            this.showWarning('Veuillez sélectionner au moins un utilisateur');
            return;
        }

        const actions = {
            activate: () => this.bulkActivateUsers(),
            suspend: () => this.bulkSuspendUsers(),
            export: () => this.exportSelectedUsers(),
            delete: () => this.bulkDeleteUsers()
        };

        if (actions[action]) {
            await actions[action]();
        }
    }

    async bulkActivateUsers() {
        const confirmed = await this.showConfirmation(
            `Activer ${this.selectedUsers.size} utilisateur(s) ?`,
            'Cette action rendra les utilisateurs sélectionnés actifs sur la plateforme.'
        );

        if (confirmed) {
            this.showLoading();
            try {
                // Simulation d'appel API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.users.forEach(user => {
                    if (this.selectedUsers.has(user.id)) {
                        user.status = 'active';
                    }
                });
                
                this.showSuccess(`${this.selectedUsers.size} utilisateur(s) activé(s) avec succès`);
                this.selectedUsers.clear();
                this.applyFilters();
            } catch (error) {
                this.showError('Erreur lors de l\'activation des utilisateurs');
            } finally {
                this.hideLoading();
            }
        }
    }

    async bulkSuspendUsers() {
        const confirmed = await this.showConfirmation(
            `Suspendre ${this.selectedUsers.size} utilisateur(s) ?`,
            'Les utilisateurs suspendus ne pourront plus accéder à la plateforme.'
        );

        if (confirmed) {
            this.showLoading();
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.users.forEach(user => {
                    if (this.selectedUsers.has(user.id)) {
                        user.status = 'suspended';
                    }
                });
                
                this.showSuccess(`${this.selectedUsers.size} utilisateur(s) suspendu(s) avec succès`);
                this.selectedUsers.clear();
                this.applyFilters();
            } catch (error) {
                this.showError('Erreur lors de la suspension des utilisateurs');
            } finally {
                this.hideLoading();
            }
        }
    }

    async bulkDeleteUsers() {
        const confirmed = await this.showConfirmation(
            `Supprimer ${this.selectedUsers.size} utilisateur(s) ?`,
            'Cette action est irréversible. Toutes les données des utilisateurs seront définitivement supprimées.',
            true
        );

        if (confirmed) {
            this.showLoading();
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.users = this.users.filter(user => !this.selectedUsers.has(user.id));
                
                this.showSuccess(`${this.selectedUsers.size} utilisateur(s) supprimé(s) avec succès`);
                this.selectedUsers.clear();
                this.applyFilters();
            } catch (error) {
                this.showError('Erreur lors de la suppression des utilisateurs');
            } finally {
                this.hideLoading();
            }
        }
    }

    exportSelectedUsers() {
        if (this.selectedUsers.size === 0) {
            this.showWarning('Veuillez sélectionner au moins un utilisateur à exporter');
            return;
        }

        const usersToExport = this.users.filter(user => this.selectedUsers.has(user.id));
        const csv = this.convertToCSV(usersToExport);
        this.downloadCSV(csv, `utilisateurs_${this.formatDate(new Date())}.csv`);
        this.showSuccess('Export terminé avec succès');
    }

    exportUsers() {
        const csv = this.convertToCSV(this.filteredUsers);
        this.downloadCSV(csv, `utilisateurs_complet_${this.formatDate(new Date())}.csv`);
        this.showSuccess('Export de tous les utilisateurs terminé');
    }

    convertToCSV(data) {
        const headers = ['Nom', 'Email', 'Type', 'Statut', 'Téléphone', 'Date d\'inscription', 'Dernière connexion'];
        const rows = data.map(user => [
            `"${user.name}"`,
            `"${user.email}"`,
            `"${this.getTypeLabel(user.type)}"`,
            `"${this.getStatusLabel(user.status)}"`,
            `"${user.phone}"`,
            `"${this.formatDate(user.registrationDate)}"`,
            `"${this.formatDate(user.lastLogin)}"`
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async createUser() {
        const formData = new FormData(document.getElementById('addUserForm'));
        const userData = {
            name: document.getElementById('userNameInput').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            type: document.getElementById('userType').value,
            status: document.getElementById('userStatus').value,
            password: document.getElementById('userPassword').value
        };

        // Validation basique
        if (!userData.name || !userData.email || !userData.type || !userData.password) {
            this.showError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        this.showLoading();
        try {
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Ajout du nouvel utilisateur
            const newUser = {
                id: Math.max(...this.users.map(u => u.id)) + 1,
                ...userData,
                registrationDate: new Date().toISOString().split('T')[0],
                lastLogin: null,
                avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
            };
            
            this.users.unshift(newUser);
            this.showSuccess('Utilisateur créé avec succès');
            this.closeAddUserModal();
            this.applyFilters();
            this.updateMetrics();
            
        } catch (error) {
            this.showError('Erreur lors de la création de l\'utilisateur: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    viewUserProfile(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            this.showNotification(`Ouverture du profil de ${user.name}`, 'info');
            // Implémentation de l'ouverture du profil utilisateur
        }
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            this.showNotification(`Édition de l'utilisateur ${user.name}`, 'info');
            // Implémentation de l'édition d'utilisateur
        }
    }

    async suspendUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            const confirmed = await this.showConfirmation(
                `Suspendre l'utilisateur ${user.name} ?`,
                'L\'utilisateur ne pourra plus accéder à la plateforme jusqu\'à sa réactivation.'
            );

            if (confirmed) {
                this.showLoading();
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    user.status = 'suspended';
                    this.showSuccess(`Utilisateur ${user.name} suspendu avec succès`);
                    this.applyFilters();
                } catch (error) {
                    this.showError('Erreur lors de la suspension de l\'utilisateur');
                } finally {
                    this.hideLoading();
                }
            }
        }
    }

    async activateUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            const confirmed = await this.showConfirmation(
                `Réactiver l'utilisateur ${user.name} ?`,
                'L\'utilisateur retrouvera l\'accès à la plateforme.'
            );

            if (confirmed) {
                this.showLoading();
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    user.status = 'active';
                    this.showSuccess(`Utilisateur ${user.name} réactivé avec succès`);
                    this.applyFilters();
                } catch (error) {
                    this.showError('Erreur lors de la réactivation de l\'utilisateur');
                } finally {
                    this.hideLoading();
                }
            }
        }
    }

    async deleteUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            const confirmed = await this.showConfirmation(
                `Supprimer définitivement l'utilisateur ${user.name} ?`,
                'Cette action est irréversible. Toutes les données de l\'utilisateur seront définitivement supprimées.',
                true
            );

            if (confirmed) {
                this.showLoading();
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.users = this.users.filter(u => u.id !== id);
                    this.selectedUsers.delete(id);
                    this.showSuccess(`Utilisateur ${user.name} supprimé avec succès`);
                    this.applyFilters();
                    this.updateMetrics();
                } catch (error) {
                    this.showError('Erreur lors de la suppression de l\'utilisateur');
                } finally {
                    this.hideLoading();
                }
            }
        }
    }

    // Gestion de la pagination
    updatePagination() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        const paginationInfo = document.getElementById('paginationInfo');
        const pageNumbers = document.getElementById('pageNumbers');
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');

        // Info de pagination
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
        paginationInfo.textContent = `Affichage ${startItem}-${endItem} sur ${this.filteredUsers.length} utilisateurs`;

        // Boutons précédent/suivant
        prevPage.classList.toggle('disabled', this.currentPage === 1);
        nextPage.classList.toggle('disabled', this.currentPage === totalPages || totalPages === 0);

        // Numéros de page
        pageNumbers.innerHTML = '';
        const maxPages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages, startPage + maxPages - 1);

        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => this.goToPage(i));
            pageNumbers.appendChild(pageBtn);
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderUsers();
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderUsers();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderUsers();
        }
    }

    // Métriques
    updateMetrics() {
        const totalUsers = this.users.length;
        const proprietaires = this.users.filter(u => u.type === 'proprietaire').length;
        const locataires = this.users.filter(u => u.type === 'locataire').length;
        const activeUsers = this.users.filter(u => u.status === 'active').length;

        document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
        document.getElementById('proprietairesCount').textContent = proprietaires.toLocaleString();
        document.getElementById('locatairesCount').textContent = locataires.toLocaleString();
        document.getElementById('activeUsers').textContent = activeUsers.toLocaleString();
    }

    // Helpers
    getTypeLabel(type) {
        const types = {
            proprietaire: 'Propriétaire',
            locataire: 'Locataire',
            agent: 'Agent',
            admin: 'Administrateur',
            agent_municipal: 'Agent Municipal',
            agent_fiscal: 'Agent Fiscal',
            agence: 'Agence Immobilière'
        };
        return types[type] || type;
    }

    getStatusLabel(status) {
        const statuses = {
            active: 'Actif',
            inactive: 'Inactif',
            suspended: 'Suspendu',
            pending: 'En attente'
        };
        return statuses[status] || status;
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }

    // Gestion des états d'interface
    showLoading() {
        document.getElementById('loadingState').classList.add('show');
        document.body.classList.add('loading');
    }

    hideLoading() {
        document.getElementById('loadingState').classList.remove('show');
        document.body.classList.remove('loading');
    }

    showEmptyState() {
        document.getElementById('emptyState').classList.add('show');
        document.querySelector('.table-container').style.display = 'none';
        document.querySelector('.bulk-actions').style.display = 'none';
        document.querySelector('.pagination').style.display = 'none';
    }

    hideEmptyState() {
        document.getElementById('emptyState').classList.remove('show');
        document.querySelector('.table-container').style.display = 'block';
        document.querySelector('.bulk-actions').style.display = 'flex';
        document.querySelector('.pagination').style.display = 'flex';
    }

    // Notifications
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationsContainer');
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    // Modal de confirmation
    showConfirmation(message, description = '', isDanger = false) {
        return new Promise((resolve) => {
            this.confirmationResolve = resolve;
            this.confirmationAction = null;
            
            document.getElementById('confirmMessage').textContent = message;
            if (description) {
                document.getElementById('confirmMessage').innerHTML += `<br><small style="opacity: 0.8;">${description}</small>`;
            }
            
            const confirmOk = document.getElementById('confirmOk');
            if (isDanger) {
                confirmOk.classList.add('btn-danger');
                confirmOk.classList.remove('btn-primary');
            } else {
                confirmOk.classList.add('btn-primary');
                confirmOk.classList.remove('btn-danger');
            }
            
            document.getElementById('confirmModal').style.display = 'block';
        });
    }

    executeConfirmedAction() {
        if (this.confirmationResolve) {
            this.confirmationResolve(true);
            this.confirmationResolve = null;
        }
        this.closeConfirmModal();
    }

    closeConfirmModal() {
        if (this.confirmationResolve) {
            this.confirmationResolve(false);
            this.confirmationResolve = null;
        }
        document.getElementById('confirmModal').style.display = 'none';
    }
}

// Initialisation globale
let userManager;

document.addEventListener('DOMContentLoaded', function() {
    // Vérification d'authentification (simulée)
    if (typeof checkAuth === 'function' && !checkAuth('administrateur')) {
        window.location.href = 'login.html';
        return;
    }

    // Affichage du nom d'utilisateur
    const user = getCurrentUser ? getCurrentUser() : { name: 'Admin Système' };
    if (user) {
        document.getElementById('userName').textContent = user.name;
    }

    // Initialisation du gestionnaire d'utilisateurs
    userManager = new UserManager();

    // Gestion des clics en dehors des modales
    window.onclick = function(event) {
        const addUserModal = document.getElementById('addUserModal');
        const confirmModal = document.getElementById('confirmModal');
        
        if (event.target === addUserModal) {
            closeAddUserModal();
        }
        if (event.target === confirmModal) {
            userManager.closeConfirmModal();
        }
    }
});

// Fonctions globales pour la compatibilité HTML
function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
    document.getElementById('addUserForm').reset();
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('userPassword');
    const toggleButton = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleButton.className = 'fas fa-eye';
    }
}

// Fonctions de simulation d'authentification
function getCurrentUser() {
    return { name: 'Admin Système', role: 'administrateur' };
}

function checkAuth(requiredRole) {
    const user = getCurrentUser();
    return user && user.role === requiredRole;
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        window.location.href = '../login.html';
    }
}