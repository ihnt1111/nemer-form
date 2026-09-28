import { ctx } from './context.js';
import { MAX_EMAIL, PHONE_MIN, PHONE_MAX, EMAIL_REGEX } from './constants.js';
import { createPhoneRow, reindexPhones, updateAddButton } from './phones.js';
import { clearError } from './errors.js';
import {
    hasValidEmailOrPhone,
    showEmailOrPhoneErrors,
    clearEmailOrPhoneErrors,
} from './emailOrPhone.js';
import { updateSubmitButton } from './submitButton.js';

export function initSubmit() {
    ctx.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // remove invalid phone rows (won't reach DB)
        if (ctx.wrapper) {
            const phoneInputs = ctx.wrapper.querySelectorAll('input[name*="[phone]"]');
            phoneInputs.forEach((input) => {
                const val = input.value.trim();
                if (val !== '' && (val.length < PHONE_MIN || val.length > PHONE_MAX)) {
                    const row = input.closest('.phone-row');
                    if (row) {
                        const error = row.nextElementSibling;
                        if (error && error.classList.contains('field-error')) error.remove();
                        row.remove();
                    }
                }
            });
            if (ctx.wrapper.querySelectorAll('.phone-row').length === 0) {
                ctx.wrapper.appendChild(createPhoneRow(0));
            }
            reindexPhones();
            updateAddButton();
        }

        // clear invalid email (won't reach DB)
        const emailInput = ctx.form.querySelector('[name="email"]');
        if (emailInput && emailInput.value.trim() !== '') {
            const v = emailInput.value.trim();
            if (v.length > MAX_EMAIL || !EMAIL_REGEX.test(v)) {
                emailInput.value = '';
                clearError(emailInput);
            }
        }

        // safety net: button might have been force-enabled via DevTools
        if (!hasValidEmailOrPhone()) {
            if (emailInput) emailInput.value = '';
            showEmailOrPhoneErrors();
            updateSubmitButton();
            return;
        }

        clearEmailOrPhoneErrors();

        // send
        ctx.submitBtn.disabled = true;

        try {
            const response = await fetch(ctx.form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new FormData(ctx.form),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    showSuccessModal();

                    // reload page after modal is closed — form returns to initial state
                    const modalEl = document.getElementById('successModal');
                    if (modalEl) {
                        modalEl.addEventListener('hidden.bs.modal', () => {
                            window.location.reload();
                        }, { once: true });
                    }
                } else {
                    updateSubmitButton();
                }
                return;
            }

            if (response.status === 422) {
                const data = await response.json();
                showServerErrors(data.errors || {});
                updateSubmitButton();
                return;
            }

            alert('Wystąpił błąd serwera. Spróbuj ponownie.');
            updateSubmitButton();

        } catch (err) {
            console.error(err);
            alert('Wystąpił błąd połączenia. Spróbuj ponownie.');
            updateSubmitButton();
        }
    });
}

function showSuccessModal() {
    const modalEl = document.getElementById('successModal');
    if (!modalEl) return;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

function showServerErrors(errors) {
    ctx.form.querySelectorAll('.field-error[data-server]').forEach(el => el.remove());

    Object.entries(errors).forEach(([key, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;

        if (key.startsWith('phones.')) {
            const parts = key.split('.');
            if (parts.length === 3 && parts[2] === 'phone') {
                const idx = parts[1];
                const field = ctx.form.querySelector(`[name="phones[${idx}][phone]"]`);
                if (field) {
                    const row = field.closest('.phone-row');
                    if (row) {
                        row.classList.add('is-invalid');
                        const err = document.createElement('div');
                        err.className = 'field-error';
                        err.dataset.server = '1';
                        err.textContent = message;
                        row.parentElement.insertBefore(err, row.nextElementSibling);
                    }
                }
            }
            return;
        }

        const field = ctx.form.querySelector(`[name="${key}"]`);
        if (!field) return;

        const container = field.closest('.phone-row') || field;
        container.classList.add('is-invalid');

        const err = document.createElement('div');
        err.className = 'field-error';
        err.dataset.server = '1';
        err.textContent = message;
        container.parentElement.insertBefore(err, container.nextElementSibling);
    });
}