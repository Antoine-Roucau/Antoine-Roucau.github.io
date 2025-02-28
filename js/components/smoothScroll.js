/**
 * Module de défilement fluide entre les sections
 */

/**
 * Initialise le défilement fluide pour les liens d'ancrage
 */
export function initSmoothScroll() {
    // Tous les liens d'ancrage
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Gestion des liens avec hash dans l'URL
    handleHashInUrl();
}

/**
 * Gère le clic sur un lien d'ancrage
 * @param {Event} e - Événement de clic
 */
function handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        scrollToTarget(targetElement);
        
        // Mettre à jour l'URL
        window.history.pushState(null, '', targetId);
    }
}

/**
 * Fait défiler la page vers l'élément cible
 * @param {HTMLElement} targetElement - Élément cible
 */
function scrollToTarget(targetElement) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
    
    // Animation de défilement
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Focus sur l'élément pour l'accessibilité
    setTimeout(() => {
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({preventScroll: true});
    }, 1000);
}

/**
 * Gère le défilement si un hash est présent dans l'URL
 */
function handleHashInUrl() {
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        
        if (targetElement) {
            // Défilement différé pour laisser la page se charger
            setTimeout(() => {
                scrollToTarget(targetElement);
            }, 500);
        }
    }
}

/**
 * Fonction de défilement progressif (pour polyfill)
 * @param {number} targetPosition - Position cible
 * @param {number} duration - Durée de l'animation
 */
function smoothScrollPolyfill(targetPosition, duration = 500) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeInOutQuad = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutQuad);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}