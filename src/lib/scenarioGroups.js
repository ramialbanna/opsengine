// Consistent colour coding for the four deal-scenario groups, reused wherever
// scenario codes appear across the site. Group number is derived from the code's
// leading digit: 1A–1C = 1, 2A–2D = 2, 3A–3D = 3, 4A–4D = 4.
export const GROUP_COLORS = {
  1: {
    badge: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800',
    solid: 'bg-blue-500 text-white',
    card: 'border-blue-300 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/20',
    accent: 'text-blue-700 dark:text-blue-300',
  },
  2: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
    solid: 'bg-emerald-500 text-white',
    card: 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20',
    accent: 'text-emerald-700 dark:text-emerald-300',
  },
  3: {
    badge: 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/60 dark:text-violet-200 dark:border-violet-800',
    solid: 'bg-violet-500 text-white',
    card: 'border-violet-300 bg-violet-50/60 dark:border-violet-900 dark:bg-violet-950/20',
    accent: 'text-violet-700 dark:text-violet-300',
  },
  4: {
    badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
    solid: 'bg-amber-500 text-white',
    card: 'border-amber-300 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20',
    accent: 'text-amber-700 dark:text-amber-300',
  },
};

export function groupNumberForCode(code) {
  const n = parseInt(String(code ?? '').replace(/\D/g, ''), 10);
  return [1, 2, 3, 4].includes(n) ? n : null;
}

export function groupStyleForCode(code) {
  return GROUP_COLORS[groupNumberForCode(code)] || GROUP_COLORS[1];
}