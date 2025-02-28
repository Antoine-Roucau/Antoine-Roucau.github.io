/**
 * Module de gestion du thème clair/sombre
 */

/**
 * Initialise la bascule de thème
 */
export function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    if (themeToggleBtn) {
        // Appliquer le thème initial
        applyInitialTheme();
        
        // Ajouter l'écouteur d'événement pour le bouton
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

/**
 * Applique le thème initial en fonction des préférences
 */
function applyInitialTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

/**
 * Bascule entre les thèmes clair et sombre
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Ajouter une classe pour l'animation de transition
    document.documentElement.classList.add('theme-transition');
    
    // Changer le thème
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Retirer la classe après la transition
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 1000);
}

/**
 * Écoute les changements de préférence système
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const storedTheme = localStorage.getItem('theme');
    
    // Ne pas changer le thème si l'utilisateur a explicitement choisi un thème
    if (!storedTheme) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});