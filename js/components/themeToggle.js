/**
 * Module de gestion du thème clair/sombre
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module de bascule de thème
APP.components.ThemeToggle = (function() {
  /**
   * Applique le thème initial en fonction des préférences
   */
  function applyInitialTheme() {
    var prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
  
  /**
   * Bascule entre les thèmes clair et sombre
   */
  function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    var newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Ajouter une classe pour l'animation de transition
    document.documentElement.classList.add('theme-transition');
    
    // Changer le thème
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Retirer la classe après la transition
    setTimeout(function() {
      document.documentElement.classList.remove('theme-transition');
    }, 1000);
  }
  
  /**
   * Initialise la bascule de thème
   */
  function init() {
    var themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    if (themeToggleBtn) {
      // Appliquer le thème initial
      applyInitialTheme();
      
      // Ajouter l'écouteur d'événement pour le bouton
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Écoute les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      var storedTheme = localStorage.getItem('theme');
      
      // Ne pas changer le thème si l'utilisateur a explicitement choisi un thème
      if (!storedTheme) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }
  
  // API publique
  return {
    init: init,
    applyInitialTheme: applyInitialTheme,
    toggleTheme: toggleTheme
  };
})();