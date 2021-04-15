const loginBtn = document.getElementById('login_submit');
const passwordErrorMessage = document.getElementById('password_error_message');
const passwordMessageSuccess = document.getElementById('password_message_success');
const passwordLabel = document.getElementById('password-label');
const password = document.getElementById('password');

function checkPassword() {
  if (password.value === '') {
    password.classList.add('password_error');
    password.classList.remove('success');

    passwordErrorMessage.classList.add('password_message_error');
    passwordErrorMessage.classList.remove('password_message');
    passwordErrorMessage.classList.remove('password_message_success');
    
    passwordMessageSuccess.classList.remove('password_message_success');
    passwordMessageSuccess.classList.add('password_message');

    passwordLabel.classList.remove('password-label-success');
    passwordLabel.classList.add('password-label-error');

    loginBtn.classList.remove('submitable');
    loginBtn.classList.add('not-submitable');
  }
  if (password.value !== '') {
    password.classList.add('success');

    passwordMessageSuccess.classList.remove('password_message');
    passwordMessageSuccess.classList.add('password_message_success');

    passwordErrorMessage.classList.remove('password_message_error');
    passwordErrorMessage.classList.add('password_message');
    
    passwordLabel.classList.remove('password-label-error');
    passwordLabel.classList.add('password-label-success');
    
    loginBtn.classList.remove('not-submitable');
    loginBtn.classList.add('submitable');
  }
}
password.addEventListener('change', checkPassword);
loginBtn.addEventListener('click', checkPassword);

const email = document.getElementById('email');
const emailLabel = document.getElementById('email-label');

function checkEmail() {
  const emailParts = email.value.split('@');
  if (email.value !== '' && emailParts.length === 2) {
    email.classList.add('email_populated');
    emailLabel.classList.add('email_label_valid');
  }
}

email.addEventListener('input', checkEmail);
