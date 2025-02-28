/**
 * Module de gestion du bouton de retour en haut de page
 */

/**
 * Initialise le bouton de retour en haut de page
 */
export function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Vérifier la position initiale
        toggleBackToTopButton(backToTopBtn);
        
        // Ajouter l'écouteur d'événement pour le défilement
        window.addEventListener('scroll', () => {
            toggleBackToTopButton(backToTopBtn);
        });
        
        // Ajouter l'écouteur d'événement pour le clic
        backToTopBtn.addEventListener('click', scrollToTop);
    }
}

/**
 * Affiche ou masque le bouton de retour en haut
 * @param {HTMLElement} button - Bouton de retour en haut
 */
function toggleBackToTopButton(button) {
    if (window.scrollY > 300) {
        button.classList.add('visible');
    } else {
        button.classList.remove('visible');
    }
}

/**
 * Fait défiler la page vers le haut
 * @param {Event} e - Événement de clic
 */
function scrollToTop(e) {
    e.preventDefault();
    
    // Défiler vers le haut avec une animation
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Focus sur le haut de la page pour l'accessibilité
    document.querySelector('header').focus();
}