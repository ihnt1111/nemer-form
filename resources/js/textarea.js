import { ctx } from './context.js';

export function initTextarea() {
    if (!ctx.aboutField) return;

    const autoGrow = () => {
        const computed = getComputedStyle(ctx.aboutField);
        const minHeight = parseFloat(computed.minHeight);
        const maxHeight = parseFloat(computed.maxHeight);

        ctx.aboutField.style.height = 'auto';
        let next = ctx.aboutField.scrollHeight;
        if (next < minHeight) next = minHeight;

        if (next >= maxHeight) {
            ctx.aboutField.style.height = maxHeight + 'px';
            ctx.aboutField.style.overflowY = 'auto';
        } else {
            ctx.aboutField.style.height = next + 'px';
            ctx.aboutField.style.overflowY = 'hidden';
        }
    };

    ctx.aboutField.addEventListener('input', autoGrow);
    window.addEventListener('resize', autoGrow);
    autoGrow();
}