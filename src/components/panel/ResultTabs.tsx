'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
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

const TABS = [
  { id: 'ubicacion', label: 'Ubicación', icon: '📍' },
  { id: 'catastral', label: 'Catastral', icon: '🏢' },
  { id: 'zona', label: 'Tu zona', icon: '📊' },
];

export default function ResultTabs({ georef, pois, catastral, medianZone, address, project }: Props) {
  const [activeTab, setActiveTab] = useState('ubicacion');

  const hasGeoref = !!georef?.latitude;
  const hasCatastral = !!(catastral && catastral.torres.length > 0);
  const hasZone = !!(medianZone && medianZone.leads_cierres > 0);

  const isDisabled = (tabId: string) => {
    if (tabId === 'catastral') return !hasGeoref;
    if (tabId === 'zona') return !hasGeoref;
    return false;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Tabs header */}
      <div className="flex border-b border-gray-100">
        {TABS.map(tab => {
          const disabled = isDisabled(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => !disabled && setActiveTab(tab.id)}
              disabled={disabled}
              className={cn(
                'flex-1 py-3.5 px-2 text-center text-[15px] font-medium transition-all border-b-2',
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                  : disabled
                    ? 'border-transparent text-gray-300 cursor-not-allowed'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
              )}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {/* Ubicación y entorno */}
        {activeTab === 'ubicacion' && (
          <div>
            <MapCard georef={georef} pois={pois} address={address} />
          </div>
        )}

        {/* Catastral */}
        {activeTab === 'catastral' && (
          <div>
            {hasCatastral ? (
              <div className="space-y-3">
                {catastral!.torres.map((torre, i) => {
                  const age = torre.vetustez ? new Date().getFullYear() - torre.vetustez : null;
                  return (
                    <div key={i} className="p-4 bg-teal-50 rounded-xl">
                      <h4 className="font-semibold text-[15px] mb-2">{project || 'Edificio'}</h4>
                      <div className="grid grid-cols-2 gap-2 text-[15px] text-gray-600">
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
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">🏢</div>
                <p className="text-[15px]">Sin datos catastrales para esta dirección</p>
              </div>
            )}
          </div>
        )}

        {/* Tu zona */}
        {activeTab === 'zona' && (
          <div>
            {hasZone ? (
              <div className="space-y-4">
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
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-[15px]">Aún no tenemos actividad registrada en esta zona</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
