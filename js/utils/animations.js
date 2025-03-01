/**
 * Utilitaires d'animation
 */

// Espace de noms global
var APP = APP || {};

// Module des animations
APP.utils.animations = (function() {
  /**
   * Effectue une animation de fondu en entrée
   * @param {HTMLElement} element - Élément à animer
   * @param {number} duration - Durée en millisecondes
   * @returns {Promise} - Promise résolue à la fin de l'animation
   */
  function fadeIn(element, duration) {
    duration = duration || 300;
    
    return new Promise(function(resolve) {
      element.style.opacity = '0';
      element.style.display = '';
      
      // Forcer le recalcul du style
      void element.offsetWidth;
      
      // Ajouter la transition
      element.style.transition = 'opacity ' + duration + 'ms ease';
      element.style.opacity = '1';
      
      // Résoudre la promise après la fin de l'animation
      setTimeout(function() {
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }

  /**
   * Effectue une animation de fondu en sortie
   * @param {HTMLElement} element - Élément à animer
   * @param {number} duration - Durée en millisecondes
   * @returns {Promise} - Promise résolue à la fin de l'animation
   */
  function fadeOut(element, duration) {
    duration = duration || 300;
    
    return new Promise(function(resolve) {
      // Ajouter la transition
      element.style.transition = 'opacity ' + duration + 'ms ease';
      element.style.opacity = '0';
      
      // Résoudre la promise après la fin de l'animation
      setTimeout(function() {
        element.style.display = 'none';
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }

  /**
   * Effectue une animation de glissement vers le bas
   * @param {HTMLElement} element - Élément à animer
   * @param {number} duration - Durée en millisecondes
   * @returns {Promise} - Promise résolue à la fin de l'animation
   */
  function slideDown(element, duration) {
    duration = duration || 300;
    
    return new Promise(function(resolve) {
      // Obtenir la hauteur de l'élément
      element.style.display = 'block';
      var height = element.scrollHeight;
      
      // Préparer l'animation
      element.style.overflow = 'hidden';
      element.style.height = '0';
      element.style.paddingTop = '0';
      element.style.paddingBottom = '0';
      element.style.marginTop = '0';
      element.style.marginBottom = '0';
      
      // Forcer le recalcul du style
      void element.offsetWidth;
      
      // Ajouter la transition
      element.style.transition = 'height ' + duration + 'ms ease, ' +
                                 'padding ' + duration + 'ms ease, ' +
                                 'margin ' + duration + 'ms ease';
      
      // Définir la hauteur et les espacements finaux
      element.style.height = height + 'px';
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');
      
      // Nettoyer après l'animation
      setTimeout(function() {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
        resolve();
      }, duration);
    });
  }

  /**
   * Effectue une animation de glissement vers le haut
   * @param {HTMLElement} element - Élément à animer
   * @param {number} duration - Durée en millisecondes
   * @returns {Promise} - Promise résolue à la fin de l'animation
   */
  function slideUp(element, duration) {
    duration = duration || 300;
    
    return new Promise(function(resolve) {
      // Préparer l'animation
      element.style.overflow = 'hidden';
      element.style.height = element.scrollHeight + 'px';
      
      // Forcer le recalcul du style
      void element.offsetWidth;
      
      // Ajouter la transition
      element.style.transition = 'height ' + duration + 'ms ease, ' +
                                 'padding ' + duration + 'ms ease, ' +
                                 'margin ' + duration + 'ms ease';
      
      // Définir la hauteur et les espacements finaux
      element.style.height = '0';
      element.style.paddingTop = '0';
      element.style.paddingBottom = '0';
      element.style.marginTop = '0';
      element.style.marginBottom = '0';
      
      // Nettoyer après l'animation
      setTimeout(function() {
        element.style.display = 'none';
        element.style.removeProperty('height');
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
        resolve();
      }, duration);
    });
  }

  /**
   * Initialise les animations au défilement
   */
  function initScrollAnimations() {
    var animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length) {
      // Créer l'observateur d'intersection
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.1,
        rootMargin: '-100px'
      });
      
      // Observer chaque élément
      animateElements.forEach(function(element) {
        observer.observe(element);
      });
    }
  }

  // API publique
  return {
    fadeIn: fadeIn,
    fadeOut: fadeOut,
    slideDown: slideDown,
    slideUp: slideUp,
    initScrollAnimations: initScrollAnimations
  };
})();