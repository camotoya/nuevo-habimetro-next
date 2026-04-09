'use client';
import dynamic from 'next/dynamic';
import type { GeorefResult, CatastralData, MedianZoneInfo, POICategory } from '@/types';

const MapCard = dynamic(() => import('./MapCard'), { ssr: false });

interface Props {
  georef: GeorefResult | null;
  pois: POICategory[] | null;
  catastral: CatastralData | null;
  medianZone: MedianZoneInfo | null;
  address: string;
  project: string;
}

export default function ResultCards({ georef, pois, catastral, medianZone, address, project }: Props) {
  const hasGeoref = !!georef?.latitude;
  const hasCatastral = !!(catastral && catastral.torres.length > 0);
  const hasZone = !!(medianZone && medianZone.leads_cierres > 0);

  return (
    <div className="space-y-4">
      {/* ── Ubicación ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-[15px] font-bold text-gray-800">📍 Ubicación y entorno</h3>
        </div>
        {hasGeoref ? (
          <div>
            <MapCard georef={georef} pois={pois} address={address} />
          </div>
        ) : (
          <div className="px-5 pb-5">
            <div className="rounded-xl bg-purple-50 p-6 text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-[15px] text-gray-500">Ingresa tu dirección para ver la ubicación de tu inmueble y los lugares de interés cercanos</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Catastral ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-[15px] font-bold text-gray-800">🏢 Datos catastrales</h3>
        </div>
        <div className="px-5 pb-5">
          {hasCatastral ? (
            <div className="space-y-3">
              {catastral!.torres.map((torre, i) => {
                const age = torre.vetustez ? new Date().getFullYear() - torre.vetustez : null;
                return (
                  <div key={i} className="p-4 bg-teal-50 rounded-xl">
                    <h4 className="font-semibold text-[15px] mb-2">{project || 'Edificio'}</h4>
                    <div className="grid grid-cols-2 gap-2 text-[14px] text-gray-600">
                      {torre.apartamentos.length > 0 && (
                        <div><span className="text-gray-400">Unidades:</span> {torre.apartamentos.length}</div>
                      )}
                      {age !== null && (
                        <div><span className="text-gray-400">Construido:</span> {torre.vetustez} ({age} años)</div>
                      )}
                      {torre.pisos.length > 0 && (
                        <div><span className="text-gray-400">Pisos:</span> {torre.pisos[0]} al {torre.pisos[torre.pisos.length - 1]}</div>
                      )}
                      {torre.complemento && (
                        <div><span className="text-gray-400">Tipo:</span> {torre.complemento}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : hasGeoref ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <p className="text-[14px] text-gray-400">Sin datos catastrales para esta dirección</p>
            </div>
          ) : (
            <div className="rounded-xl bg-purple-50 p-6 text-center">
              <div className="text-4xl mb-3">🏢</div>
              <p className="text-[15px] text-gray-500">Completa el formulario para ver los datos catastrales de tu inmueble</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Tu zona ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-[15px] font-bold text-gray-800">📊 Tu zona</h3>
        </div>
        <div className="px-5 pb-5">
          {hasZone ? (
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-700 mb-1">{medianZone!.leads_cierres}</div>
                <p className="text-[14px] text-gray-600">inmuebles comprados por Habi en tu zona <span className="text-gray-400">(últimos 12 meses)</span></p>
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
              <p className="text-[14px] text-gray-400">Aún no tenemos actividad registrada en esta zona</p>
            </div>
          ) : (
            <div className="rounded-xl bg-purple-50 p-6 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-[15px] text-gray-500">Completa el formulario para ver la actividad de Habi en tu zona</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
