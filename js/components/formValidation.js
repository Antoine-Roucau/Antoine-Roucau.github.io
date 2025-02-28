/**
 * Module de validation du formulaire de contact
 */

/**
 * Initialise la validation du formulaire de contact
 */
export function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
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
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    
    // Valider le formulaire
    const errors = validateForm(formValues);
    
    // Afficher les erreurs ou soumettre le formulaire
    if (Object.keys(errors).length === 0) {
        submitForm(e.target, formValues);
    } else {
        displayFormErrors(e.target, errors);
    }
}

/**
 * Initialise la validation en temps réel
 * @param {HTMLFormElement} form - Formulaire à valider
 */
function initRealTimeValidation(form) {
    const formInputs = form.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        // Valider à chaque changement
        input.addEventListener('input', () => {
            // Effacer l'erreur précédente
            clearInputError(input);
            
            // Valider le champ
            if (input.value.trim()) {
                const fieldName = input.name;
                const fieldValue = input.value;
                
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
        input.addEventListener('blur', () => {
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
    const errors = {};
    
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    Object.entries(errors).forEach(([field, message]) => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
            displayInputError(input, message);
        }
    });
    
    // Faire défiler jusqu'à la première erreur
    const firstErrorField = form.querySelector('.error');
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
    const errorElement = document.createElement('div');
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
    const errorElement = input.parentNode.querySelector('.error-message');
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
    form.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    
    // Supprimer les messages d'erreur
    form.querySelectorAll('.error-message').forEach(el => {
        el.remove();
    });
}

/**
 * Soumet le formulaire (simulation)
 * @param {HTMLFormElement} form - Formulaire
 * @param {Object} values - Valeurs du formulaire
 */
function submitForm(form, values) {
    // Changer l'état du bouton
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <span class="btn-text">Envoi en cours...</span>
        <span class="btn-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </span>
    `;
    submitBtn.disabled = true;
    
    // Simuler un délai d'envoi
    setTimeout(() => {
        // En production, remplacer par un vrai envoi de formulaire
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(values)
        // })
        
        // Afficher un message de succès
        form.innerHTML = `
            <div class="form-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h3>Message envoyé avec succès!</h3>
                <p>Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
            </div>
        `;
        
        // Stocker les informations de contact dans localStorage
        localStorage.setItem('lastContact', JSON.stringify({
            name: values.name,
            email: values.email,
            date: new Date().toISOString()
        }));
    }, 2000);
}