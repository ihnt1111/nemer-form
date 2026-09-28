import { ctx } from './context.js';
import { MAX_ABOUT, MAX_NAME } from './constants.js';
import { hasValidEmailOrPhone } from './emailOrPhone.js';

export function isFormValid() {
    const firstName = ctx.form.querySelector('[name="first_name"]');
    const lastName  = ctx.form.querySelector('[name="last_name"]');
    const birthDate = ctx.form.querySelector('[name="birth_date"]');
    const agreed    = ctx.form.querySelector('[name="agreed_to_rules"]');

    if (!firstName || firstName.value.trim() === '' || firstName.value.length > MAX_NAME) return false;
    if (!lastName || lastName.value.trim() === '' || lastName.value.length > MAX_NAME) return false;

    if (!birthDate || birthDate.value === '') return false;
    {
        const [y, m, d] = birthDate.value.split('-').map(Number);
        const selected = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected >= today) return false;
    }

    if (!agreed || !agreed.checked) return false;

    if (ctx.aboutField && ctx.aboutField.value.length > MAX_ABOUT) return false;

    if (!hasValidEmailOrPhone()) return false;

    return true;
}

export function updateSubmitButton() {
    if (!ctx.submitBtn) return;
    ctx.submitBtn.disabled = !isFormValid();
    updateEmailPhoneHint();
}

export function updateEmailPhoneHint() {
    const hint = document.getElementById('email-phone-hint');
    if (!hint) return;

    hint.style.display = hasValidEmailOrPhone() ? 'none' : '';
}

export function initSubmitButton() {
    const agreedField = ctx.form.querySelector('[name="agreed_to_rules"]');
    if (agreedField) {
        agreedField.addEventListener('change', updateSubmitButton);
    }
}