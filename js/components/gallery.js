/**
 * Module de gestion des galeries de projets
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module de galerie
APP.components.Gallery = (function() {
  // Variables privées
  var lightbox = null;
  var currentGalleryImages = [];
  
  /**
   * Initialise les galeries de projets
   */
  function init() {
    // Galerie principale avec miniatures
    initThumbnailGallery();
    
    // Galerie de comparaison avant/après (si existante)
    initComparisonGallery();
    
    // Lightbox pour agrandir les images
    initLightbox();
  }
  
  /**
   * Initialise la galerie avec miniatures
   */
  function initThumbnailGallery() {
    var galleries = document.querySelectorAll('.project-gallery');
    
    galleries.forEach(function(gallery) {
      var mainImage = gallery.querySelector('.gallery-main img');
      var thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
      
      if (mainImage && thumbnails.length) {
        // Gérer le clic sur les miniatures
        thumbnails.forEach(function(thumbnail) {
          thumbnail.addEventListener('click', function() {
            // Mettre à jour l'image principale
            var thumbnailImg = thumbnail.querySelector('img');
            mainImage.src = thumbnailImg.src.replace('-thumb', '');
            mainImage.alt = thumbnailImg.alt;
            
            // Mettre à jour les classes actives
            thumbnails.forEach(function(t) { t.classList.remove('active'); });
            thumbnail.classList.add('active');
          });
        });
        
        // Préchargement des images
        thumbnails.forEach(function(thumbnail) {
          var thumbnailImg = thumbnail.querySelector('img');
          var fullImg = new Image();
          fullImg.src = thumbnailImg.src.replace('-thumb', '');
        });
      }
    });
  }
  
  /**
   * Initialise les galeries de comparaison avant/après
   */
  function initComparisonGallery() {
    var comparisonContainers = document.querySelectorAll('.comparison-slider');
    
    comparisonContainers.forEach(function(container) {
      var slider = container.querySelector('.comparison-slider-handle');
      var beforeImage = container.querySelector('.comparison-before');
      var afterImage = container.querySelector('.comparison-after');
      
      if (slider && beforeImage && afterImage) {
        // Initialiser à 50%
        updateComparisonView(container, 50);
        
        // Gérer le glissement (drag)
        var isDragging = false;
        
        // Événements souris
        slider.addEventListener('mousedown', function() {
          isDragging = true;
          container.classList.add('dragging');
        });
        
        window.addEventListener('mouseup', function() {
          isDragging = false;
          container.classList.remove('dragging');
        });
        
        container.addEventListener('mousemove', function(e) {
          if (isDragging) {
            var rect = container.getBoundingClientRect();
            var position = ((e.clientX - rect.left) / rect.width) * 100;
            updateComparisonView(container, position);
          }
        });
        
        // Événements tactiles
        slider.addEventListener('touchstart', function() {
          isDragging = true;
          container.classList.add('dragging');
        });
        
        window.addEventListener('touchend', function() {
          isDragging = false;
          container.classList.remove('dragging');
        });
        
        container.addEventListener('touchmove', function(e) {
          if (isDragging) {
            var rect = container.getBoundingClientRect();
            var touch = e.touches[0];
            var position = ((touch.clientX - rect.left) / rect.width) * 100;
            updateComparisonView(container, position);
            e.preventDefault(); // Empêcher le défilement
          }
        });
        
        // Clic direct sur le container
        container.addEventListener('click', function(e) {
          var rect = container.getBoundingClientRect();
          var position = ((e.clientX - rect.left) / rect.width) * 100;
          updateComparisonView(container, position);
        });
      }
    });
  }
  
  /**
   * Met à jour la vue du comparateur avant/après
   * @param {HTMLElement} container - Élément conteneur
   * @param {number} position - Position en pourcentage (0-100)
   */
  function updateComparisonView(container, position) {
    // Limiter la position entre 0 et 100
    position = Math.min(Math.max(position, 0), 100);
    
    var slider = container.querySelector('.comparison-slider-handle');
    var beforeImage = container.querySelector('.comparison-before');
    
    if (slider && beforeImage) {
      slider.style.left = position + '%';
      beforeImage.style.width = position + '%';
    }
  }
  
  /**
   * Initialise la lightbox pour agrandir les images
   */
  function initLightbox() {
    // Créer la lightbox si elle n'existe pas déjà
    if (!document.querySelector('.lightbox')) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = [
        '<div class="lightbox-content">',
          '<button class="lightbox-close">&times;</button>',
          '<img class="lightbox-image" src="" alt="">',
          '<div class="lightbox-caption"></div>',
          '<button class="lightbox-prev">&lsaquo;</button>',
          '<button class="lightbox-next">&rsaquo;</button>',
        '</div>'
      ].join('');
      
      document.body.appendChild(lightbox);
      
      // Fermer la lightbox au clic sur le bouton ou en dehors de l'image
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
          lightbox.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
      
      // Gestion des touches du clavier
      document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch (e.key) {
          case 'Escape':
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
            break;
          case 'ArrowLeft':
            navigateLightbox('prev');
            break;
          case 'ArrowRight':
            navigateLightbox('next');
            break;
        }
      });
      
      // Navigation dans la lightbox
      lightbox.querySelector('.lightbox-prev').addEventListener('click', function() {
        navigateLightbox('prev');
      });
      
      lightbox.querySelector('.lightbox-next').addEventListener('click', function() {
        navigateLightbox('next');
      });
    } else {
      lightbox = document.querySelector('.lightbox');
    }
    
    // Trouver toutes les images cliquables
    var galleryImages = document.querySelectorAll('.gallery-main img, .project-gallery img:not(.gallery-thumbnail img)');
    currentGalleryImages = galleryImages;
    
    galleryImages.forEach(function(img, index) {
      img.dataset.index = index;
      img.style.cursor = 'pointer';
      
      img.addEventListener('click', function() {
        openLightbox(img, galleryImages);
      });
    });
  }
  
  /**
   * Ouvre la lightbox avec l'image sélectionnée
   * @param {HTMLElement} img - Image à afficher
   * @param {NodeList} images - Collection d'images
   */
  function openLightbox(img, images) {
    var lightboxImg = lightbox.querySelector('.lightbox-image');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    // Mettre à jour l'image et la légende
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.dataset.index = img.dataset.index;
    lightboxCaption.textContent = img.alt;
    
    // Mettre à jour la navigation
    updateLightboxNavigation(images);
    
    // Afficher la lightbox
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  }
  
  /**
   * Met à jour la navigation de la lightbox
   * @param {NodeList} images - Collection d'images
   */
  function updateLightboxNavigation(images) {
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var currentIndex = parseInt(lightbox.querySelector('.lightbox-image').dataset.index);
    
    // Mise à jour des boutons de navigation
    prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    nextBtn.style.display = currentIndex < images.length - 1 ? 'block' : 'none';
  }
  
  /**
   * Navigue dans la lightbox
   * @param {string} direction - Direction (prev/next)
   */
  function navigateLightbox(direction) {
    var lightboxImg = lightbox.querySelector('.lightbox-image');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    var currentIndex = parseInt(lightboxImg.dataset.index);
    
    // Calculer le nouvel index
    var newIndex;
    if (direction === 'prev') {
      newIndex = Math.max(currentIndex - 1, 0);
    } else {
      newIndex = Math.min(currentIndex + 1, currentGalleryImages.length - 1);
    }
    
    // Mettre à jour l'image
    var newImg = currentGalleryImages[newIndex];
    lightboxImg.src = newImg.src;
    lightboxImg.alt = newImg.alt;
    lightboxImg.dataset.index = newIndex;
    lightboxCaption.textContent = newImg.alt;
    
    // Mettre à jour la navigation
    updateLightboxNavigation(currentGalleryImages);
  }
  
  // API publique
  return {
    init: init
  };
})();