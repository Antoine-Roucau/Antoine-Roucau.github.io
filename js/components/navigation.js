/**
 * Module de gestion de la navigation et du menu mobile
 */

/**
 * Initialise la navigation principale et mobile
 */
export function initNavigation() {
    initHeaderScroll();
    initMobileMenu();
    initActiveLinks();
}

/**
 * Gère l'effet de scroll sur le header
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        // Appliquer la classe scrolled au chargement si nécessaire
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        // Ajouter l'écouteur d'événement pour le défilement
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Initialise le menu mobile et son bouton
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navigation) {
        // Ouvrir/fermer le menu mobile
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navigation.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Fermer le menu après clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navigation.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
        
        // Fermer le menu avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navigation.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navigation.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
}

/**
 * Met à jour les liens actifs en fonction du défilement
 */
function initActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length && sections.length) {
        // Fonction pour mettre à jour les liens actifs
        const updateActiveLinks = () => {
            let current = '';
            
            // Trouver la section actuellement visible
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            // Mettre à jour les classes actives
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };
        
        // Initialiser et ajouter l'écouteur d'événement
        updateActiveLinks();
        window.addEventListener('scroll', updateActiveLinks);
    }
}