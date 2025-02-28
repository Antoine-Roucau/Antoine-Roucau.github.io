/**
 * Module de filtrage des projets
 */

/**
 * Initialise le système de filtrage des projets
 */
export function initProjectFilters() {
    const filterGroups = document.querySelectorAll('.filter-group');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterGroups.length && projectCards.length) {
        // Objet pour stocker les filtres actifs
        const activeFilters = {
            type: [],
            category: []
        };
        
        // Initialiser les boutons de filtre
        initFilterButtons(filterGroups, activeFilters, projectCards);
        
        // Vérifier les paramètres d'URL pour filtres prédéfinis
        checkUrlFilters(filterGroups, activeFilters, projectCards);
    }
}

/**
 * Initialise les boutons de filtrage
 * @param {NodeList} filterGroups - Groupes de filtres
 * @param {Object} activeFilters - Filtres actifs
 * @param {NodeList} projectCards - Cartes de projets
 */
function initFilterButtons(filterGroups, activeFilters, projectCards) {
    filterGroups.forEach(group => {
        const filterType = group.dataset.filterType;
        const filterButtons = group.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterValue = btn.dataset.filter;
                
                // Gestion du bouton "Tous"
                if (filterValue === 'all') {
                    activeFilters[filterType] = [];
                    
                    // Mettre à jour les boutons
                    filterButtons.forEach(b => {
                        if (b.dataset.filter === 'all') {
                            b.classList.add('active');
                        } else {
                            b.classList.remove('active');
                        }
                    });
                } else {
                    // Désactiver le bouton "Tous"
                    const allButton = group.querySelector('[data-filter="all"]');
                    if (allButton) {
                        allButton.classList.remove('active');
                    }
                    
                    // Ajouter ou supprimer le filtre
                    if (btn.classList.contains('active')) {
                        btn.classList.remove('active');
                        activeFilters[filterType] = activeFilters[filterType].filter(
                            item => item !== filterValue
                        );
                        
                        // Réactiver "Tous" si plus aucun filtre actif
                        if (activeFilters[filterType].length === 0 && allButton) {
                            allButton.classList.add('active');
                        }
                    } else {
                        // Remplacer le filtre au lieu de l'ajouter (mode simple)
                        filterButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        activeFilters[filterType] = [filterValue];
                    }
                }
                
                // Appliquer les filtres
                applyFilters(activeFilters, projectCards);
                
                // Mettre à jour l'URL avec les filtres actifs
                updateUrlWithFilters(activeFilters);
            });
        });
    });
}

/**
 * Applique les filtres aux projets
 * @param {Object} activeFilters - Filtres actifs
 * @param {NodeList} projectCards - Cartes de projets
 */
function applyFilters(activeFilters, projectCards) {
    projectCards.forEach(card => {
        // Vérifier si le projet correspond à tous les critères actifs
        const matchesType = activeFilters.type.length === 0 || 
            activeFilters.type.includes(card.dataset.type);
            
        const matchesCategory = activeFilters.category.length === 0 || 
            card.dataset.categories.split(' ').some(cat => 
                activeFilters.category.includes(cat)
            );
        
        // Afficher ou masquer selon les critères
        if (matchesType && matchesCategory) {
            // Animation d'apparition
            card.style.display = '';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // Animation de disparition
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Mettre à jour le message de résultats
    updateFilterResults(projectCards);
}

/**
 * Met à jour le message de résultats de filtrage
 * @param {NodeList} projectCards - Cartes de projets
 */
function updateFilterResults(projectCards) {
    const visibleProjects = Array.from(projectCards).filter(
        card => card.style.display !== 'none'
    );
    
    const resultsElement = document.querySelector('.filter-results');
    if (resultsElement) {
        if (visibleProjects.length === 0) {
            resultsElement.textContent = 'Aucun projet ne correspond à ces critères.';
            resultsElement.style.display = 'block';
        } else if (visibleProjects.length === projectCards.length) {
            resultsElement.style.display = 'none';
        } else {
            resultsElement.textContent = `${visibleProjects.length} projet(s) trouvé(s)`;
            resultsElement.style.display = 'block';
        }
    }
}

/**
 * Met à jour l'URL avec les filtres actifs
 * @param {Object} activeFilters - Filtres actifs
 */
function updateUrlWithFilters(activeFilters) {
    const url = new URL(window.location);
    
    // Supprimer les paramètres existants
    url.searchParams.delete('type');
    url.searchParams.delete('category');
    
    // Ajouter les nouveaux paramètres
    if (activeFilters.type.length > 0) {
        url.searchParams.set('type', activeFilters.type.join(','));
    }
    
    if (activeFilters.category.length > 0) {
        url.searchParams.set('category', activeFilters.category.join(','));
    }
    
    // Mettre à jour l'URL sans recharger la page
    window.history.replaceState({}, '', url);
}

/**
 * Vérifie les paramètres d'URL pour appliquer des filtres prédéfinis
 * @param {NodeList} filterGroups - Groupes de filtres
 * @param {Object} activeFilters - Filtres actifs
 * @param {NodeList} projectCards - Cartes de projets
 */
function checkUrlFilters(filterGroups, activeFilters, projectCards) {
    const params = new URLSearchParams(window.location.search);
    let hasUrlFilters = false;
    
    // Récupérer les filtres de type
    if (params.has('type')) {
        const typeFilters = params.get('type').split(',');
        activeFilters.type = typeFilters;
        hasUrlFilters = true;
    }
    
    // Récupérer les filtres de catégorie
    if (params.has('category')) {
        const categoryFilters = params.get('category').split(',');
        activeFilters.category = categoryFilters;
        hasUrlFilters = true;
    }
    
    // Si des filtres sont définis dans l'URL, les appliquer
    if (hasUrlFilters) {
        // Mettre à jour l'interface des boutons
        filterGroups.forEach(group => {
            const filterType = group.dataset.filterType;
            const filterButtons = group.querySelectorAll('.filter-btn');
            
            // Désactiver le bouton "Tous"
            const allButton = group.querySelector('[data-filter="all"]');
            if (allButton && activeFilters[filterType].length > 0) {
                allButton.classList.remove('active');
            }
            
            // Activer les boutons correspondant aux filtres
            filterButtons.forEach(btn => {
                const filterValue = btn.dataset.filter;
                if (filterValue !== 'all' && activeFilters[filterType].includes(filterValue)) {
                    btn.classList.add('active');
                }
            });
        });
        
        // Appliquer les filtres
        applyFilters(activeFilters, projectCards);
    }
}