const loginForm = document.getElementById('login');
const email = document.getElementById('email');
const password = document.getElementById('password');
const submitButton = document.querySelector('button[type="submit"]');

const errorHTML = `<span class="usa-error-message"><i class="fas fa-exclamation-circle"></i> This is a required field</span>`;
const inputErrorClass = 'usa-input--error';
const labelErrorClass = 'usa-label--error';

function isValid() {
  return email.value && password.value;
}

function updateErrorState(input) {
  const label = input.previousElementSibling;
  if (input.value) {
    // if previously in error, remove that state
    if (input.classList.contains(inputErrorClass)) {
      label.classList.remove(labelErrorClass);
      input.classList.remove(inputErrorClass);
      input.nextElementSibling.remove();
    }
  } else {
    // show error
    if (input.nextElementSibling) {
      input.nextElementSibling.remove();
    }
    label.classList.add(labelErrorClass);
    input.classList.add(inputErrorClass);
    input.insertAdjacentHTML('afterend', errorHTML);
  }
}

function handleValidationEvent(event) {
  const input = event.target;
  const label = input.previousElementSibling;
  // update the label's focused state
  label.classList[event.type === 'blur' ? 'remove' : 'add']('usa-label--focused');
  // update the class on input event only if the element is in the error state
  if (event.type === 'blur' || (event.type === 'input' && input.classList.contains(inputErrorClass))) {
    updateErrorState(input);
  }
  // validate form overall for submit button
  submitButton.disabled = !isValid();
}

function onSubmit(event) {
  if (!isValid()) {
    updateErrorState(email);
    updateErrorState(password);
    submitButton.disabled = true;
    event.preventDefault();
  }
}

[email, password].forEach((el) => {
  ['focus', 'input', 'blur'].forEach((type) => {
    el.addEventListener(type, handleValidationEvent);
  });
});

loginForm.addEventListener('submit', onSubmit);
