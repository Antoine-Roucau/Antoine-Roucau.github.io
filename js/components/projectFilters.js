/**
 * Module de filtrage des projets
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module des filtres de projets
APP.components.ProjectFilters = (function() {
  // Variables privées
  var activeFilters = {
    type: [],
    category: []
  };
  
  /**
   * Initialise le système de filtrage des projets
   */
  function init() {
    var filterGroups = document.querySelectorAll('.filter-group');
    var projectCards = document.querySelectorAll('.project-card');
    
    if (filterGroups.length && projectCards.length) {
      // Initialiser les boutons de filtre
      initFilterButtons(filterGroups, projectCards);
      
      // Vérifier les paramètres d'URL pour filtres prédéfinis
      checkUrlFilters(filterGroups, projectCards);
    }
  }
  
  /**
   * Initialise les boutons de filtrage
   * @param {NodeList} filterGroups - Groupes de filtres
   * @param {NodeList} projectCards - Cartes de projets
   */
  function initFilterButtons(filterGroups, projectCards) {
    filterGroups.forEach(function(group) {
      var filterType = group.dataset.filterType;
      var filterButtons = group.querySelectorAll('.filter-btn');
      
      filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var filterValue = btn.dataset.filter;
          
          // Gestion du bouton "Tous"
          if (filterValue === 'all') {
            activeFilters[filterType] = [];
            
            // Mettre à jour les boutons
            filterButtons.forEach(function(b) {
              if (b.dataset.filter === 'all') {
                b.classList.add('active');
              } else {
                b.classList.remove('active');
              }
            });
          } else {
            // Désactiver le bouton "Tous"
            var allButton = group.querySelector('[data-filter="all"]');
            if (allButton) {
              allButton.classList.remove('active');
            }
            
            // Ajouter ou supprimer le filtre
            if (btn.classList.contains('active')) {
              btn.classList.remove('active');
              activeFilters[filterType] = activeFilters[filterType].filter(
                function(item) { return item !== filterValue; }
              );
              
              // Réactiver "Tous" si plus aucun filtre actif
              if (activeFilters[filterType].length === 0 && allButton) {
                allButton.classList.add('active');
              }
            } else {
              // Remplacer le filtre au lieu de l'ajouter (mode simple)
              filterButtons.forEach(function(b) { b.classList.remove('active'); });
              btn.classList.add('active');
              activeFilters[filterType] = [filterValue];
            }
          }
          
          // Appliquer les filtres
          applyFilters(projectCards);
          
          // Mettre à jour l'URL avec les filtres actifs
          updateUrlWithFilters();
        });
      });
    });
  }
  
  /**
   * Applique les filtres aux projets
   * @param {NodeList} projectCards - Cartes de projets
   */
  function applyFilters(projectCards) {
    projectCards.forEach(function(card) {
      // Vérifier si le projet correspond à tous les critères actifs
      var matchesType = activeFilters.type.length === 0 || 
        activeFilters.type.includes(card.dataset.type);
        
      var matchesCategory = activeFilters.category.length === 0;
      
      if (!matchesCategory && card.dataset.categories) {
        var cardCategories = card.dataset.categories.split(' ');
        for (var i = 0; i < activeFilters.category.length; i++) {
          if (cardCategories.includes(activeFilters.category[i])) {
            matchesCategory = true;
            break;
          }
        }
      }
      
      // Afficher ou masquer selon les critères
      if (matchesType && matchesCategory) {
        // Animation d'apparition
        card.style.display = '';
        setTimeout(function() {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        // Animation de disparition
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(function() {
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
    var visibleProjects = Array.prototype.filter.call(projectCards, function(card) {
      return card.style.display !== 'none';
    });
    
    var resultsElement = document.querySelector('.filter-results');
    if (resultsElement) {
      if (visibleProjects.length === 0) {
        resultsElement.textContent = 'Aucun projet ne correspond à ces critères.';
        resultsElement.style.display = 'block';
      } else if (visibleProjects.length === projectCards.length) {
        resultsElement.style.display = 'none';
      } else {
        resultsElement.textContent = visibleProjects.length + ' projet(s) trouvé(s)';
        resultsElement.style.display = 'block';
      }
    }
  }
  
  /**
   * Met à jour l'URL avec les filtres actifs
   */
  function updateUrlWithFilters() {
    var url = new URL(window.location);
    
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
   * @param {NodeList} projectCards - Cartes de projets
   */
  function checkUrlFilters(filterGroups, projectCards) {
    var params = new URLSearchParams(window.location.search);
    var hasUrlFilters = false;
    
    // Récupérer les filtres de type
    if (params.has('type')) {
      var typeFilters = params.get('type').split(',');
      activeFilters.type = typeFilters;
      hasUrlFilters = true;
    }
    
    // Récupérer les filtres de catégorie
    if (params.has('category')) {
      var categoryFilters = params.get('category').split(',');
      activeFilters.category = categoryFilters;
      hasUrlFilters = true;
    }
    
    // Si des filtres sont définis dans l'URL, les appliquer
    if (hasUrlFilters) {
      // Mettre à jour l'interface des boutons
      filterGroups.forEach(function(group) {
        var filterType = group.dataset.filterType;
        var filterButtons = group.querySelectorAll('.filter-btn');
        
        // Désactiver le bouton "Tous"
        var allButton = group.querySelector('[data-filter="all"]');
        if (allButton && activeFilters[filterType].length > 0) {
          allButton.classList.remove('active');
        }
        
        // Activer les boutons correspondant aux filtres
        filterButtons.forEach(function(btn) {
          var filterValue = btn.dataset.filter;
          if (filterValue !== 'all' && activeFilters[filterType].includes(filterValue)) {
            btn.classList.add('active');
          }
        });
      });
      
      // Appliquer les filtres
      applyFilters(projectCards);
    }
  }
  
  // API publique
  return {
    init: init
  };
})();