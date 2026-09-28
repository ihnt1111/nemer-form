import { ctx } from './context.js';
import { MAX_PHONES } from './constants.js';

export function createPhoneRow(index) {
    const row = document.createElement('div');
    row.className = 'phone-row d-flex align-items-center gap-2 mb-2';

    const button = index === 0
        ? `<button type="button" id="add-phone" class="btn-add-phone" aria-label="Dodaj telefon">
               <i class="bi bi-plus-lg"></i>
           </button>`
        : `<button type="button" class="btn-remove-phone" aria-label="Usuń telefon">
               <i class="bi bi-dash-lg"></i>
           </button>`;

    row.innerHTML = `
        <select name="phones[${index}][country_code]" class="form-select form-control-underline phone-code">
            <option value="+48">+48</option>
            <option value="+44">+44</option>
            <option value="+49">+49</option>
        </select>
        <input type="tel" name="phones[${index}][phone]" value="" placeholder="123456789"
               class="form-control form-control-underline" maxlength="15">
        ${button}
    `;
    return row;
}

export function reindexPhones() {
    const rows = ctx.wrapper.querySelectorAll('.phone-row');
    rows.forEach((row, i) => {
        const select = row.querySelector('select[name*="[country_code]"]');
        const input = row.querySelector('input[name*="[phone]"]');
        if (select) select.name = `phones[${i}][country_code]`;
        if (input) input.name = `phones[${i}][phone]`;
    });
}

export function updateAddButton() {
    if (!ctx.addBtn) return;
    const count = ctx.wrapper.querySelectorAll('.phone-row').length;
    ctx.addBtn.style.display = count >= MAX_PHONES ? 'none' : '';
}

export function initPhones({ updateSubmit }) {
    // add row
    if (ctx.addBtn && ctx.wrapper) {
        ctx.addBtn.addEventListener('click', () => {
            const count = ctx.wrapper.querySelectorAll('.phone-row').length;
            if (count >= MAX_PHONES) return;
            ctx.wrapper.appendChild(createPhoneRow(count));
            updateAddButton();
            updateSubmit();
        });
    }

    // remove row
    if (ctx.wrapper) {
        ctx.wrapper.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-phone');
            if (!btn) return;

            const row = btn.closest('.phone-row');
            if (!row) return;

            const rows = ctx.wrapper.querySelectorAll('.phone-row');

            // keep at least one row — just clear it instead of removing
            if (rows.length <= 1) {
                const input = row.querySelector('input[name*="[phone]"]');
                if (input) input.value = '';

                const select = row.querySelector('select');
                if (select) select.selectedIndex = 0;

                row.classList.remove('is-invalid');
                const err = row.nextElementSibling;
                if (err && err.classList.contains('field-error')) err.remove();

                updateSubmit();
                return;
            }

            const error = row.nextElementSibling;
            if (error && error.classList.contains('field-error')) {
                error.remove();
            }
            row.remove();
            reindexPhones();
            updateAddButton();
            updateSubmit();
        });
    }
}