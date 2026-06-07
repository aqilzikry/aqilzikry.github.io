export type StatusType = 'info' | 'success' | 'error';

export function showStatus(element: HTMLElement, message: string, type: StatusType = 'info'): void {
  element.textContent = message;
  element.className = `mt-3 p-3 rounded-control ${
    type === 'error' ? 'status-error' : type === 'success' ? 'status-success' : 'status-info'
  }`;
}

export function hideStatus(element: HTMLElement): void {
  element.className = 'hidden p-3 rounded-control';
}

export function createStatusHelpers(element: HTMLElement) {
  return {
    show: (message: string, type: StatusType = 'info') => showStatus(element, message, type),
    hide: () => hideStatus(element),
  };
}
