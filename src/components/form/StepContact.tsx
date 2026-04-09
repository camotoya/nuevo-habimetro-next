'use client';
import { cn } from '@/lib/utils';

interface Props {
  formData: {
    name: string;
    email: string;
    phone: string;
    intent: string;
  };
  onChange: (field: string, value: string) => void;
}

const INTENTS = [
  { value: 'vender', label: 'Quiero vender', icon: '🏷️' },
  { value: 'comprar', label: 'Quiero comprar', icon: '🏠' },
  { value: 'agente', label: 'Soy agente', icon: '🤝' },
  { value: 'curioso', label: 'Solo curiosidad', icon: '👀' },
];

const inputBase =
  'w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-[15px] bg-white focus:border-purple-600 focus:outline-none transition-colors';

export default function StepContact({ formData, onChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Nombre completo */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          Nombre completo
        </label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={inputBase}
        />
      </div>

      {/* Email + Phone in 2-col grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={inputBase}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Teléfono</label>
          <input
            type="tel"
            placeholder="300 123 4567"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={inputBase}
          />
        </div>
      </div>

      {/* Intent buttons in 2x2 grid */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          ¿Qué te interesa?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INTENTS.map((intent) => (
            <button
              key={intent.value}
              type="button"
              onClick={() => onChange('intent', intent.value)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl border-2 px-3.5 py-3 text-[15px] font-medium transition-all',
                formData.intent === intent.value
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              )}
            >
              <span className="text-lg">{intent.icon}</span>
              {intent.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
