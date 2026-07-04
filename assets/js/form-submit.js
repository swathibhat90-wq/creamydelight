/**
* Formspree-compatible AJAX form submission
* Replaces the old PHP Email Form library (removed - GitHub Pages can't run PHP)
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let action = form.getAttribute('action');

      if (!action || action.includes('YOUR_FORM_ID')) {
        displayError(form, 'The contact form is not connected yet. Set up a Formspree endpoint and update the form action.');
        return;
      }

      form.querySelector('.loading').classList.add('d-block');
      form.querySelector('.error-message').classList.remove('d-block');
      form.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(form);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then(data => {
            let message = (data && data.errors)
              ? data.errors.map(e => e.message).join(', ')
              : 'Form submission failed. Please try again.';
            throw new Error(message);
          });
        })
        .then(() => {
          form.querySelector('.loading').classList.remove('d-block');
          form.querySelector('.sent-message').classList.add('d-block');
          form.reset();
        })
        .catch(error => {
          displayError(form, error.message || error);
        });
    });
  });

  function displayError(form, error) {
    form.querySelector('.loading').classList.remove('d-block');
    form.querySelector('.error-message').innerHTML = error;
    form.querySelector('.error-message').classList.add('d-block');
  }

})();
