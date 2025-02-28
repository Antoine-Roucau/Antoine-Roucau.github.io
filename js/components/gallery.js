/**
 * Module de gestion des galeries de projets
 */

/**
 * Initialise les galeries de projets
 */
export function initGallery() {
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
    const galleries = document.querySelectorAll('.project-gallery');
    
    galleries.forEach(gallery => {
        const mainImage = gallery.querySelector('.gallery-main img');
        const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
        
        if (mainImage && thumbnails.length) {
            // Gérer le clic sur les miniatures
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    // Mettre à jour l'image principale
                    const thumbnailImg = thumbnail.querySelector('img');
                    mainImage.src = thumbnailImg.src.replace('-thumb', '');
                    mainImage.alt = thumbnailImg.alt;
                    
                    // Mettre à jour les classes actives
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
            });
            
            // Préchargement des images
            thumbnails.forEach(thumbnail => {
                const thumbnailImg = thumbnail.querySelector('img');
                const fullImg = new Image();
                fullImg.src = thumbnailImg.src.replace('-thumb', '');
            });
        }
    });
}

/**
 * Initialise les galeries de comparaison avant/après
 */
function initComparisonGallery() {
    const comparisonContainers = document.querySelectorAll('.comparison-slider');
    
    comparisonContainers.forEach(container => {
        const slider = container.querySelector('.comparison-slider-handle');
        const beforeImage = container.querySelector('.comparison-before');
        const afterImage = container.querySelector('.comparison-after');
        
        if (slider && beforeImage && afterImage) {
            // Initialiser à 50%
            updateComparisonView(container, 50);
            
            // Gérer le glissement (drag)
            let isDragging = false;
            
            // Événements souris
            slider.addEventListener('mousedown', () => {
                isDragging = true;
                container.classList.add('dragging');
            });
            
            window.addEventListener('mouseup', () => {
                isDragging = false;
                container.classList.remove('dragging');
            });
            
            container.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const rect = container.getBoundingClientRect();
                    const position = ((e.clientX - rect.left) / rect.width) * 100;
                    updateComparisonView(container, position);
                }
            });
            
            // Événements tactiles
            slider.addEventListener('touchstart', () => {
                isDragging = true;
                container.classList.add('dragging');
            });
            
            window.addEventListener('touchend', () => {
                isDragging = false;
                container.classList.remove('dragging');
            });
            
            container.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    const rect = container.getBoundingClientRect();
                    const touch = e.touches[0];
                    const position = ((touch.clientX - rect.left) / rect.width) * 100;
                    updateComparisonView(container, position);
                    e.preventDefault(); // Empêcher le défilement
                }
            });
            
            // Clic direct sur le container
            container.addEventListener('click', (e) => {
                const rect = container.getBoundingClientRect();
                const position = ((e.clientX - rect.left) / rect.width) * 100;
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
    
    const slider = container.querySelector('.comparison-slider-handle');
    const beforeImage = container.querySelector('.comparison-before');
    
    if (slider && beforeImage) {
        slider.style.left = `${position}%`;
        beforeImage.style.width = `${position}%`;
    }
}

/**
 * Initialise la lightbox pour agrandir les images
 */
function initLightbox() {
    // Créer la lightbox si elle n'existe pas déjà
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <button class="lightbox-prev">&lsaquo;</button>
                <button class="lightbox-next">&rsaquo;</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Fermer la lightbox au clic sur le bouton ou en dehors de l'image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
        
        // Gestion des touches du clavier
        document.addEventListener('keydown', (e) => {
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
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            navigateLightbox('prev');
        });
        
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            navigateLightbox('next');
        });
    }
    
    // Trouver toutes les images cliquables
    const galleryImages = document.querySelectorAll('.gallery-main img, .project-gallery img:not(.gallery-thumbnail img)');
    
    galleryImages.forEach((img, index) => {
        img.dataset.index = index;
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', () => {
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
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
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
    const lightbox = document.querySelector('.lightbox');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const currentIndex = parseInt(lightbox.querySelector('.lightbox-image').dataset.index);
    
    // Mise à jour des boutons de navigation
    prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
    nextBtn.style.display = currentIndex < images.length - 1 ? 'block' : 'none';
}

/**
 * Navigue dans la lightbox
 * @param {string} direction - Direction (prev/next)
 */
function navigateLightbox(direction) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const currentIndex = parseInt(lightboxImg.dataset.index);
    
    // Trouver toutes les images
    const images = document.querySelectorAll('.gallery-main img, .project-gallery img:not(.gallery-thumbnail img)');
    
    // Calculer le nouvel index
    let newIndex;
    if (direction === 'prev') {
        newIndex = Math.max(currentIndex - 1, 0);
    } else {
        newIndex = Math.min(currentIndex + 1, images.length - 1);
    }
    
    // Mettre à jour l'image
    const newImg = images[newIndex];
    lightboxImg.src = newImg.src;
    lightboxImg.alt = newImg.alt;
    lightboxImg.dataset.index = newIndex;
    lightboxCaption.textContent = newImg.alt;
    
    // Mettre à jour la navigation
    updateLightboxNavigation(images);
}