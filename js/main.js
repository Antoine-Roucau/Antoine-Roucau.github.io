/**
 * Script principal du portfolio d'Antoine ROUCAU
 * Ce fichier utilise des modules ES pour organiser le code
 */

// Importation des modules
import { initThemeToggle } from './components/themeToggle.js';
import { init as initLoader } from './components/loader.js';
import { init as initNavigation } from './components/navigation.js';
import { init as initBackToTop } from './components/backToTop.js';
import { init as initSmoothScroll } from './components/smoothScroll.js';
import { init as initProjectFilters } from './components/projectFilters.js';
import { init as initSkillsTabs } from './components/skillsTabs.js';
import { init as initTypeWriter } from './components/typeWriter.js';
import { init as initGallery } from './components/gallery.js';
import { init as initContactForm } from './components/contactForm.js';
import { init as initFormValidation } from './components/formValidation.js';

// Variables d'état
let portfolioInitialized = false;
let loaderComplete = false;

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation du loader...');
    
    // Initialiser le loader en premier
    try {
        initLoader();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du loader:', error);
        setupSimpleLoader();
    }
    
    // Appliquer le thème immédiatement
    initThemeToggle();
});

// Solution de secours pour le loader
function setupSimpleLoader() {
    const loaderOverlay = document.querySelector('.loader-overlay');
    if (!loaderOverlay) return;
    
    // Empêcher le défilement pendant le chargement
    document.body.style.overflow = 'hidden';
    
    // Simuler la progression
    const loaderProgress = document.querySelector('.loader-progress');
    if (loaderProgress) {
        let width = 0;
        const interval = setInterval(function() {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(hideSimpleLoader, 500);
                return;
            }
            width += 2;
            loaderProgress.style.width = width + '%';
        }, 40);
    } else {
        // Sans élément de progression, attendre simplement un délai
        setTimeout(hideSimpleLoader, 2000);
    }
    
    // Filet de sécurité
    window.addEventListener('load', function() {
        setTimeout(hideSimpleLoader, 4000);
    });
    
    function hideSimpleLoader() {
        if (loaderOverlay && loaderOverlay.style.display !== 'none') {
            loaderOverlay.style.display = 'none';
            document.body.style.overflow = '';
            loaderComplete = true;
            
            document.dispatchEvent(new CustomEvent('loaderComplete'));
            console.log('Loader masqué (méthode de secours)');
            
            initPortfolio();
        }
    }
}

// Fonction d'initialisation principale
function initPortfolio() {
    // Éviter l'initialisation multiple
    if (portfolioInitialized) return;
    portfolioInitialized = true;
    
    console.log('Initialisation du portfolio...');
    
    // Déterminer le type de page actuel
    const pageType = document.body.getAttribute('data-page-type') || 'home';
    console.log(`Type de page détecté: ${pageType}`);
    
    // Initialiser les modules communs
    initCommonModules();
    
    // Modules spécifiques selon le type de page
    switch(pageType) {
        case 'home':
            initHomeModules();
            break;
        case 'project':
            initProjectModules();
            break;
        default:
            console.log('Type de page standard');
    }
    
    // Mise à jour de l'année dans le footer
    updateCopyrightYear();
}

// Initialisation des modules communs
function initCommonModules() {
    console.log('Initialisation des modules communs...');
    
    try {
        initNavigation();
        initBackToTop();
        initSmoothScroll();
        initContactForm();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des modules communs:', error);
    }
}

// Initialisation des modules pour la page d'accueil
function initHomeModules() {
    console.log('Initialisation des modules de la page d\'accueil...');
    
    try {
        initProjectFilters();
        initSkillsTabs();
        initTypeWriter({
            element: document.querySelector('.glitch'),
            speed: 100,
            delay: 1000
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des modules de la page d\'accueil:', error);
    }
}

// Initialisation des modules pour les pages de projet
function initProjectModules() {
    console.log('Initialisation des modules de page projet...');
    
    try {
        initGallery();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des modules de page projet:', error);
    }
}

// Mise à jour de l'année de copyright
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Écouter l'événement loaderComplete pour initialiser le site
document.addEventListener('loaderComplete', function() {
    console.log('Loader terminé, initialisation du portfolio');
    loaderComplete = true;
    initPortfolio();
});

// Mécanisme de sécurité pour garantir l'initialisation
window.addEventListener('load', function() {
    setTimeout(function() {
        if (!portfolioInitialized) {
            console.warn('Initialisation de secours du portfolio');
            initPortfolio();
        }
    }, 5000);
});