/**
 * Utilitaires divers pour le portfolio
 */

/**
 * Vérifie si un élément est visible dans la fenêtre
 * @param {HTMLElement} element - Élément à vérifier
 * @param {number} offset - Décalage (en pixels)
 * @returns {boolean} - True si l'élément est visible
 */
export function isElementInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight - offset) &&
        rect.bottom >= (0 + offset) &&
        rect.left <= window.innerWidth &&
        rect.right >= 0
    );
}

/**
 * Limite l'exécution d'une fonction (debounce)
 * @param {Function} func - Fonction à limiter
 * @param {number} wait - Délai d'attente en ms
 * @param {boolean} immediate - Exécuter immédiatement
 * @returns {Function} - Fonction limitée
 */
export function debounce(func, wait = 100, immediate = false) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Limite le taux d'exécution d'une fonction (throttle)
 * @param {Function} func - Fonction à limiter
 * @param {number} limit - Limite en ms
 * @returns {Function} - Fonction limitée
 */
export function throttle(func, limit = 100) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Génère un ID unique
 * @returns {string} - ID unique
 */
export function generateUniqueId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formate une date
 * @param {string|Date} date - Date à formater
 * @param {string} format - Format (default: DD/MM/YYYY)
 * @returns {string} - Date formatée
 */
export function formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Date invalide';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    // Remplacer les tokens dans le format
    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year)
        .replace('YY', String(year).substr(2, 2));
}

/**
 * Tronque un texte à une longueur maximale
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @param {string} suffix - Suffixe (default: '...')
 * @returns {string} - Texte tronqué
 */
export function truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - suffix.length) + suffix;
}

/**
 * Récupère les paramètres d'URL
 * @returns {Object} - Paramètres d'URL
 */
export function getUrlParameters() {
    const params = {};
    const queryString = window.location.search.substr(1);
    
    if (queryString) {
        const paramPairs = queryString.split('&');
        
        paramPairs.forEach(pair => {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
    }
    
    return params;
}

/**
 * Vérifie si l'appareil est mobile
 * @returns {boolean} - True si l'appareil est mobile
 */
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Vérifie si le mode sombre est activé
 * @returns {boolean} - True si le mode sombre est activé
 */
export function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

/**
 * Génère un nombre aléatoire entre min et max
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} - Nombre aléatoire
 */
export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Supprime les HTML tags d'une chaîne
 * @param {string} html - Chaîne avec HTML
 * @returns {string} - Chaîne sans HTML
 */
export function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}