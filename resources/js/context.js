export const ctx = {};

export function initContext() {
    ctx.form = document.getElementById('survey-form');
    if (!ctx.form) return false;

    ctx.wrapper = document.getElementById('phones-wrapper');
    ctx.addBtn = document.getElementById('add-phone');
    ctx.submitBtn = document.getElementById('submit-btn');
    ctx.aboutField = document.getElementById('about');

    return true;
}