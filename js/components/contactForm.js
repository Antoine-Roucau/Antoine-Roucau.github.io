/**
 * Module d'envoi du formulaire de contact
 */

/**
 * Initialise l'envoi du formulaire de contact
 */
export function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * Gestionnaire de soumission du formulaire
 * @param {Event} e - Événement de soumission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Récupérer le formulaire et le bouton de soumission
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    // Changer l'état du bouton
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="btn-text">Envoi en cours...</span>
        <span class="btn-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </span>
    `;
    
    try {
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        
        // En production, remplacer par un vrai appel API
        // const response = await sendContactForm(formValues);
        
        // Simuler un envoi réussi
        await simulateFormSubmission(formValues);
        
        // Afficher le message de succès
        displaySuccessMessage(form);
        
        // Stocker les informations de contact
        storeContactInfo(formValues);
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de l\'envoi du formulaire:', error);
        
        // Réinitialiser le bouton
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        
        // Afficher le message d'erreur
        displayErrorMessage(form, error.message || 'Une erreur est survenue lors de l\'envoi du message.');
    }
}

/**
 * Simule l'envoi du formulaire (pour démonstration)
 * @param {Object} formData - Données du formulaire
 * @returns {Promise} - Promise résolue après le délai
 */
function simulateFormSubmission(formData) {
    return new Promise((resolve) => {
        // Simuler un délai d'envoi
        setTimeout(() => {
            console.log('Données du formulaire (simulation):', formData);
            resolve({ success: true });
        }, 2000);
    });
}

/**
 * Envoie le formulaire de contact à un service externe
 * @param {Object} formData - Données du formulaire
 * @returns {Promise} - Promise avec la réponse
 */
async function sendContactForm(formData) {
    try {
        // Exemple avec Formspree (à adapter selon votre service)
        const response = await fetch('https://formspree.io/f/votre-id-formspree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Erreur lors de l\'envoi du formulaire');
        }
        
        return result;
    } catch (error) {
        console.error('Erreur d\'envoi:', error);
        throw error;
    }
}

/**
 * Affiche un message de succès après l'envoi
 * @param {HTMLFormElement} form - Formulaire
 */
function displaySuccessMessage(form) {
    // Créer le message de succès
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <h3>Message envoyé avec succès!</h3>
        <p>Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
    `;
    
    // Remplacer le formulaire par le message
    form.parentNode.replaceChild(successMessage, form);
}

/**
 * Affiche un message d'erreur
 * @param {HTMLFormElement} form - Formulaire
 * @param {string} errorMessage - Message d'erreur
 */
function displayErrorMessage(form, errorMessage) {
    // Supprimer les messages d'erreur existants
    const existingError = form.querySelector('.form-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Créer le message d'erreur
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error-message';
    errorElement.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p>${errorMessage}</p>
    `;
    
    // Insérer le message au-dessus du formulaire
    form.insertAdjacentElement('beforebegin', errorElement);
}

/**
 * Stocke les informations de contact
 * @param {Object} formData - Données du formulaire
 */
function storeContactInfo(formData) {
    try {
        localStorage.setItem('lastContact', JSON.stringify({
            name: formData.name,
            email: formData.email,
            date: new Date().toISOString()
        }));
    } catch (error) {
        console.warn('Impossible de stocker les informations de contact:', error);
    }
}