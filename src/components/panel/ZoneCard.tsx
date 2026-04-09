'use client';
import type { MedianZoneInfo } from '@/types';

interface Props {
  medianZone: MedianZoneInfo | null;
}

export default function ZoneCard({ medianZone }: Props) {
  if (!medianZone) {
    return (
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
        <p className="text-sm text-gray-400 text-center">Sin información de zona</p>
      </div>
    );
  }

  const lastPurchase = medianZone.ultimo_cierre
    ? new Date(medianZone.ultimo_cierre).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-purple-800">Actividad en la zona</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-600">Compras Habi (12 meses)</span>
          <span className="text-sm font-semibold text-gray-800">
            {medianZone.leads_cierres}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-600">Ventas estimadas</span>
          <span className="text-sm font-semibold text-gray-800">
            {medianZone.leads_cierres_desistimiento}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-600">Última compra</span>
          <span className="text-sm font-semibold text-gray-800">
            {lastPurchase}
          </span>
        </div>
      </div>
    </div>
  );
}
