type CleanupFn = () => void;

const cleanups = new Map<string, CleanupFn>();

export function onPageLoad(key: string, fn: () => void | CleanupFn): void {
  const run = () => {
    const prev = cleanups.get(key);
    if (prev) prev();
    const result = fn();
    if (typeof result === 'function') {
      cleanups.set(key, result);
    } else {
      cleanups.delete(key);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  document.addEventListener('astro:page-load', run);
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export function observeFadeIn(
  selector: string,
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -4% 0px' }
): void {
  const elements = document.querySelectorAll<HTMLElement>(
    `${selector}:not([data-fade-observed])`
  );
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    elements.forEach((el) => {
      el.dataset.fadeObserved = 'true';
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, options);

  elements.forEach((el) => {
    el.dataset.fadeObserved = 'true';
    observer.observe(el);
  });
}

declare global {
  interface Window {
    onPageLoad?: typeof onPageLoad;
    removeTimezone?: (id: number) => void;
  }
}

if (typeof window !== 'undefined' && !window.onPageLoad) {
  window.onPageLoad = onPageLoad;
}
