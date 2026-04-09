'use client';
import { useState, useRef, useEffect } from 'react';
import type { City } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  cities: City[];
  value: string;
  onChange: (city: { name: string; label: string; id: string }) => void;
}

export default function CitySearch({ cities, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
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
    <div ref={ref}>
      <label className="block text-[16px] font-medium text-gray-600 mb-1">Ciudad</label>
      <div className="relative">
        <input
          type="text"
          className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-xl text-[16px] outline-none transition-colors focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
          placeholder="Escribe o selecciona tu ciudad"
          value={query}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
            // Clear selection if user types
            if (value) onChange({ name: '', label: '', id: '' });
          }}
        />
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-[280px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3.5 py-3 text-sm text-gray-400">No se encontraron ciudades</div>
            ) : (
              filtered.map(c => {
                const cName = c.name || '';
                const cLabel = c.label || c.name || '';
                const cId = String(c.id || '');
                const isActive = cName === value;
                return (
                  <button
                    key={cId || cName}
                    type="button"
                    className={cn(
                      'block w-full text-left px-3.5 py-2.5 text-sm hover:bg-purple-50 transition-colors',
                      isActive && 'bg-purple-50 text-purple-700 font-semibold'
                    )}
                    onMouseDown={e => {
                      e.preventDefault();
                      setQuery(cLabel);
                      setOpen(false);
                      onChange({ name: cName, label: cLabel, id: cId });
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
    </div>
  );
}
