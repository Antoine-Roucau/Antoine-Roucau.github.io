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
        console.log('Ouverture du modal pour l\'élément à l\'index:', index);
        
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title');
        const category = item.querySelector('.gallery-item-category');
        const description = item.querySelector('.gallery-item-description');
        
        if (!img || !title || !category || !description) {
            console.error('Éléments requis introuvables dans l\'élément de galerie', item);
            return;
        }
        
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
        console.log('Fermeture du modal');
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Réactiver le défilement
    }
    
    /**
     * Affiche l'image précédente dans le modal
     */
    function showPrevImage() {
        if (visibleItems.length === 0) {
            console.warn('Aucun élément visible pour naviguer');
            return;
        }
        
        currentItemIndex = (currentItemIndex - 1 + visibleItems.length) % visibleItems.length;
        console.log('Navigation vers l\'image précédente, nouvel index:', currentItemIndex);
        
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
        if (visibleItems.length === 0) {
            console.warn('Aucun élément visible pour naviguer');
            return;
        }
        
        currentItemIndex = (currentItemIndex + 1) % visibleItems.length;
        console.log('Navigation vers l\'image suivante, nouvel index:', currentItemIndex);
        
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
        console.log('Filtrage de la galerie avec la valeur:', filterValue);
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
        console.log('Configuration des écouteurs d\'événements...');
        
        // Ajouter les écouteurs d'événements pour les éléments de la galerie
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Trouver l'index actuel dans les éléments visibles
                const visibleIndex = visibleItems.indexOf(item);
                if (visibleIndex !== -1) {
                    openModal(item, visibleIndex);
                } else {
                    console.warn('Élément cliqué non trouvé dans les éléments visibles');
                    openModal(item, 0); // Fallback à l'index 0
                }
            });
        });
        
        console.log('Écouteurs sur les éléments de galerie configurés');
        
        // Écouteurs d'événements du modal
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        if (modalPrev) {
            modalPrev.addEventListener('click', function(e) {
                e.stopPropagation(); // Empêcher la propagation au modal
                showPrevImage();
            });
        }
        
        if (modalNext) {
            modalNext.addEventListener('click', function(e) {
                e.stopPropagation(); // Empêcher la propagation au modal
                showNextImage();
            });
        }
        
        // Fermer le modal en cliquant en dehors de l'image
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        console.log('Écouteurs du modal configurés');
        
        // Navigation au clavier dans le modal
        document.addEventListener('keydown', function(e) {
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
            button.addEventListener('click', function() {
                // Mettre à jour la classe active
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Appliquer le filtre
                filterGallery(button.dataset.filter);
            });
        });
        
        console.log('Tous les écouteurs d\'événements sont configurés');
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
    
    /**
     * Vérifie que tous les éléments nécessaires sont présents dans le DOM
     * @returns {boolean} - Vrai si tous les éléments sont trouvés
     */
    function checkRequiredElements() {
        const required = [
            { element: galleryItems, name: 'galleryItems' },
            { element: modal, name: 'modal' },
            { element: modalImg, name: 'modalImg' },
            { element: modalTitle, name: 'modalTitle' },
            { element: modalCategory, name: 'modalCategory' },
            { element: modalDescription, name: 'modalDescription' },
            { element: modalClose, name: 'modalClose' },
            { element: modalPrev, name: 'modalPrev' },
            { element: modalNext, name: 'modalNext' },
            { element: filterButtons, name: 'filterButtons' }
        ];
        
        let allFound = true;
        
        required.forEach(item => {
            if (!item.element || (Array.isArray(item.element) && item.element.length === 0)) {
                console.error(`Élément requis non trouvé: ${item.name}`);
                allFound = false;
            }
        });
        
        return allFound;
    }
    
    // Interface publique du module
    return {
        /**
         * Initialise le composant de la page galerie
         */
        init: function() {
            console.log('Initialisation du composant GalleryPage');
            
            // Vérifier si nous sommes sur la page galerie
            const pageType = document.body.getAttribute('data-page-type');
            if (pageType !== 'gallery') {
                console.log('Pas sur la page galerie (type de page: ' + pageType + '), initialisation annulée');
                return;
            }
            
            // Récupérer les éléments DOM nécessaires
            galleryItems = document.querySelectorAll('.gallery-item');
            modal = document.querySelector('.gallery-modal');
            
            // Vérifier si ces éléments existent
            if (!galleryItems.length || !modal) {
                console.error('Éléments de galerie non trouvés, initialisation interrompue');
                return;
            }
            
            console.log('Éléments de galerie et modal trouvés, récupération des éléments internes du modal');
            
            modalImg = modal.querySelector('img');
            modalTitle = modal.querySelector('.gallery-modal-title');
            modalCategory = modal.querySelector('.gallery-modal-category');
            modalDescription = modal.querySelector('.gallery-modal-description');
            modalClose = modal.querySelector('.gallery-modal-close');
            modalPrev = modal.querySelector('.gallery-modal-prev');
            modalNext = modal.querySelector('.gallery-modal-next');
            filterButtons = document.querySelectorAll('.gallery-filter');
            
            // Vérifier que tous les éléments nécessaires sont présents
            if (!checkRequiredElements()) {
                console.error('Certains éléments requis sont manquants, vérifiez la structure HTML');
                return;
            }
            
            // Initialiser les éléments visibles (tous au départ)
            visibleItems = Array.from(galleryItems);
            console.log(`${visibleItems.length} éléments de galerie sont visibles initialement`);
            
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
    console.log('DOM déjà chargé, initialisation immédiate du composant GalleryPage');
    APP.components.GalleryPage.init();
} else {
    // Sinon, attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Événement DOMContentLoaded déclenché, initialisation du composant GalleryPage');
        APP.components.GalleryPage.init();
    });
}