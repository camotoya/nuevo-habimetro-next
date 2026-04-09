'use client';

import type { TransactionCost } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CostsTableProps {
  costs: TransactionCost[];
  totalValue: number;
}

export default function CostsTable({ costs, totalValue }: CostsTableProps) {
  const sumTarifas = costs.reduce((acc, c) => acc + c.tarifa, 0);
  const netValue = totalValue * (1 - sumTarifas / 100);

  return (
    <div className="space-y-3">
      {costs.map((cost) => {
        const amount = totalValue * (cost.tarifa / 100);
        return (
          <div key={cost.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm text-gray-700">{cost.titulo || cost.nombre}</p>
              <p className="text-xs text-gray-400">{cost.tarifa}%</p>
            </div>
            <p className="text-sm font-medium text-gray-700">{formatCurrency(Math.round(amount))}</p>
          </div>
        );
      })}

      {/* Net value */}
      <div className="rounded-xl bg-purple-50 p-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-purple-800">Valor neto estimado</p>
        <p className="text-lg font-bold text-purple-800">{formatCurrency(Math.round(netValue))}</p>
      </div>
    </div>
  );
}
