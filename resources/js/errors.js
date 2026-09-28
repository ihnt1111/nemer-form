export function showError(field, message) {
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

export function clearError(field) {
    field.classList.remove('is-invalid');

    const container = field.closest('.phone-row') || field;
    const error = container.parentElement.querySelector(
        '.field-error[data-for="' + field.name + '"]'
    );
    if (error) error.remove();
}