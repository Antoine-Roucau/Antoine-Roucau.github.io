/**
 * Module de validation du formulaire de contact
 */

// Espace de noms global
var APP = APP || {};
APP.components = APP.components || {};

// Module de validation de formulaire
APP.components.FormValidation = (function() {
  /**
   * Initialise la validation du formulaire de contact
   */
  function init() {
    var contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      // Validation à la soumission
      contactForm.addEventListener('submit', handleFormSubmit);
      
      // Validation en temps réel
      initRealTimeValidation(contactForm);
    }
  }
  
  /**
   * Gestionnaire de soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    var formData = new FormData(e.target);
    var formValues = {};
    
    // Convertir FormData en objet
    formData.forEach(function(value, key) {
      formValues[key] = value;
    });
    
    // Valider le formulaire
    var errors = validateForm(formValues);
    
    // Afficher les erreurs ou soumettre le formulaire
    if (Object.keys(errors).length === 0) {
      // La validation est réussie, laisser le gestionnaire contactForm prendre le relais
      return true;
    } else {
      displayFormErrors(e.target, errors);
      return false;
    }
  }
  
  /**
   * Initialise la validation en temps réel
   * @param {HTMLFormElement} form - Formulaire à valider
   */
  function initRealTimeValidation(form) {
    var formInputs = form.querySelectorAll('input, textarea');
    
    formInputs.forEach(function(input) {
      // Valider à chaque changement
      input.addEventListener('input', function() {
        // Effacer l'erreur précédente
        clearInputError(input);
        
        // Valider le champ
        if (input.value.trim()) {
          var fieldName = input.name;
          var fieldValue = input.value;
          
          // Vérifications spécifiques
          switch (fieldName) {
            case 'email':
              if (!isValidEmail(fieldValue)) {
                displayInputError(input, 'Veuillez saisir une adresse email valide');
              }
              break;
            case 'message':
              if (fieldValue.length < 10) {
                displayInputError(input, 'Le message doit contenir au moins 10 caractères');
              }
              break;
          }
        } else if (input.hasAttribute('required')) {
          displayInputError(input, 'Ce champ est requis');
        }
      });
      
      // Valider au focus perdu
      input.addEventListener('blur', function() {
        if (input.hasAttribute('required') && !input.value.trim()) {
          displayInputError(input, 'Ce champ est requis');
        }
      });
    });
  }
  
  /**
   * Valide le formulaire
   * @param {Object} values - Valeurs du formulaire
   * @returns {Object} - Erreurs de validation
   */
  function validateForm(values) {
    var errors = {};
    
    // Validation du nom
    if (!values.name || !values.name.trim()) {
      errors.name = 'Veuillez saisir votre nom';
    }
    
    // Validation de l'email
    if (!values.email || !values.email.trim()) {
      errors.email = 'Veuillez saisir votre email';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Veuillez saisir une adresse email valide';
    }
    
    // Validation du sujet
    if (!values.subject || !values.subject.trim()) {
      errors.subject = 'Veuillez saisir un sujet';
    }
    
    // Validation du message
    if (!values.message || !values.message.trim()) {
      errors.message = 'Veuillez saisir votre message';
    } else if (values.message.trim().length < 10) {
      errors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    return errors;
  }
  
  /**
   * Vérifie si une adresse email est valide
   * @param {string} email - Adresse email à valider
   * @returns {boolean} - True si l'email est valide
   */
  function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Affiche les erreurs de validation
   * @param {HTMLFormElement} form - Formulaire
   * @param {Object} errors - Erreurs de validation
   */
  function displayFormErrors(form, errors) {
    // Réinitialiser les erreurs précédentes
    clearFormErrors(form);
    
    // Afficher les nouvelles erreurs
    for (var field in errors) {
      if (errors.hasOwnProperty(field)) {
        var input = form.querySelector('[name="' + field + '"]');
        if (input) {
          displayInputError(input, errors[field]);
        }
      }
    }
    
    // Faire défiler jusqu'à la première erreur
    var firstErrorField = form.querySelector('.error');
    if (firstErrorField) {
      firstErrorField.focus();
    }
  }
  
  /**
   * Affiche une erreur pour un champ spécifique
   * @param {HTMLElement} input - Élément de formulaire
   * @param {string} message - Message d'erreur
   */
  function displayInputError(input, message) {
    input.classList.add('error');
    
    // Créer le message d'erreur
    var errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Ajouter après l'input
    input.parentNode.appendChild(errorElement);
  }
  
  /**
   * Efface une erreur pour un champ spécifique
   * @param {HTMLElement} input - Élément de formulaire
   */
  function clearInputError(input) {
    input.classList.remove('error');
    
    // Supprimer le message d'erreur
    var errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  /**
   * Efface toutes les erreurs d'un formulaire
   * @param {HTMLFormElement} form - Formulaire
   */
  function clearFormErrors(form) {
    // Supprimer les classes d'erreur
    var errorInputs = form.querySelectorAll('.error');
    for (var i = 0; i < errorInputs.length; i++) {
      errorInputs[i].classList.remove('error');
    }
    
    // Supprimer les messages d'erreur
    var errorMessages = form.querySelectorAll('.error-message');
    for (var j = 0; j < errorMessages.length; j++) {
      errorMessages[j].remove();
    }
  }
  
  // API publique
  return {
    init: init
  };
})();