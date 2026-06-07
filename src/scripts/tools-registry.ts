type ToolInitFn = () => void | (() => void);

declare global {
  interface Window {
    toolInits?: Record<string, ToolInitFn>;
    __mountedTools?: Set<string>;
    __pendingToolInits?: string[];
    ensureToolInit?: typeof ensureToolInit;
  }
}

export function registerToolInit(toolId: string, initFn: ToolInitFn): void {
  window.toolInits = window.toolInits || {};
  window.toolInits[toolId] = initFn;

  if (window.__pendingToolInits?.includes(toolId)) {
    window.ensureToolInit?.(toolId);
  }
}

export function ensureToolInit(toolId: string): void {
  window.__mountedTools = window.__mountedTools || new Set();
  if (window.__mountedTools.has(toolId)) return;
  window.__mountedTools.add(toolId);
  window.toolInits?.[toolId]?.();
}

if (typeof window !== 'undefined' && !window.ensureToolInit) {
  window.ensureToolInit = ensureToolInit;
}
