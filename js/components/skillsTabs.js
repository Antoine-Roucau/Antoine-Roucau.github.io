/**
 * Module de gestion des onglets de compétences
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module des onglets de compétences
APP.components.SkillsTabs = (function() {
  /**
   * Initialise les onglets des compétences
   */
  function init() {
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length && tabPanes.length) {
      // Vérifier l'onglet actif dans l'URL
      checkUrlTab(tabBtns, tabPanes);
      
      // Initialiser les boutons d'onglet
      tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var tabId = btn.getAttribute('data-tab');
          
          // Mettre à jour les boutons
          tabBtns.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          
          // Mettre à jour les onglets
          tabPanes.forEach(function(pane) { pane.classList.remove('active'); });
          var activePane = document.getElementById(tabId);
          if (activePane) {
            activePane.classList.add('active');
            
            // Réinitialiser les animations de compétences
            resetSkillAnimations(activePane);
          }
          
          // Mettre à jour l'URL
          updateUrlWithTab(tabId);
        });
      });
    }
  }
  
  /**
   * Réinitialise les animations des barres de compétences
   * @param {HTMLElement} pane - Panneau d'onglet actif
   */
  function resetSkillAnimations(pane) {
    var progressBars = pane.querySelectorAll('.skill-progress');
    
    progressBars.forEach(function(progress) {
      // Supprimer l'animation
      progress.style.animation = 'none';
      
      // Forcer le recalcul du style
      void progress.offsetWidth;
      
      // Réappliquer l'animation
      progress.style.animation = 'progress 1.5s ease-out forwards';
    });
  }
  
  /**
   * Met à jour l'URL avec l'onglet actif
   * @param {string} tabId - Identifiant de l'onglet actif
   */
  function updateUrlWithTab(tabId) {
    var url = new URL(window.location);
    
    // Ajouter ou mettre à jour le paramètre tab
    url.searchParams.set('tab', tabId);
    
    // Mettre à jour l'URL sans recharger la page
    window.history.replaceState({}, '', url);
  }
  
  /**
   * Vérifie l'URL pour un onglet prédéfini
   * @param {NodeList} tabBtns - Boutons d'onglet
   * @param {NodeList} tabPanes - Panneaux d'onglet
   */
  function checkUrlTab(tabBtns, tabPanes) {
    var params = new URLSearchParams(window.location.search);
    
    if (params.has('tab')) {
      var tabId = params.get('tab');
      var targetBtn = null;
      
      // Trouver le bouton correspondant
      for (var i = 0; i < tabBtns.length; i++) {
        if (tabBtns[i].getAttribute('data-tab') === tabId) {
          targetBtn = tabBtns[i];
          break;
        }
      }
      
      if (targetBtn) {
        // Mettre à jour les boutons
        tabBtns.forEach(function(b) { b.classList.remove('active'); });
        targetBtn.classList.add('active');
        
        // Mettre à jour les onglets
        tabPanes.forEach(function(pane) { pane.classList.remove('active'); });
        var activePane = document.getElementById(tabId);
        if (activePane) {
          activePane.classList.add('active');
        }
      }
    }
  }
  
  // API publique
  return {
    init: init
  };
})();