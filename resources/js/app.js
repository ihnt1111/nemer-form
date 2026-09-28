console.log('app.js loaded');

import { ctx, initContext } from './context.js';
import { initPhones } from './phones.js';
import { initTextarea } from './textarea.js';
import { initValidation } from './validators.js';
import { maybeClearEmailOrPhoneErrors } from './emailOrPhone.js';
import { initSubmitButton, updateSubmitButton } from './submitButton.js';
import { initSubmit } from './submit.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!initContext()) return;

    //* PREVENT ENTER

    ctx.form.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'textarea' || tag === 'button') return;
        e.preventDefault();
    });

    //* MODULES

    initPhones({ updateSubmit: updateSubmitButton });

    initTextarea();

    initValidation({
        updateSubmit: updateSubmitButton,
        onEmailInput: maybeClearEmailOrPhoneErrors,
    });

    initSubmitButton();
    initSubmit();

    //* INITIAL STATE

    updateSubmitButton();
});