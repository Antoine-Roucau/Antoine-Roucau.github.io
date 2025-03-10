// galleryPage.js
APP.components = APP.components || {};

/**
 * Composant pour gérer la page galerie avec filtrage et modal
 */
APP.components.GalleryPage = (function() {
    // Variables privées
    var galleryItems;
    var modal;
    var modalImg;
    var modalTitle;
    var modalCategory; 
    var modalDescription;
    var modalClose;
    var modalPrev;
    var modalNext;
    var filterButtons;
    
    var currentItemIndex = 0;
    var visibleItems = [];
    
    /**
     * Ouvre le modal avec l'image sélectionnée
     * @param {HTMLElement} item - L'élément de galerie cliqué
     * @param {Number} index - L'index de l'élément dans la liste des éléments visibles
     */
    function openModal(item, index) {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title');
        const category = item.querySelector('.gallery-item-category');
        const description = item.querySelector('.gallery-item-description');
        
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalTitle.textContent = title.textContent;
        modalCategory.textContent = category.textContent;
        modalDescription.textContent = description.textContent;
        
        currentItemIndex = index;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement du body
    }
    
    /**
     * Ferme le modal
     */
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Réactiver le défilement
    }
    
    /**
     * Affiche l'image précédente dans le modal
     */
    function showPrevImage() {
        currentItemIndex = (currentItemIndex - 1 + visibleItems.length) % visibleItems.length;
        const prevItem = visibleItems[currentItemIndex];
        
        const img = prevItem.querySelector('img');
        const title = prevItem.querySelector('.gallery-item-title');
        const category = prevItem.querySelector('.gallery-item-category');
        const description = prevItem.querySelector('.gallery-item-description');
        
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalTitle.textContent = title.textContent;
        modalCategory.textContent = category.textContent;
        modalDescription.textContent = description.textContent;
    }
    
    /**
     * Affiche l'image suivante dans le modal
     */
    function showNextImage() {
        currentItemIndex = (currentItemIndex + 1) % visibleItems.length;
        const nextItem = visibleItems[currentItemIndex];
        
        const img = nextItem.querySelector('img');
        const title = nextItem.querySelector('.gallery-item-title');
        const category = nextItem.querySelector('.gallery-item-category');
        const description = nextItem.querySelector('.gallery-item-description');
        
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalTitle.textContent = title.textContent;
        modalCategory.textContent = category.textContent;
        modalDescription.textContent = description.textContent;
    }
    
    /**
     * Filtre les éléments de la galerie par catégorie
     * @param {String} filterValue - La valeur de filtre ('all' ou une catégorie spécifique)
     */
    function filterGallery(filterValue) {
        let visible = [];
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.dataset.category === filterValue) {
                item.style.display = 'block';
                visible.push(item);
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mettre à jour la liste des éléments visibles pour la navigation dans le modal
        visibleItems = visible;
    }
    
    /**
     * Configure les écouteurs d'événements
     */
    function setupEventListeners() {
        // Ajouter les écouteurs d'événements pour les éléments de la galerie
        galleryItems.forEach((item) => {
            item.addEventListener('click', () => {
                // Récupérer l'index dans la liste des éléments visibles
                const visibleIndex = visibleItems.indexOf(item);
                openModal(item, visibleIndex);
            });
        });
        
        // Écouteurs d'événements du modal
        modalClose.addEventListener('click', closeModal);
        modalPrev.addEventListener('click', showPrevImage);
        modalNext.addEventListener('click', showNextImage);
        
        // Fermer le modal en cliquant en dehors de l'image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Navigation au clavier dans le modal
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        });
        
        // Filtrage des éléments de la galerie
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Mettre à jour la classe active
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Appliquer le filtre
                filterGallery(button.dataset.filter);
            });
        });
    }
    
    /**
     * Applique le lazy loading aux images de la galerie
     */
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        
                        // Remplacer le src par data-src s'il existe
                        if (lazyImage.dataset.src) {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.removeAttribute('data-src');
                        }
                        
                        observer.unobserve(lazyImage);
                    }
                });
            });
            
            // Observer toutes les images avec data-src
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(image => {
                lazyImageObserver.observe(image);
            });
        } else {
            // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(image => {
                image.src = image.dataset.src;
                image.removeAttribute('data-src');
            });
        }
    }
    
    return {
        /**
         * Initialise le composant de la page galerie
         */
        init: function() {
            console.log('Initialisation du composant GalleryPage');
            
            // Récupérer les éléments DOM nécessaires
            galleryItems = document.querySelectorAll('.gallery-item');
            modal = document.querySelector('.gallery-modal');
            
            // Vérifier si ces éléments existent (nous sommes bien sur la bonne page)
            if (!galleryItems.length || !modal) {
                console.log('Eléments de galerie non trouvés, pas sur la page galerie');
                return;
            }
            
            modalImg = modal.querySelector('img');
            modalTitle = modal.querySelector('.gallery-modal-title');
            modalCategory = modal.querySelector('.gallery-modal-category');
            modalDescription = modal.querySelector('.gallery-modal-description');
            modalClose = modal.querySelector('.gallery-modal-close');
            modalPrev = modal.querySelector('.gallery-modal-prev');
            modalNext = modal.querySelector('.gallery-modal-next');
            filterButtons = document.querySelectorAll('.gallery-filter');
            
            // Initialiser les éléments visibles
            visibleItems = [...galleryItems];
            
            // Configurer les écouteurs d'événements
            setupEventListeners();
            
            // Configurer le lazy loading pour les images
            setupLazyLoading();
            
            console.log('Composant GalleryPage initialisé avec succès');
        }
    };
})();

// Auto-initialisation si le script est chargé après le DOM
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Vérifier si nous sommes sur la page galerie
    const pageType = document.body.getAttribute('data-page-type');
    if (pageType === 'gallery') {
        APP.components.GalleryPage.init();
    }
}