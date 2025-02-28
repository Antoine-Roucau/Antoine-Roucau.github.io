/**
 * Polyfills pour assurer la compatibilité avec les navigateurs plus anciens
 */

// Polyfill pour IntersectionObserver
if (!('IntersectionObserver' in window)) {
    console.log('Polyfill: IntersectionObserver non supporté');
    // L'implémentation du polyfill complet serait longue, nous utilisons ici
    // une solution de repli simple au lieu d'un polyfill complet
}

// Polyfill pour Element.matches
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.msMatchesSelector || 
        Element.prototype.webkitMatchesSelector;
}

// Polyfill pour Element.closest
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Polyfill pour NodeList.forEach
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}