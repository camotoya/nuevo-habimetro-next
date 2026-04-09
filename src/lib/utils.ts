const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/nuevo-habimetro-next';

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}

export function formatCurrency(n: number): string {
  return '$' + new Intl.NumberFormat('es-CO').format(n);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
