/**
 * Module Loader amélioré
 * Gestion de l'animation de chargement initial
 */

// État du loader
const loaderState = {
    initialized: false,
    progress: 0,
    resourcesLoaded: false,
    hidden: false
  };
  
  // Éléments DOM
  let loaderOverlay, loaderProgressBar;
  
  /**
   * Initialise le loader
   */
  export function init() {
    // Éviter l'initialisation multiple
    if (loaderState.initialized) return;
    loaderState.initialized = true;
    
    console.log('Initialisation du Loader');
    
    // Récupérer les éléments
    loaderOverlay = document.querySelector('.loader-overlay');
    loaderProgressBar = document.querySelector('.loader-progress-bar');
    
    if (!loaderOverlay || !loaderProgressBar) {
      console.error("Éléments du loader non trouvés");
      return;
    }
    
    // Assurer la visibilité du loader
    loaderOverlay.style.display = 'flex';
    loaderOverlay.style.opacity = '1';
    
    // Empêcher le défilement pendant le chargement
    document.body.style.overflow = 'hidden';
    
    // Démarrer l'animation à 5%
    updateProgress(5);
    
    // Surveiller les ressources (images, scripts, etc.)
    trackResourceLoading();
    
    // Démarrer l'animation simulée de chargement
    startProgressSimulation();
    
    // Mécanisme de secours (après 8 secondes)
    setTimeout(() => {
      if (!loaderState.hidden) {
        console.warn('Forçage de la fin du chargement (timeout de sécurité)');
        completeLoading();
      }
    }, 8000);
    
    // Surveiller l'événement load global
    window.addEventListener('load', () => {
      loaderState.resourcesLoaded = true;
      
      // Accélérer l'animation après chargement
      accelerateProgress();
    });
  }
  
  /**
   * Suit le chargement des ressources principales
   */
  function trackResourceLoading() {
    // Compter les ressources importantes
    const resources = [
      ...Array.from(document.images),
      ...Array.from(document.querySelectorAll('script:not([async])')),
      ...Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    ];
    
    let loadedCount = 0;
    const totalCount = resources.length;
    
    // Si pas de ressources, considérer comme chargé
    if (totalCount === 0) {
      loaderState.resourcesLoaded = true;
      return;
    }
    
    // Fonction appelée lorsqu'une ressource est chargée
    const resourceLoaded = () => {
      loadedCount++;
      
      // Mettre à jour la progression basée sur le chargement réel
      const realProgress = Math.min(80, Math.floor((loadedCount / totalCount) * 80));
      updateProgress(Math.max(loaderState.progress, realProgress));
      
      // Vérifier si toutes les ressources sont chargées
      if (loadedCount >= totalCount) {
        loaderState.resourcesLoaded = true;
        accelerateProgress();
      }
    };
    
    // Surveiller le chargement des ressources
    resources.forEach(resource => {
      if (resource.complete) {
        resourceLoaded();
      } else {
        resource.addEventListener('load', resourceLoaded);
        resource.addEventListener('error', resourceLoaded); // Compter même en cas d'erreur
      }
    });
  }
  
  /**
   * Simulation de progression pour un feedback visuel
   */
  function startProgressSimulation() {
    let simulatedProgress = loaderState.progress;
    
    const interval = setInterval(() => {
      // Arrêter si le loader est déjà caché
      if (loaderState.hidden) {
        clearInterval(interval);
        return;
      }
      
      // Progression plus lente à mesure qu'on approche de 80%
      const increment = 80 - simulatedProgress > 30 ? 2 : 0.5;
      simulatedProgress = Math.min(80, simulatedProgress + increment);
      
      updateProgress(simulatedProgress);
      
      // Si les ressources sont chargées, accélérer
      if (loaderState.resourcesLoaded && simulatedProgress >= 75) {
        clearInterval(interval);
        accelerateProgress();
      }
    }, 50);
  }
  
  /**
   * Accélère la progression vers 100%
   */
  function accelerateProgress() {
    if (loaderState.progress < 100) {
      updateProgress(90);
      
      setTimeout(() => {
        updateProgress(100);
        completeLoading();
      }, 300);
    } else if (loaderState.progress >= 100 && !loaderState.hidden) {
      completeLoading();
    }
  }
  
  /**
   * Met à jour l'affichage de la progression
   */
  function updateProgress(progress) {
    if (!loaderProgressBar || loaderState.hidden) return;
    
    // Arrondir à l'entier le plus proche pour éviter les mises à jour inutiles
    progress = Math.round(progress);
    
    // Ne mettre à jour que si la nouvelle valeur est supérieure
    if (progress > loaderState.progress) {
      loaderState.progress = progress;
      loaderProgressBar.style.width = `${progress}%`;
    }
  }
  
  /**
   * Finalise le chargement et masque le loader
   */
  function completeLoading() {
    if (loaderState.hidden) return;
    loaderState.hidden = true;
    
    console.log('Finalisation du chargement');
    
    // Assurer que la barre est à 100%
    updateProgress(100);
    
    // Attendre un court instant avant de masquer
    setTimeout(() => {
      hideLoader();
    }, 300);
  }
  
  /**
   * Cache le loader avec animation de transition
   */
  export function hideLoader() {
    if (!loaderOverlay || loaderState.hidden) return;
    
    console.log('Masquage du loader');
    
    // Assurer que la transition sera appliquée
    requestAnimationFrame(() => {
      loaderOverlay.style.opacity = '0';
    
      // Attendre la fin de l'animation avant de masquer
      setTimeout(() => {
        loaderOverlay.style.display = 'none';
        document.body.style.overflow = '';
        
        // Déclencher l'événement
        document.dispatchEvent(new CustomEvent('loaderComplete'));
        console.log('Loader masqué, événement loaderComplete déclenché');
      }, 500);
    });
  }