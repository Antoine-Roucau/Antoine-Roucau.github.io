/**
 * Module de gestion du bouton de retour en haut de page
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module du bouton de retour en haut
APP.components.BackToTop = (function() {
  /**
   * Initialise le bouton de retour en haut de page
   */
  function init() {
    var backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
      // Vérifier la position initiale
      toggleBackToTopButton(backToTopBtn);
      
      // Ajouter l'écouteur d'événement pour le défilement
      window.addEventListener('scroll', function() {
        toggleBackToTopButton(backToTopBtn);
      });
      
      // Ajouter l'écouteur d'événement pour le clic
      backToTopBtn.addEventListener('click', scrollToTop);
    }
  }
  
  /**
   * Affiche ou masque le bouton de retour en haut
   * @param {HTMLElement} button - Bouton de retour en haut
   */
  function toggleBackToTopButton(button) {
    if (window.scrollY > 300) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  }
  
  /**
   * Fait défiler la page vers le haut
   * @param {Event} e - Événement de clic
   */
  function scrollToTop(e) {
    e.preventDefault();
    
    // Défiler vers le haut avec une animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Focus sur le haut de la page pour l'accessibilité
    var header = document.querySelector('header');
    if (header) {
      header.focus();
    }
  }
  
  // API publique
  return {
    init: init
  };
})();