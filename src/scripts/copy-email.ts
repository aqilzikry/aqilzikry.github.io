import { copyToClipboard } from './clipboard';

declare global {
  interface Window {
    __copyEmailClickBound?: boolean;
  }
}

export function initCopyEmail(): void {
  if (window.__copyEmailClickBound) return;
  window.__copyEmailClickBound = true;

  document.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest('.copy-email-btn');
    if (!button || !(button instanceof HTMLElement)) return;

    const wrap = button.closest('.copy-email-wrap');
    const email = button.dataset.email;
    if (!email) return;

    event.preventDefault();

    const copied = await copyToClipboard(email);

    if (!copied) {
      window.location.href = `mailto:${email}`;
      return;
    }

    if (wrap) {
      wrap.classList.add('is-copied');
      window.setTimeout(() => wrap.classList.remove('is-copied'), 1800);
    }
  });
}
