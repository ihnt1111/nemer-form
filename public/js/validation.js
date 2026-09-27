console.log('validation.js loaded');

//* CONSTANTS

const MAX_PHONES = 6;
const MAX_ABOUT = 1000;
const PHONE_MIN = 6;
const PHONE_MAX = 15;
const MAX_NAME = 100;
const MAX_EMAIL = 255;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('survey-form');
    if (!form) return;

    const wrapper = document.getElementById('phones-wrapper');
    const addBtn = document.getElementById('add-phone');
    const submitBtn = document.getElementById('submit-btn');

    //* PREVENT ENTER

    form.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'textarea' || tag === 'button') return;
        e.preventDefault();
    });

    //* PHONES
    // add / remove rows

    if (addBtn && wrapper) {
        addBtn.addEventListener('click', () => {
            const count = wrapper.querySelectorAll('.phone-row').length;
            if (count >= MAX_PHONES) return;
            wrapper.appendChild(createPhoneRow(count));
            updateAddButton();
            updateSubmitButton();
        });
    }

    if (wrapper) {
        wrapper.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-phone');
            if (!btn) return;

            const row = btn.closest('.phone-row');
            if (!row) return;

            const rows = wrapper.querySelectorAll('.phone-row');

            // keep at least one row — just clear it instead of removing
            if (rows.length <= 1) {
                const input = row.querySelector('input[name*="[phone]"]');
                if (input) input.value = '';

                const select = row.querySelector('select');
                if (select) select.selectedIndex = 0;

                row.classList.remove('is-invalid');
                const err = row.nextElementSibling;
                if (err && err.classList.contains('field-error')) err.remove();

                updateSubmitButton();
                return;
            }

            const error = row.nextElementSibling;
            if (error && error.classList.contains('field-error')) {
                error.remove();
            }
            row.remove();
            reindexPhones();
            updateAddButton();
            updateSubmitButton();
        });
    }

    function createPhoneRow(index) {
        const row = document.createElement('div');
        row.className = 'phone-row d-flex align-items-center gap-2 mb-2';
        row.innerHTML = `
            <select name="phones[${index}][country_code]" class="form-select form-control-underline phone-code">
                <option value="+48">+48</option>
                <option value="+44">+44</option>
                <option value="+49">+49</option>
            </select>
            <input type="tel" name="phones[${index}][phone]" value="" placeholder="123456789"
                   class="form-control form-control-underline" maxlength="15">
            <button type="button" class="btn-remove-phone" aria-label="Usuń telefon">
                <i class="bi bi-dash-lg"></i>
            </button>
        `;
        return row;
    }

    function reindexPhones() {
        const rows = wrapper.querySelectorAll('.phone-row');
        rows.forEach((row, i) => {
            const select = row.querySelector('select[name*="[country_code]"]');
            const input = row.querySelector('input[name*="[phone]"]');
            if (select) select.name = `phones[${i}][country_code]`;
            if (input) input.name = `phones[${i}][phone]`;
        });
    }

    function updateAddButton() {
        if (!addBtn) return;
        const count = wrapper.querySelectorAll('.phone-row').length;
        addBtn.style.display = count >= MAX_PHONES ? 'none' : '';
    }

    //* TEXTAREA
    // auto-grow

    const aboutField = document.getElementById('about');

    if (aboutField) {
        const autoGrow = () => {
            const computed = getComputedStyle(aboutField);
            const minHeight = parseFloat(computed.minHeight);
            const maxHeight = parseFloat(computed.maxHeight);

            aboutField.style.height = 'auto';
            let next = aboutField.scrollHeight;
            if (next < minHeight) next = minHeight;

            if (next >= maxHeight) {
                aboutField.style.height = maxHeight + 'px';
                aboutField.style.overflowY = 'auto';
            } else {
                aboutField.style.height = next + 'px';
                aboutField.style.overflowY = 'hidden';
            }
        };

        aboutField.addEventListener('input', autoGrow);
        window.addEventListener('resize', autoGrow);
        autoGrow();
    }

    //* VALIDATION
    // helpers

    function showError(field, message) {
        field.classList.add('is-invalid');

        const container = field.closest('.phone-row') || field;

        const old = container.parentElement.querySelector(
            '.field-error[data-for="' + field.name + '"]'
        );
        if (old) old.remove();

        const error = document.createElement('div');
        error.className = 'field-error';
        error.dataset.for = field.name;
        error.textContent = message;
        container.parentElement.insertBefore(error, container.nextElementSibling);
    }

    function clearError(field) {
        field.classList.remove('is-invalid');

        const container = field.closest('.phone-row') || field;
        const error = container.parentElement.querySelector(
            '.field-error[data-for="' + field.name + '"]'
        );
        if (error) error.remove();
    }

    //* VALIDATION
    // field rules

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

    function validateSimple(field) {
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

    function validateAbout() {
        if (!aboutField) return true;

        if (aboutField.value.length > MAX_ABOUT) {
            showError(aboutField, 'Nie więcej niż 1000 znaków.');
            return false;
        }
        clearError(aboutField);
        return true;
    }

    function validateBirthDate() {
        const field = form.querySelector('[name="birth_date"]');
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

    function validatePhone(input) {
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

    //* VALIDATION
    // listeners

    // names — strip digits on input
    ['first_name', 'last_name', 'middle_name'].forEach((name) => {
        const field = form.querySelector('[name="' + name + '"]');
        if (!field) return;

        field.addEventListener('input', () => {
            field.value = field.value.replace(/[0-9]/g, '');
        });
    });

    // text / email — validate on blur, revalidate on input if invalid
    ['first_name', 'last_name', 'middle_name', 'email'].forEach((name) => {
        const field = form.querySelector('[name="' + name + '"]');
        if (!field) return;

        field.addEventListener('blur', () => {
            validateSimple(field);
            updateSubmitButton();
        });
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) validateSimple(field);
            if (name === 'email') maybeClearEmailOrPhoneErrors();
            updateSubmitButton();
        });
    });

    // about
    if (aboutField) {
        aboutField.addEventListener('blur', () => {
            validateAbout();
            updateSubmitButton();
        });
        aboutField.addEventListener('input', () => {
            if (aboutField.value.length > MAX_ABOUT || aboutField.classList.contains('is-invalid')) {
                validateAbout();
            }
            updateSubmitButton();
        });
    }

    // date
    const birthDateField = form.querySelector('[name="birth_date"]');
    if (birthDateField) {
        birthDateField.addEventListener('change', () => {
            validateBirthDate();
            updateSubmitButton();
        });
        birthDateField.addEventListener('blur', () => {
            validateBirthDate();
            updateSubmitButton();
        });
        birthDateField.addEventListener('input', () => {
            if (birthDateField.classList.contains('is-invalid') || birthDateField.value !== '') {
                validateBirthDate();
            } else {
                clearError(birthDateField);
            }
            updateSubmitButton();
        });
    }

    // phones — filter digits, focusout validate
    if (wrapper) {
        wrapper.addEventListener('input', (e) => {
            const input = e.target;
            if (!input.name || !input.name.includes('[phone]')) return;

            input.value = input.value.replace(/\D/g, '');

            const row = input.closest('.phone-row');
            if (row && row.classList.contains('is-invalid')) {
                validatePhone(input);
            }
            maybeClearEmailOrPhoneErrors();
            updateSubmitButton();
        });

        wrapper.addEventListener('focusout', (e) => {
            const input = e.target;
            if (!input.name || !input.name.includes('[phone]')) return;
            validatePhone(input);
            updateSubmitButton();
        });
    }

    //* SUBMIT BUTTON
    // requires all mandatory fields + valid email OR valid phone

    function hasValidEmailOrPhone() {
        const emailInput = form.querySelector('[name="email"]');
        const emailValid = emailInput &&
            emailInput.value.trim() !== '' &&
            emailInput.value.trim().length <= MAX_EMAIL &&
            EMAIL_REGEX.test(emailInput.value.trim());

        const phoneInputs = wrapper ? wrapper.querySelectorAll('input[name*="[phone]"]') : [];
        const anyPhoneValid = Array.from(phoneInputs).some(inp => {
            const v = inp.value.trim();
            return v !== '' && v.length >= PHONE_MIN && v.length <= PHONE_MAX;
        });

        return emailValid || anyPhoneValid;
    }

    function isFormValid() {
        const firstName = form.querySelector('[name="first_name"]');
        const lastName  = form.querySelector('[name="last_name"]');
        const birthDate = form.querySelector('[name="birth_date"]');
        const agreed    = form.querySelector('[name="agreed_to_rules"]');

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

        if (aboutField && aboutField.value.length > MAX_ABOUT) return false;

        if (!hasValidEmailOrPhone()) return false;

        return true;
    }

    function updateSubmitButton() {
        if (!submitBtn) return;
        submitBtn.disabled = !isFormValid();
        updateEmailPhoneHint();
    }

    function updateEmailPhoneHint() {
        const hint = document.getElementById('email-phone-hint');
        if (!hint) return;

        hint.style.display = hasValidEmailOrPhone() ? 'none' : '';
    }

    const agreedField = form.querySelector('[name="agreed_to_rules"]');
    if (agreedField) {
        agreedField.addEventListener('change', updateSubmitButton);
    }

    //* EMAIL OR PHONE
    // errors shown on submit

    function showEmailOrPhoneErrors() {
        const emailInput = form.querySelector('[name="email"]');
        const emailBlock = emailInput.parentElement;

        let emailErr = emailBlock.querySelector('.field-error[data-for="email-or-phone"]');
        if (!emailErr) {
            emailErr = document.createElement('div');
            emailErr.className = 'field-error';
            emailErr.dataset.for = 'email-or-phone';
            emailErr.textContent = 'Podaj e-mail.';
            emailBlock.appendChild(emailErr);
        }

        if (wrapper) {
            const phoneBlock = wrapper.parentElement;
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

    function clearEmailOrPhoneErrors() {
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput) {
            const err = emailInput.parentElement.querySelector('.field-error[data-for="email-or-phone"]');
            if (err) err.remove();
        }
        if (wrapper) {
            const err = wrapper.parentElement.querySelector('.field-error[data-for="phone-or-email"]');
            if (err) err.remove();
        }
    }

    function maybeClearEmailOrPhoneErrors() {
        if (hasValidEmailOrPhone()) {
            clearEmailOrPhoneErrors();
        }
    }

    // reset phones wrapper back to a single empty row
    function resetPhonesToSingle() {
        if (!wrapper) return;

        const rows = wrapper.querySelectorAll('.phone-row');
        rows.forEach((row, i) => {
            if (i > 0) {
                row.remove();
                return;
            }
            const input = row.querySelector('input[name*="[phone]"]');
            if (input) input.value = '';
            const select = row.querySelector('select');
            if (select) select.selectedIndex = 0;
            row.classList.remove('is-invalid');
            const err = row.nextElementSibling;
            if (err && err.classList.contains('field-error')) err.remove();
        });

        reindexPhones();
        updateAddButton();
    }

    //* SUBMIT HANDLER
    // ajax

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // remove invalid phone rows (won't reach DB)
        if (wrapper) {
            const phoneInputs = wrapper.querySelectorAll('input[name*="[phone]"]');
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
            if (wrapper.querySelectorAll('.phone-row').length === 0) {
                wrapper.appendChild(createPhoneRow(0));
            }
            reindexPhones();
            updateAddButton();
        }

        // clear invalid email (won't reach DB)
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput && emailInput.value.trim() !== '') {
            const v = emailInput.value.trim();
            if (v.length > MAX_EMAIL || !EMAIL_REGEX.test(v)) {
                emailInput.value = '';
                clearError(emailInput);
            }
        }

        // safety net: if button somehow got enabled without valid email/phone
        if (!hasValidEmailOrPhone()) {
            if (emailInput) emailInput.value = '';
            resetPhonesToSingle();

            showEmailOrPhoneErrors();
            updateSubmitButton();
            return;
        }

        clearEmailOrPhoneErrors();

        // send
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new FormData(form),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    showSuccessModal();
                    resetFormToDefault();
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

    //* AJAX HELPERS

    function showSuccessModal() {
        const modalEl = document.getElementById('successModal');
        if (!modalEl) return;
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }

    function resetFormToDefault() {
        if (wrapper) {
            const rows = wrapper.querySelectorAll('.phone-row');
            rows.forEach((row, i) => {
                if (i > 0) row.remove();
            });
        }

        form.reset();

        if (wrapper) {
            reindexPhones();
            updateAddButton();
        }

        if (aboutField) {
            aboutField.dispatchEvent(new Event('input'));
        }

        form.querySelectorAll('.field-error').forEach(el => el.remove());
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        updateSubmitButton();
    }

    function showServerErrors(errors) {
        form.querySelectorAll('.field-error[data-server]').forEach(el => el.remove());

        Object.entries(errors).forEach(([key, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;

            if (key.startsWith('phones.')) {
                const parts = key.split('.');
                if (parts.length === 3 && parts[2] === 'phone') {
                    const idx = parts[1];
                    const field = form.querySelector(`[name="phones[${idx}][phone]"]`);
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

            const field = form.querySelector(`[name="${key}"]`);
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

    //* INITIAL STATE

    updateSubmitButton();
});