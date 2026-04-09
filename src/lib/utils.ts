export function formatCurrency(n: number): string {
  return '$' + new Intl.NumberFormat('es-CO').format(n);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
