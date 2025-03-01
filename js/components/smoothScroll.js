/**
 * Module de défilement fluide entre les sections
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module de défilement fluide
APP.components.SmoothScroll = (function() {
  /**
   * Initialise le défilement fluide pour les liens d'ancrage
   */
  function init() {
    // Tous les liens d'ancrage
    var anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(function(anchor) {
      anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Gestion des liens avec hash dans l'URL
    handleHashInUrl();
  }
  
  /**
   * Gère le clic sur un lien d'ancrage
   * @param {Event} e - Événement de clic
   */
  function handleSmoothScroll(e) {
    e.preventDefault();
    
    var targetId = this.getAttribute('href');
    var targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      scrollToTarget(targetElement);
      
      // Mettre à jour l'URL
      window.history.pushState(null, '', targetId);
    }
  }
  
  /**
   * Fait défiler la page vers l'élément cible
   * @param {HTMLElement} targetElement - Élément cible
   */
  function scrollToTarget(targetElement) {
    var headerHeight = document.querySelector('.header').offsetHeight;
    var targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
    
    // Animation de défilement
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Focus sur l'élément pour l'accessibilité
    setTimeout(function() {
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({preventScroll: true});
    }, 1000);
  }
  
  /**
   * Gère le défilement si un hash est présent dans l'URL
   */
  function handleHashInUrl() {
    if (window.location.hash) {
      var targetElement = document.querySelector(window.location.hash);
      
      if (targetElement) {
        // Défilement différé pour laisser la page se charger
        setTimeout(function() {
          scrollToTarget(targetElement);
        }, 500);
      }
    }
  }
  
  /**
   * Fonction de défilement progressif (pour polyfill)
   * @param {number} targetPosition - Position cible
   * @param {number} duration - Durée de l'animation
   */
  function smoothScrollPolyfill(targetPosition, duration) {
    duration = duration || 500;
    var startPosition = window.scrollY;
    var distance = targetPosition - startPosition;
    var startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      var timeElapsed = currentTime - startTime;
      var progress = Math.min(timeElapsed / duration, 1);
      var easeInOutQuad = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutQuad);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }
  
  // API publique
  return {
    init: init
  };
})();