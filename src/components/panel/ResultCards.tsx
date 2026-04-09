'use client';
import dynamic from 'next/dynamic';
import type { GeorefResult, MedianZoneInfo, POICategory } from '@/types';

const MapCard = dynamic(() => import('./MapCard'), { ssr: false });

interface Props {
  georef: GeorefResult | null;
  pois: POICategory[] | null;
  medianZone: MedianZoneInfo | null;
  address: string;
}

export default function ResultCards({ georef, pois, medianZone, address }: Props) {
  const hasGeoref = !!georef?.latitude;
  const hasZone = !!(medianZone && medianZone.leads_cierres > 0);

  return (
    <div className="space-y-4">
      {/* ── Ubicación y entorno ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-[16px] font-bold text-gray-800">📍 Ubicación y entorno</h3>
        </div>
        {hasGeoref ? (
          <MapCard georef={georef} pois={pois} address={address} />
        ) : (
          <div className="px-5 pb-5">
            <div className="rounded-xl bg-purple-50 p-6 text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-[16px] text-gray-500">Ingresa tu dirección para ver la ubicación de tu inmueble y los lugares de interés cercanos</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Tu zona ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-[16px] font-bold text-gray-800">📊 Tu zona</h3>
        </div>
        <div className="px-5 pb-5">
          {hasZone ? (
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-700 mb-1">{medianZone!.leads_cierres}</div>
                <p className="text-[15px] text-gray-600">inmuebles comprados por Habi en tu zona <span className="text-gray-400">(últimos 12 meses)</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xl font-bold text-gray-800">{medianZone!.leads_cierres_desistimiento}</div>
                  <p className="text-[13px] text-gray-500">ventas estimadas en la zona</p>
                </div>
                {medianZone!.ultimo_cierre && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-[15px] font-bold text-gray-800">{medianZone!.ultimo_cierre!.substring(0, 10)}</div>
                    <p className="text-[13px] text-gray-500">última compra de Habi</p>
                  </div>
                )}
              </div>
            </div>
          ) : hasGeoref ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <p className="text-[15px] text-gray-400">Aún no tenemos actividad registrada en esta zona</p>
            </div>
          ) : (
            <div className="rounded-xl bg-purple-50 p-6 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-[16px] text-gray-500">Completa el formulario para ver la actividad de Habi en tu zona</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
