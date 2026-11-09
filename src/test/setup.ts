import '@testing-library/jest-dom';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// jsdom has no matchMedia. Evaluate min-width queries against innerWidth, and let a
// window resize event stand in for the query's change event.
window.matchMedia = (query: string) => {
  const minWidth = query.match(/min-width:\s*(\d+)px/)?.[1];
  return {
    media: query,
    get matches() {
      return minWidth !== undefined && window.innerWidth >= Number(minWidth);
    },
    addEventListener: (_type: string, listener: EventListener) => window.addEventListener('resize', listener),
    removeEventListener: (_type: string, listener: EventListener) => window.removeEventListener('resize', listener),
  } as MediaQueryList;
};
