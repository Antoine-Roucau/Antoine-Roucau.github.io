/**
 * Module Loader
 * Gestion de l'animation de chargement initial
 */

// Éléments DOM
let loaderOverlay, loaderProgress;

/**
 * Initialise le loader
 */
export function init() {
    console.log('Initialisation du Loader');
    
    // Récupérer les éléments
    loaderOverlay = document.querySelector('.loader-overlay');
    loaderProgress = document.querySelector('.loader-progress');
    
    if (!loaderOverlay) {
        console.error("Élément loader-overlay non trouvé");
        return;
    }
    
    // Empêcher le défilement pendant le chargement
    document.body.style.overflow = 'hidden';
    
    // Simuler la progression
    simulateProgress();
    
    // Filet de sécurité
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (loaderOverlay && loaderOverlay.style.display !== 'none') {
                console.warn('Forçage de la fin du chargement (timeout de sécurité)');
                hideLoader();
            }
        }, 5000);
    });
}

/**
 * Simule une progression de chargement
 */
function simulateProgress() {
    if (!loaderProgress) return;
    
    let width = 0;
    const interval = setInterval(function() {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(hideLoader, 500);
            return;
        }
        width += 2;
        loaderProgress.style.width = width + '%';
    }, 40);
}

/**
 * Cache le loader
 */
export function hideLoader() {
    if (!loaderOverlay) return;
    
    console.log('Masquage du loader');
    
    // Masquer directement
    loaderOverlay.style.display = 'none';
    document.body.style.overflow = '';
    
    // Déclencher l'événement
    document.dispatchEvent(new CustomEvent('loaderComplete'));
    console.log('Loader masqué, événement loaderComplete déclenché');
}