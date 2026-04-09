'use client';

const TIPOS_VIA = ['Calle', 'Carrera', 'Avenida', 'Diagonal', 'Transversal', 'Circular'];

interface Props {
  tipoVia: string;
  num1: string;
  num2: string;
  num3: string;
  address: string;
  onChange: (field: string, value: string) => void;
}

export default function StructuredAddress({ tipoVia, num1, num2, num3, address, onChange }: Props) {
  return (
    <div>
      <label className="block text-[15px] font-medium text-gray-600 mb-1">Dirección</label>
      <div className="flex flex-wrap items-center gap-1.5">
        <select
          value={tipoVia}
          onChange={e => onChange('tipoVia', e.target.value)}
          className="w-full sm:w-[140px] px-3 py-3 border-2 border-gray-200 rounded-xl text-base outline-none bg-white transition-colors focus:border-purple-600 appearance-none"
        >
          <option value="" disabled>Tipo de vía</option>
          {TIPOS_VIA.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <input
          type="text"
          value={num1}
          onChange={e => onChange('num1', e.target.value)}
          placeholder="Ej: 127 c bis"
          maxLength={15}
          className="flex-1 min-w-[70px] px-3 py-3 border-2 border-gray-200 rounded-xl text-base text-center outline-none transition-colors focus:border-purple-600"
        />
        <span className="text-lg font-bold text-gray-400">#</span>
        <input
          type="text"
          value={num2}
          onChange={e => onChange('num2', e.target.value)}
          placeholder="Ej: 78"
          maxLength={15}
          className="flex-1 min-w-[60px] px-3 py-3 border-2 border-gray-200 rounded-xl text-base text-center outline-none transition-colors focus:border-purple-600"
        />
        <span className="text-lg font-bold text-gray-400">-</span>
        <input
          type="text"
          value={num3}
          onChange={e => onChange('num3', e.target.value)}
          placeholder="Ej: 97"
          maxLength={10}
          className="flex-[0.7] min-w-[50px] px-3 py-3 border-2 border-gray-200 rounded-xl text-base text-center outline-none transition-colors focus:border-purple-600"
        />
      </div>
      {address && (
        <p className="mt-2 text-sm text-teal-600 font-medium">📍 {address}</p>
      )}
    </div>
  );
}
