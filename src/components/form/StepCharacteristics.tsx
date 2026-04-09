'use client';
import { cn } from '@/lib/utils';

interface Props {
  formData: {
    area: number;
    rooms: number;
    bathrooms: number;
    garages: number;
    age: number;
    stratum: number;
  };
  onChange: (field: string, value: number) => void;
}

const inputBase =
  'w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-[15px] bg-white focus:border-purple-600 focus:outline-none transition-colors';

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputBase}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function StepCharacteristics({ formData, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Área construida */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          Área construida (m²)
        </label>
        <input
          type="number"
          min={10}
          max={1000}
          placeholder="80"
          value={formData.area || ''}
          onChange={(e) => onChange('area', Number(e.target.value))}
          className={inputBase}
        />
      </div>

      {/* Habitaciones */}
      <SelectField
        label="Habitaciones"
        value={formData.rooms}
        onChange={(v) => onChange('rooms', v)}
        options={[
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' },
          { value: 6, label: '6+' },
        ]}
      />

      {/* Baños */}
      <SelectField
        label="Baños"
        value={formData.bathrooms}
        onChange={(v) => onChange('bathrooms', v)}
        options={[
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5+' },
        ]}
      />

      {/* Garajes */}
      <SelectField
        label="Garajes"
        value={formData.garages}
        onChange={(v) => onChange('garages', v)}
        options={[
          { value: 0, label: '0' },
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3+' },
        ]}
      />

      {/* Antigüedad */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          Antigüedad (años)
        </label>
        <input
          type="number"
          min={0}
          max={100}
          placeholder="12"
          value={formData.age || ''}
          onChange={(e) => onChange('age', Number(e.target.value))}
          className={inputBase}
        />
      </div>

      {/* Estrato */}
      <SelectField
        label="Estrato"
        value={formData.stratum}
        onChange={(v) => onChange('stratum', v)}
        options={[
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' },
          { value: 6, label: '6' },
        ]}
      />
    </div>
  );
}
