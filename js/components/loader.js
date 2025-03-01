/**
 * Module Loader
 * Gestion de l'animation de chargement initial
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module du loader
APP.components.Loader = (function() {
  // Variables privées
  var loaderInitialized = false;
  var loaderOverlay, loaderProgressBar;
  
  /**
   * Initialise le loader
   */
  function init() {
    // Éviter l'initialisation multiple
    if (loaderInitialized) return;
    loaderInitialized = true;
    
    console.log('Initialisation du Loader');
    
    // Récupérer les éléments
    loaderOverlay = document.querySelector('.loader-overlay');
    loaderProgressBar = document.querySelector('.loader-progress-bar');
    
    if (!loaderOverlay || !loaderProgressBar) {
      console.error("Éléments du loader non trouvés - vérifiez votre HTML");
      
      // Simuler un événement loaderComplete
      setTimeout(function() {
        document.dispatchEvent(new Event('loaderComplete'));
      }, 100);
      return;
    }
    
    // Assurer la visibilité du loader
    loaderOverlay.style.display = 'flex';
    loaderOverlay.style.opacity = '1';
    
    // Empêcher le défilement pendant le chargement
    document.body.style.overflow = 'hidden';
    
    // Animation simple
    simulateLoading();
  }
  
  /**
   * Simule un chargement progressif
   */
  function simulateLoading() {
    var width = 0;
    var interval = setInterval(function() {
      if (width >= 100) {
        clearInterval(interval);
        
        // Attendre un court instant avant de masquer
        setTimeout(function() {
          hideLoader();
        }, 300);
        return;
      }
      
      width += 2;
      loaderProgressBar.style.width = width + '%';
    }, 30);
  }
  
  /**
   * Cache le loader avec animation de transition
   */
  function hideLoader() {
    if (!loaderOverlay) return;
    
    console.log('Masquage du loader');
    
    // Animation de fadeout
    loaderOverlay.style.opacity = '0';
    
    // Attendre la fin de l'animation avant de masquer
    setTimeout(function() {
      loaderOverlay.style.display = 'none';
      document.body.style.overflow = '';
      
      // Déclencher l'événement
      document.dispatchEvent(new Event('loaderComplete'));
      console.log('Loader masqué, événement loaderComplete déclenché');
    }, 500);
  }
  
  // API publique
  return {
    init: init
  };
})();