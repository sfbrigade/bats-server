const loginBtn = document.getElementById("login_submit");
const passwordErrorMessage = document.getElementById('password-error-message');
const passwordMessageSuccess = document.getElementById('password_message_success');
const passwordLabel = document.getElementById('password-label');
const password = document.getElementById("password");



function checkPassword() {

    if (password.value === "") {
        password.classList.add('password_error');
        passwordErrorMessage.classList.remove('password_message');
        passwordErrorMessage.classList.remove('passwordMessageSuccess');
        passwordErrorMessage.classList.add('password_message_error');
    }
    if (password.value !== "") {
        password.classList.add('success');
        passwordMessageSuccess.classList.remove('password_message');
        passwordErrorMessage.classList.remove('password_message_error');
        passwordErrorMessage.classList.add('password_message');
        passwordMessageSuccess.classList.add('password_message_success');
        passwordLabel.classList.add('password-label');
        document.getElementById("login_submit").style.backgroundColor = null;
        document.getElementById("login_submit").style.backgroundColor = "blue";
    }

}
password.addEventListener('input', checkPassword);
loginBtn.addEventListener("click", checkPassword);

const email = document.getElementById("email");
const emailLabel = document.getElementById("email-label");


function checkEmail() {
    const emailParts = email.value.split('@');
    if (email.value !== '' && emailParts.length === 2) {
        email.classList.add('email_populated');
        emailLabel.classList.add('email_label_valid');
    }

}

email.addEventListener("input", checkEmail);