import { useSyncExternalStore } from 'react';

export type SidebarLayout = 'drawer' | 'rail' | 'expanded';

// Match Tailwind's lg and xl screens.
const LG_QUERY = '(min-width: 1024px)';
const XL_QUERY = '(min-width: 1280px)';

function getLayout(): SidebarLayout {
  if (window.matchMedia(XL_QUERY).matches) return 'expanded';
  return window.matchMedia(LG_QUERY).matches ? 'rail' : 'drawer';
}

function subscribe(onChange: () => void) {
  const queries = [LG_QUERY, XL_QUERY].map(query => window.matchMedia(query));
  queries.forEach(query => query.addEventListener('change', onChange));
  return () => queries.forEach(query => query.removeEventListener('change', onChange));
}

export function useSidebarLayout(): SidebarLayout {
  return useSyncExternalStore(subscribe, getLayout);
}
