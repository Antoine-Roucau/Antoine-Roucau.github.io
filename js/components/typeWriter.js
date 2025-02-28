/**
 * Module d'effet de machine à écrire
 */

/**
 * Initialise les effets de machine à écrire
 */
export function initTypeWriter() {
    const typeElements = document.querySelectorAll('[data-type-effect]');
    
    if (typeElements.length) {
        typeElements.forEach(element => {
            // Récupérer les options
            const text = element.getAttribute('data-type-text') || element.textContent;
            const typeSpeed = parseInt(element.getAttribute('data-type-speed') || '100');
            const typeDelay = parseInt(element.getAttribute('data-type-delay') || '500');
            const typeCursor = element.getAttribute('data-type-cursor') !== 'false';
            const typeLoop = element.getAttribute('data-type-loop') !== 'false';
            
            // Configurer l'élément
            element.textContent = '';
            
            // Ajouter un curseur si nécessaire
            if (typeCursor) {
                const cursor = document.createElement('span');
                cursor.className = 'type-cursor';
                cursor.textContent = '|';
                element.appendChild(cursor);
            }
            
            // Démarrer l'effet
            setTimeout(() => {
                typeText(element, text, 0, typeSpeed, typeLoop);
            }, typeDelay);
        });
    }
}

/**
 * Anime le texte caractère par caractère
 * @param {HTMLElement} element - Élément cible
 * @param {string} text - Texte à animer
 * @param {number} index - Index du caractère
 * @param {number} speed - Vitesse de frappe
 * @param {boolean} loop - Répéter l'animation
 */
function typeText(element, text, index, speed, loop) {
    // Vérifier si tous les caractères ont été tapés
    if (index < text.length) {
        // Ajouter le caractère suivant
        if (element.querySelector('.type-cursor')) {
            element.insertBefore(
                document.createTextNode(text.charAt(index)),
                element.querySelector('.type-cursor')
            );
        } else {
            element.textContent += text.charAt(index);
        }
        
        // Passer au caractère suivant
        setTimeout(() => {
            typeText(element, text, index + 1, speed, loop);
        }, speed);
    } else if (loop) {
        // Effacer le texte après un délai
        setTimeout(() => {
            eraseText(element, text, text.length, Math.max(speed / 2, 50), loop);
        }, 1500);
    }
}

/**
 * Efface le texte caractère par caractère
 * @param {HTMLElement} element - Élément cible
 * @param {string} text - Texte complet
 * @param {number} index - Index du caractère
 * @param {number} speed - Vitesse d'effacement
 * @param {boolean} loop - Répéter l'animation
 */
function eraseText(element, text, index, speed, loop) {
    // Vérifier s'il reste des caractères à effacer
    if (index > 0) {
        // Supprimer le dernier caractère
        if (element.querySelector('.type-cursor')) {
            element.removeChild(element.querySelector('.type-cursor').previousSibling);
        } else {
            element.textContent = element.textContent.slice(0, -1);
        }
        
        // Passer au caractère précédent
        setTimeout(() => {
            eraseText(element, text, index - 1, speed, loop);
        }, speed);
    } else {
        // Redémarrer l'animation après un délai
        setTimeout(() => {
            typeText(element, text, 0, speed * 2, loop);
        }, 500);
    }
}