/**
 * Utilitaires d'animation
 */

/**
 * Effectue une animation de fondu en entrée
 * @param {HTMLElement} element - Élément à animer
 * @param {number} duration - Durée en millisecondes
 * @returns {Promise} - Promise résolue à la fin de l'animation
 */
export function fadeIn(element, duration = 300) {
    return new Promise(resolve => {
        element.style.opacity = '0';
        element.style.display = '';
        
        // Forcer le recalcul du style
        void element.offsetWidth;
        
        // Ajouter la transition
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '1';
        
        // Résoudre la promise après la fin de l'animation
        setTimeout(() => {
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
export function fadeOut(element, duration = 300) {
    return new Promise(resolve => {
        // Ajouter la transition
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        // Résoudre la promise après la fin de l'animation
        setTimeout(() => {
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
export function slideDown(element, duration = 300) {
    return new Promise(resolve => {
        // Obtenir la hauteur de l'élément
        element.style.display = 'block';
        const height = element.scrollHeight;
        
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
        element.style.transition = `height ${duration}ms ease, 
                                   padding ${duration}ms ease, 
                                   margin ${duration}ms ease`;
        
        // Définir la hauteur et les espacements finaux
        element.style.height = `${height}px`;
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        
        // Nettoyer après l'animation
        setTimeout(() => {
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
export function slideUp(element, duration = 300) {
    return new Promise(resolve => {
        // Préparer l'animation
        element.style.overflow = 'hidden';
        element.style.height = `${element.scrollHeight}px`;
        
        // Forcer le recalcul du style
        void element.offsetWidth;
        
        // Ajouter la transition
        element.style.transition = `height ${duration}ms ease, 
                                   padding ${duration}ms ease, 
                                   margin ${duration}ms ease`;
        
        // Définir la hauteur et les espacements finaux
        element.style.height = '0';
        element.style.paddingTop = '0';
        element.style.paddingBottom = '0';
        element.style.marginTop = '0';
        element.style.marginBottom = '0';
        
        // Nettoyer après l'animation
        setTimeout(() => {
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
export function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length) {
        // Créer l'observateur d'intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
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
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
}