/**
 * Module de gestion de la navigation et du menu mobile
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module de navigation
APP.components.Navigation = (function() {
  /**
   * Gère l'effet de scroll sur le header
   */
  function initHeaderScroll() {
    var header = document.querySelector('.header');
    
    if (header) {
      // Appliquer la classe scrolled au chargement si nécessaire
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      }
      
      // Ajouter l'écouteur d'événement pour le défilement
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
  }
  
  /**
   * Initialise le menu mobile et son bouton
   */
  function initMobileMenu() {
    var menuToggle = document.querySelector('.menu-toggle');
    var navigation = document.querySelector('.navigation');
    var navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navigation) {
      console.log('Menu mobile initialisé'); // Log de débogage
      
      // Ouvrir/fermer le menu mobile
      menuToggle.addEventListener('click', function(e) {
        e.preventDefault(); // Prévenir tout comportement par défaut
        console.log('Menu toggle clicked'); // Log de débogage
        
        menuToggle.classList.toggle('active');
        navigation.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
      });
      
      // Fermer le menu après clic sur un lien
      navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          navigation.classList.remove('active');
          document.body.classList.remove('no-scroll');
        });
      });
      
      // Fermer le menu avec la touche Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navigation.classList.contains('active')) {
          menuToggle.classList.remove('active');
          navigation.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
    } else {
      console.error('Éléments du menu mobile non trouvés:', {
        menuToggle: !!menuToggle,
        navigation: !!navigation
      });
    }
  }
  
  /**
   * Met à jour les liens actifs en fonction du défilement
   */
  function initActiveLinks() {
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length && sections.length) {
      // Fonction pour mettre à jour les liens actifs
      var updateActiveLinks = function() {
        var current = '';
        
        // Trouver la section actuellement visible
        sections.forEach(function(section) {
          var sectionTop = section.offsetTop - 150;
          var sectionHeight = section.offsetHeight;
          
          if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });
        
        // Mettre à jour les classes actives
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
          }
        });
      };
      
      // Initialiser et ajouter l'écouteur d'événement
      updateActiveLinks();
      window.addEventListener('scroll', updateActiveLinks);
    }
  }
  
  /**
   * Initialise la navigation principale et mobile
   */
  function init() {
    console.log('Initialisation de la navigation');
    initHeaderScroll();
    initMobileMenu();
    initActiveLinks();
    
    // Vérifier que l'initialisation est terminée
    console.log('Navigation initialisée');
  }
  
  // API publique
  return {
    init: init
  };
})();