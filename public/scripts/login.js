const email = document.getElementById('email');
const password = document.getElementById('password');
const submitButton = document.querySelector('button[type="submit"]');

const errorHTML = `<span class="usa-error-message"><i class="fas fa-exclamation-circle"></i> This is a required section</span>`;
const successHTML = `<span class="usa-success-message"><i class="fas fa-check-circle"></i> Success</span>`;

function isValidEmail() {
  const emailParts = email.value.split('@');
  return email.value !== '' && emailParts.length === 2;
}

function isValidPassword() {
  return password.value !== '';
}

function isValid() {
  return isValidEmail() && isValidPassword();
}

function onFocus(event) {
  const input = event.target;
  const label = input.previousElementSibling;
  label.classList.add('usa-label--focused');
}

function validate(input, label, validator) {
  if (validator()) {
    // if previously in error, show success
    if (input.classList.contains('usa-input--error')) {
      label.classList.remove('usa-label--error');
      input.classList.remove('usa-input--error');
      input.nextElementSibling.remove();
      label.classList.add('usa-label--success');
      input.classList.add('usa-input--success');
      input.insertAdjacentHTML('afterend', successHTML);
    }
  } else {
    // show error
    label.classList.remove('usa-label--success');
    input.classList.remove('usa-input--success');
    if (input.nextElementSibling) {
      input.nextElementSibling.remove();
    }
    label.classList.add('usa-label--error');
    input.classList.add('usa-input--error');
    input.insertAdjacentHTML('afterend', errorHTML);
  }
}

function onInput(validator) {
  return function onInputInternal(event) {
    const input = event.target;
    const label = input.previousElementSibling;
    // validate on input only if was already previously in error/success
    if (input.classList.contains('usa-input--error') || input.classList.contains('usa-input--success')) {
      validate(input, label, validator);
    }
    // validate form overall for submit button
    submitButton.disabled = !isValid();
  };
}

function onBlur(validator) {
  return function onBlurInternal(event) {
    const input = event.target;
    const label = input.previousElementSibling;
    label.classList.remove('usa-label--focused');
    validate(input, label, validator);
    submitButton.disabled = !isValid();
  };
}

email.addEventListener('focus', onFocus);
email.addEventListener('input', onInput(isValidEmail));
email.addEventListener('blur', onBlur(isValidEmail));

password.addEventListener('focus', onFocus);
password.addEventListener('input', onInput(isValidPassword));
password.addEventListener('blur', onBlur(isValidPassword));
