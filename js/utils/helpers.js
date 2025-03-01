/**
 * Utilitaires divers pour le portfolio
 */

// Espace de noms global
var APP = APP || {};

// Module des utilitaires
APP.utils.helpers = (function() {
  /**
   * Vérifie si un élément est visible dans la fenêtre
   * @param {HTMLElement} element - Élément à vérifier
   * @param {number} offset - Décalage (en pixels)
   * @returns {boolean} - True si l'élément est visible
   */
  function isElementInViewport(element, offset) {
    offset = offset || 0;
    var rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset) &&
      rect.bottom >= (0 + offset) &&
      rect.left <= window.innerWidth &&
      rect.right >= 0
    );
  }

  /**
   * Limite l'exécution d'une fonction (debounce)
   * @param {Function} func - Fonction à limiter
   * @param {number} wait - Délai d'attente en ms
   * @param {boolean} immediate - Exécuter immédiatement
   * @returns {Function} - Fonction limitée
   */
  function debounce(func, wait, immediate) {
    wait = wait || 100;
    immediate = immediate || false;
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  /**
   * Limite le taux d'exécution d'une fonction (throttle)
   * @param {Function} func - Fonction à limiter
   * @param {number} limit - Limite en ms
   * @returns {Function} - Fonction limitée
   */
  function throttle(func, limit) {
    limit = limit || 100;
    var inThrottle;
    return function() {
      var context = this;
      var args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

  /**
   * Génère un ID unique
   * @returns {string} - ID unique
   */
  function generateUniqueId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Formate une date
   * @param {string|Date} date - Date à formater
   * @param {string} format - Format (default: DD/MM/YYYY)
   * @returns {string} - Date formatée
   */
  function formatDate(date, format) {
    format = format || 'DD/MM/YYYY';
    var d = new Date(date);
    if (isNaN(d.getTime())) return 'Date invalide';
    
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();
    
    // Remplacer les tokens dans le format
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace('YY', String(year).substr(2, 2));
  }

  /**
   * Tronque un texte à une longueur maximale
   * @param {string} text - Texte à tronquer
   * @param {number} maxLength - Longueur maximale
   * @param {string} suffix - Suffixe (default: '...')
   * @returns {string} - Texte tronqué
   */
  function truncateText(text, maxLength, suffix) {
    suffix = suffix || '...';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Récupère les paramètres d'URL
   * @returns {Object} - Paramètres d'URL
   */
  function getUrlParameters() {
    var params = {};
    var queryString = window.location.search.substr(1);
    
    if (queryString) {
      var paramPairs = queryString.split('&');
      
      for (var i = 0; i < paramPairs.length; i++) {
        var pair = paramPairs[i].split('=');
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1] || '');
        params[key] = value;
      }
    }
    
    return params;
  }

  /**
   * Vérifie si l'appareil est mobile
   * @returns {boolean} - True si l'appareil est mobile
   */
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Vérifie si le mode sombre est activé
   * @returns {boolean} - True si le mode sombre est activé
   */
  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /**
   * Génère un nombre aléatoire entre min et max
   * @param {number} min - Valeur minimale
   * @param {number} max - Valeur maximale
   * @returns {number} - Nombre aléatoire
   */
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Supprime les HTML tags d'une chaîne
   * @param {string} html - Chaîne avec HTML
   * @returns {string} - Chaîne sans HTML
   */
  function stripHtml(html) {
    var tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // API publique
  return {
    isElementInViewport: isElementInViewport,
    debounce: debounce,
    throttle: throttle,
    generateUniqueId: generateUniqueId,
    formatDate: formatDate,
    truncateText: truncateText,
    getUrlParameters: getUrlParameters,
    isMobileDevice: isMobileDevice,
    isDarkMode: isDarkMode,
    randomNumber: randomNumber,
    stripHtml: stripHtml
  };
})();