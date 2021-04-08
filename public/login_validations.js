let login_btn = document.getElementById("login_submit");
let password_error_message = document.getElementById('password_error_message');
let password_message_success = document.getElementById('password_message_success');
let password_label = document.getElementById('password-label');
let password = document.getElementById("password");

password.addEventListener('input', checkPassword);
login_btn.addEventListener("click", checkPassword);

function checkPassword() {

    if (password.value === "") {
        password.classList.add('password_error');
        password_error_message.classList.remove('password_message');
        password_error_message.classList.remove('password_message_success');
        password_error_message.classList.add('password_message_error');
    }
    if (password.value !== "") {
        password.classList.add('success');
        password_message_success.classList.remove('password_message');
        password_error_message.classList.remove('password_message_error');
        password_error_message.classList.add('password_message');
        password_message_success.classList.add('password_message_success');
        password_label.classList.add('password-label');
        document.getElementById("login_submit").style.backgroundColor = null;
        document.getElementById("login_submit").style.backgroundColor = "blue";
    }

}

let email = document.getElementById("email");
let email_label = document.getElementById("email-label");
email.addEventListener("input", checkEmail);

function checkEmail() {
    let email_parts = email.value.split('@');
    if (email.value !== '' && email_parts.length === 2) {
        email.classList.add('email_populated');
        email_label.classList.add('email_label_valid');
    }

}