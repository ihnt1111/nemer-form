import { ctx } from './context.js';
import {
    MAX_ABOUT, MAX_NAME, MAX_EMAIL, EMAIL_REGEX,
    PHONE_MIN, PHONE_MAX,
} from './constants.js';
import { showError, clearError } from './errors.js';

const simpleValidators = {
    first_name:  (value) => value.trim().length > 0 && value.length <= MAX_NAME,
    last_name:   (value) => value.trim().length > 0 && value.length <= MAX_NAME,
    middle_name: (value) => value === '' || value.length <= MAX_NAME,
    email:       (value) => {
        const v = value.trim();
        if (v === '') return true;
        return v.length <= MAX_EMAIL && EMAIL_REGEX.test(v);
    },
};

const simpleMessages = {
    first_name:  'Imię jest wymagane (maks. 100 znaków).',
    last_name:   'Nazwisko jest wymagane (maks. 100 znaków).',
    middle_name: 'Drugie imię może mieć maks. 100 znaków.',
    email:       'Nieprawidłowy adres e-mail (maks. 255 znaków).',
};

export function validateSimple(field) {
    const name = field.name;
    const validator = simpleValidators[name];
    if (!validator) return true;

    if (validator(field.value)) {
        clearError(field);
        return true;
    }
    showError(field, simpleMessages[name] || 'Błąd');
    return false;
}

export function validateAbout() {
    if (!ctx.aboutField) return true;

    if (ctx.aboutField.value.length > MAX_ABOUT) {
        showError(ctx.aboutField, 'Nie więcej niż 1000 znaków.');
        return false;
    }
    clearError(ctx.aboutField);
    return true;
}

export function validateBirthDate() {
    const field = ctx.form.querySelector('[name="birth_date"]');
    if (!field) return false;

    const value = field.value;

    if (value === '') {
        clearError(field);
        return false;
    }

    const [y, m, d] = value.split('-').map(Number);
    const selected = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected >= today) {
        showError(field, 'Data urodzenia musi być z przeszłości.');
        return false;
    }

    clearError(field);
    return true;
}

export function validatePhone(input) {
    const value = input.value.trim();
    const row = input.closest('.phone-row');
    if (!row) return true;

    const clearRowError = () => {
        row.classList.remove('is-invalid');
        const next = row.nextElementSibling;
        if (next && next.classList.contains('field-error')) next.remove();
    };

    if (value === '') {
        clearRowError();
        return true;
    }

    if (value.length < PHONE_MIN || value.length > PHONE_MAX) {
        row.classList.add('is-invalid');

        let error = row.nextElementSibling;
        if (!error || !error.classList.contains('field-error')) {
            error = document.createElement('div');
            error.className = 'field-error';
            row.parentElement.insertBefore(error, row.nextElementSibling);
        }
        error.textContent = 'Nieprawidłowy numer telefonu.';
        return false;
    }

    clearRowError();
    return true;
}

export function initValidation({ updateSubmit, onEmailInput }) {
    // names — strip digits on input
    ['first_name', 'last_name', 'middle_name'].forEach((name) => {
        const field = ctx.form.querySelector('[name="' + name + '"]');
        if (!field) return;

        field.addEventListener('input', () => {
            field.value = field.value.replace(/[0-9]/g, '');
        });
    });

    // text / email — validate on blur, revalidate on input if invalid
    ['first_name', 'last_name', 'middle_name', 'email'].forEach((name) => {
        const field = ctx.form.querySelector('[name="' + name + '"]');
        if (!field) return;

        field.addEventListener('blur', () => {
            validateSimple(field);
            updateSubmit();
        });
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) validateSimple(field);
            if (name === 'email') onEmailInput();
            updateSubmit();
        });
    });

    // about
    if (ctx.aboutField) {
        ctx.aboutField.addEventListener('blur', () => {
            validateAbout();
            updateSubmit();
        });
        ctx.aboutField.addEventListener('input', () => {
            if (ctx.aboutField.value.length > MAX_ABOUT || ctx.aboutField.classList.contains('is-invalid')) {
                validateAbout();
            }
            updateSubmit();
        });
    }

    // date
    const birthDateField = ctx.form.querySelector('[name="birth_date"]');
    if (birthDateField) {
        birthDateField.addEventListener('change', () => {
            validateBirthDate();
            updateSubmit();
        });
        birthDateField.addEventListener('blur', () => {
            validateBirthDate();
            updateSubmit();
        });
        birthDateField.addEventListener('input', () => {
            if (birthDateField.classList.contains('is-invalid') || birthDateField.value !== '') {
                validateBirthDate();
            } else {
                clearError(birthDateField);
            }
            updateSubmit();
        });
    }

    // phones — filter digits, focusout validate
    if (ctx.wrapper) {
        ctx.wrapper.addEventListener('input', (e) => {
            const input = e.target;
            if (!input.name || !input.name.includes('[phone]')) return;

            input.value = input.value.replace(/\D/g, '');

            const row = input.closest('.phone-row');
            if (row && row.classList.contains('is-invalid')) {
                validatePhone(input);
            }
            onEmailInput();
            updateSubmit();
        });

        ctx.wrapper.addEventListener('focusout', (e) => {
            const input = e.target;
            if (!input.name || !input.name.includes('[phone]')) return;
            validatePhone(input);
            updateSubmit();
        });
    }
}