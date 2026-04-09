'use client';
import { useState, useRef, useEffect } from 'react';
import type { City } from '@/types';
import { cn } from '@/lib/utils';

const TIPOS_VIA = ['Calle', 'Carrera', 'Avenida', 'Diagonal', 'Transversal', 'Circular'];

interface Props {
  cities: City[];
  cityValue: string;
  onCityChange: (city: { name: string; label: string; id: string }) => void;
  tipoVia: string;
  num1: string;
  num2: string;
  num3: string;
  address: string;
  onAddressChange: (field: string, value: string) => void;
}

export default function CityAndAddress({
  cities, cityValue, onCityChange,
  tipoVia, num1, num2, num3, address, onAddressChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(cityValue);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const filtered = query
    ? cities.filter(c => normalize(c.label || c.name).includes(normalize(query)))
    : cities;

  return (
    <div>
      <label className="block text-[16px] font-medium text-gray-600 mb-1">Ciudad y dirección</label>
      <div className="flex items-center gap-1">
        {/* Ciudad 30% */}
        <div className="relative shrink-0" style={{ width: '30%' }} ref={ref}>
          <input
            type="text"
            className="w-full px-2 py-3 border-2 border-gray-200 rounded-xl text-[16px] outline-none transition-colors focus:border-purple-600"
            placeholder="Ciudad"
            value={query}
            autoComplete="off"
            onFocus={() => setOpen(true)}
            onChange={e => {
              setQuery(e.target.value);
              setOpen(true);
              if (cityValue) onCityChange({ name: '', label: '', id: '' });
            }}
          />
          {open && (
            <div className="absolute top-full left-0 w-[250px] mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-[280px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-[14px] text-gray-400">Sin resultados</div>
              ) : (
                filtered.map(c => {
                  const cName = c.name || '';
                  const cLabel = c.label || c.name || '';
                  const cId = String(c.id || '');
                  return (
                    <button
                      key={cId || cName}
                      type="button"
                      className={cn(
                        'block w-full text-left px-3 py-2.5 text-[15px] hover:bg-purple-50 transition-colors',
                        cName === cityValue && 'bg-purple-50 text-purple-700 font-semibold'
                      )}
                      onMouseDown={e => {
                        e.preventDefault();
                        setQuery(cLabel);
                        setOpen(false);
                        onCityChange({ name: cName, label: cLabel, id: cId });
                      }}
                    >
                      {cLabel}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
        {/* Tipo de vía 30% */}
        <select
          value={tipoVia}
          onChange={e => onAddressChange('tipoVia', e.target.value)}
          style={{ width: '30%' }}
          className="shrink-0 px-1 py-3 border-2 border-gray-200 rounded-xl text-[16px] outline-none bg-white transition-colors focus:border-purple-600 appearance-none"
        >
          <option value="" disabled>Vía</option>
          {TIPOS_VIA.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {/* Num1 16% */}
        <input
          type="text"
          value={num1}
          onChange={e => onAddressChange('num1', e.target.value)}
          placeholder="127c"
          maxLength={15}
          style={{ width: '16%' }}
          className="shrink-0 px-1 py-3 border-2 border-gray-200 rounded-xl text-[16px] text-center outline-none transition-colors focus:border-purple-600"
        />
        <span className="text-base font-bold text-gray-400 shrink-0">#</span>
        {/* Num2 12% */}
        <input
          type="text"
          value={num2}
          onChange={e => onAddressChange('num2', e.target.value)}
          placeholder="78"
          maxLength={10}
          style={{ width: '12%' }}
          className="shrink-0 px-1 py-3 border-2 border-gray-200 rounded-xl text-[16px] text-center outline-none transition-colors focus:border-purple-600"
        />
        <span className="text-base font-bold text-gray-400 shrink-0">-</span>
        {/* Num3 12% */}
        <input
          type="text"
          value={num3}
          onChange={e => onAddressChange('num3', e.target.value)}
          placeholder="97"
          maxLength={5}
          style={{ width: '12%' }}
          className="shrink-0 px-1 py-3 border-2 border-gray-200 rounded-xl text-[16px] text-center outline-none transition-colors focus:border-purple-600"
        />
      </div>
      {address && (
        <p className="mt-2 text-[14px] text-teal-600 font-medium">📍 {address}</p>
      )}
    </div>
  );
}
