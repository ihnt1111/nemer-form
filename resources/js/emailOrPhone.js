import { ctx } from './context.js';
import { MAX_EMAIL, PHONE_MIN, PHONE_MAX, EMAIL_REGEX } from './constants.js';

export function hasValidEmailOrPhone() {
    const emailInput = ctx.form.querySelector('[name="email"]');
    const emailValid = emailInput &&
        emailInput.value.trim() !== '' &&
        emailInput.value.trim().length <= MAX_EMAIL &&
        EMAIL_REGEX.test(emailInput.value.trim());

    const phoneInputs = ctx.wrapper ? ctx.wrapper.querySelectorAll('input[name*="[phone]"]') : [];
    const anyPhoneValid = Array.from(phoneInputs).some(inp => {
        const v = inp.value.trim();
        return v !== '' && v.length >= PHONE_MIN && v.length <= PHONE_MAX;
    });

    return emailValid || anyPhoneValid;
}

export function showEmailOrPhoneErrors() {
    const emailInput = ctx.form.querySelector('[name="email"]');
    const emailBlock = emailInput.parentElement;

    let emailErr = emailBlock.querySelector('.field-error[data-for="email-or-phone"]');
    if (!emailErr) {
        emailErr = document.createElement('div');
        emailErr.className = 'field-error';
        emailErr.dataset.for = 'email-or-phone';
        emailErr.textContent = 'Podaj e-mail.';
        emailBlock.appendChild(emailErr);
    }

    if (ctx.wrapper) {
        const phoneBlock = ctx.wrapper.parentElement;
        let phoneErr = phoneBlock.querySelector('.field-error[data-for="phone-or-email"]');
        if (!phoneErr) {
            phoneErr = document.createElement('div');
            phoneErr.className = 'field-error';
            phoneErr.dataset.for = 'phone-or-email';
            phoneErr.textContent = 'Podaj numer telefonu.';
            phoneBlock.appendChild(phoneErr);
        }
    }
}

export function clearEmailOrPhoneErrors() {
    const emailInput = ctx.form.querySelector('[name="email"]');
    if (emailInput) {
        const err = emailInput.parentElement.querySelector('.field-error[data-for="email-or-phone"]');
        if (err) err.remove();
    }
    if (ctx.wrapper) {
        const err = ctx.wrapper.parentElement.querySelector('.field-error[data-for="phone-or-email"]');
        if (err) err.remove();
    }
}

export function maybeClearEmailOrPhoneErrors() {
    if (hasValidEmailOrPhone()) {
        clearEmailOrPhoneErrors();
    }
}