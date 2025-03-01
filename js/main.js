// main.js
var APP = APP || {};

// Fonction pour charger dynamiquement les scripts
APP.loadScripts = (function() {
  // Liste des scripts à charger dans l'ordre
  var scripts = [
    // Utilitaires d'abord
    'js/utils/polyfills.js',
    'js/utils/helpers.js',
    'js/utils/animations.js',
    
    // Ensuite les composants (dans l'ordre des dépendances)
    'js/components/loader.js',
    'js/components/themeToggle.js',
    'js/components/navigation.js',
    'js/components/backToTop.js',
    'js/components/smoothScroll.js',
    'js/components/projectFilters.js',
    'js/components/skillsTabs.js',
    'js/components/typeWriter.js',
    'js/components/gallery.js',
    'js/components/contactForm.js',
    'js/components/formValidation.js'
  ];
  
  var scriptsLoaded = 0;
  
  function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    
    // Événement de chargement terminé
    script.onload = function() {
      callback(null, url);
    };
    
    // Gestion des erreurs
    script.onerror = function() {
      callback(new Error('Erreur de chargement du script: ' + url));
    };
    
    document.body.appendChild(script);
  }
  
  function loadNextScript(index, callback) {
    if (index >= scripts.length) {
      // Tous les scripts sont chargés
      callback();
      return;
    }
    
    loadScript(scripts[index], function(error) {
      if (error) {
        console.error(error);
      }
      
      // Charger le script suivant
      loadNextScript(index + 1, callback);
    });
  }
  
  return {
    loadAll: function(callback) {
      loadNextScript(0, callback);
    }
  };
})();

// Initialiser l'application une fois tous les scripts chargés
APP.init = function() {
    // Initialiser les utilitaires d'abord
    if (APP.utils) {
      // Initialiser les polyfills
      if (APP.utils.polyfills && typeof APP.utils.polyfills.init === 'function') {
        APP.utils.polyfills.init();
      }
    }
  
    // S'assurer que le loader est initialisé immédiatement
    if (APP.components && APP.components.Loader) {
      APP.components.Loader.init();
    }
    
    // Initialiser les autres composants quand le loader est terminé
    document.addEventListener('loaderComplete', function() {
      if (APP.components) {
        // Initialiser les composants communs
        if (APP.components.ThemeToggle) APP.components.ThemeToggle.init();
        if (APP.components.Navigation) APP.components.Navigation.init();
        if (APP.components.BackToTop) APP.components.BackToTop.init();
        if (APP.components.SmoothScroll) APP.components.SmoothScroll.init();
        if (APP.components.ContactForm) APP.components.ContactForm.init();
        if (APP.components.FormValidation) APP.components.FormValidation.init();
        
        // Initialiser les animations au défilement si nécessaire
        if (APP.utils && APP.utils.animations && 
            typeof APP.utils.animations.initScrollAnimations === 'function') {
          APP.utils.animations.initScrollAnimations();
        }
        
        // Déterminer le type de page
        var pageType = document.body.getAttribute('data-page-type') || 'home';
        
        // Initialiser les composants spécifiques à la page
        switch(pageType) {
          case 'home':
            if (APP.components.ProjectFilters) APP.components.ProjectFilters.init();
            if (APP.components.SkillsTabs) APP.components.SkillsTabs.init();
            if (APP.components.TypeWriter) APP.components.TypeWriter.init();
            break;
          case 'project':
            if (APP.components.Gallery) APP.components.Gallery.init();
            break;
        }
      }
      
      // Mise à jour de l'année dans le footer
      var yearElement = document.getElementById('current-year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
      
      console.log('Tous les composants sont initialisés');
    });
  };

// Démarrer le chargement des scripts au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser l'espace de noms des composants
  APP.components = {};
  APP.utils = {};
  
  // Commencer le chargement des scripts
  APP.loadScripts.loadAll(function() {
    console.log('Tous les scripts ont été chargés');
    APP.init();
  });
  
  // Déjà initialiser le thème pour éviter un flash
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});