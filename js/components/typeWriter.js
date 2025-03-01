/**
 * Module d'effet de machine à écrire
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module de l'effet machine à écrire
APP.components.TypeWriter = (function() {
  /**
   * Initialise les effets de machine à écrire
   */
  function init() {
    var typeElements = document.querySelectorAll('[data-type-effect]');
    
    if (typeElements.length) {
      typeElements.forEach(function(element) {
        // Récupérer les options
        var text = element.getAttribute('data-type-text') || element.textContent;
        var typeSpeed = parseInt(element.getAttribute('data-type-speed') || '100');
        var typeDelay = parseInt(element.getAttribute('data-type-delay') || '500');
        var typeCursor = element.getAttribute('data-type-cursor') !== 'false';
        var typeLoop = element.getAttribute('data-type-loop') !== 'false';
        
        // Configurer l'élément
        element.textContent = '';
        
        // Ajouter un curseur si nécessaire
        if (typeCursor) {
          var cursor = document.createElement('span');
          cursor.className = 'type-cursor';
          cursor.textContent = '|';
          element.appendChild(cursor);
        }
        
        // Démarrer l'effet
        setTimeout(function() {
          typeText(element, text, 0, typeSpeed, typeLoop);
        }, typeDelay);
      });
    }
  }
  
  /**
   * Anime le texte caractère par caractère
   * @param {HTMLElement} element - Élément cible
   * @param {string} text - Texte à animer
   * @param {number} index - Index du caractère
   * @param {number} speed - Vitesse de frappe
   * @param {boolean} loop - Répéter l'animation
   */
  function typeText(element, text, index, speed, loop) {
    // Vérifier si tous les caractères ont été tapés
    if (index < text.length) {
      // Ajouter le caractère suivant
      if (element.querySelector('.type-cursor')) {
        element.insertBefore(
          document.createTextNode(text.charAt(index)),
          element.querySelector('.type-cursor')
        );
      } else {
        element.textContent += text.charAt(index);
      }
      
      // Passer au caractère suivant
      setTimeout(function() {
        typeText(element, text, index + 1, speed, loop);
      }, speed);
    } else if (loop) {
      // Effacer le texte après un délai
      setTimeout(function() {
        eraseText(element, text, text.length, Math.max(speed / 2, 50), loop);
      }, 1500);
    }
  }
  
  /**
   * Efface le texte caractère par caractère
   * @param {HTMLElement} element - Élément cible
   * @param {string} text - Texte complet
   * @param {number} index - Index du caractère
   * @param {number} speed - Vitesse d'effacement
   * @param {boolean} loop - Répéter l'animation
   */
  function eraseText(element, text, index, speed, loop) {
    // Vérifier s'il reste des caractères à effacer
    if (index > 0) {
      // Supprimer le dernier caractère
      if (element.querySelector('.type-cursor')) {
        element.removeChild(element.querySelector('.type-cursor').previousSibling);
      } else {
        element.textContent = element.textContent.slice(0, -1);
      }
      
      // Passer au caractère précédent
      setTimeout(function() {
        eraseText(element, text, index - 1, speed, loop);
      }, speed);
    } else {
      // Redémarrer l'animation après un délai
      setTimeout(function() {
        typeText(element, text, 0, speed * 2, loop);
      }, 500);
    }
  }
  
  // API publique
  return {
    init: init
  };
})();