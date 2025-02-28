/**
 * Module de gestion des onglets de compétences
 */

/**
 * Initialise les onglets des compétences
 */
export function initSkillsTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length && tabPanes.length) {
        // Vérifier l'onglet actif dans l'URL
        checkUrlTab(tabBtns, tabPanes);
        
        // Initialiser les boutons d'onglet
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Mettre à jour les boutons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mettre à jour les onglets
                tabPanes.forEach(pane => pane.classList.remove('active'));
                const activePane = document.getElementById(tabId);
                if (activePane) {
                    activePane.classList.add('active');
                    
                    // Réinitialiser les animations de compétences
                    resetSkillAnimations(activePane);
                }
                
                // Mettre à jour l'URL
                updateUrlWithTab(tabId);
            });
        });
    }
}

/**
 * Réinitialise les animations des barres de compétences
 * @param {HTMLElement} pane - Panneau d'onglet actif
 */
function resetSkillAnimations(pane) {
    const progressBars = pane.querySelectorAll('.skill-progress');
    
    progressBars.forEach(progress => {
        // Supprimer l'animation
        progress.style.animation = 'none';
        
        // Forcer le recalcul du style
        void progress.offsetWidth;
        
        // Réappliquer l'animation
        progress.style.animation = 'progress 1.5s ease-out forwards';
    });
}

/**
 * Met à jour l'URL avec l'onglet actif
 * @param {string} tabId - Identifiant de l'onglet actif
 */
function updateUrlWithTab(tabId) {
    const url = new URL(window.location);
    
    // Ajouter ou mettre à jour le paramètre tab
    url.searchParams.set('tab', tabId);
    
    // Mettre à jour l'URL sans recharger la page
    window.history.replaceState({}, '', url);
}

/**
 * Vérifie l'URL pour un onglet prédéfini
 * @param {NodeList} tabBtns - Boutons d'onglet
 * @param {NodeList} tabPanes - Panneaux d'onglet
 */
function checkUrlTab(tabBtns, tabPanes) {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('tab')) {
        const tabId = params.get('tab');
        const targetBtn = Array.from(tabBtns).find(btn => btn.getAttribute('data-tab') === tabId);
        
        if (targetBtn) {
            // Mettre à jour les boutons
            tabBtns.forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            
            // Mettre à jour les onglets
            tabPanes.forEach(pane => pane.classList.remove('active'));
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.classList.add('active');
            }
        }
    }
}