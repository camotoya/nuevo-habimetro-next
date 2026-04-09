'use client';

import type { GeorefResult } from '@/types';

interface EligibilityCardsProps {
  discarded: { response: boolean } | null;
  georef: GeorefResult | null;
}

function MMCard() {
  return (
    <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#7C01FF] to-[#3D0099] text-white p-6 flex flex-col">
      <span className="self-start text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3">
        Aplica Market Maker
      </span>
      <h3 className="text-lg font-bold mb-4">Te compramos tu casa en 10 días</h3>
      <ul className="space-y-2 text-sm mb-6 flex-1">
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
          <span><strong>10 días</strong> para cerrar</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
          <span><strong>Pago en efectivo</strong></span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
          <span><strong>Sin intermediarios</strong></span>
        </li>
      </ul>
      <button className="w-full py-3 rounded-xl bg-white text-purple-700 font-semibold text-sm hover:bg-white/90 transition-colors">
        Solicitar oferta
      </button>
    </div>
  );
}

function InmoCard({ both }: { both: boolean }) {
  return (
    <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#00C29C] to-[#008F73] text-white p-6 flex flex-col">
      <span className="self-start text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3">
        Aplica Inmobiliaria
      </span>
      <h3 className="text-lg font-bold mb-4">
        {both
          ? 'O véndela al mejor precio del mercado'
          : 'Vendemos tu casa con la red de brokers más grande del país'}
      </h3>
      <ul className="space-y-2 text-sm mb-6 flex-1">
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
          <span><strong>Mejor precio</strong> del mercado</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
          <span><strong>Red de brokers</strong></span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
          <span><strong>Acompañamiento completo</strong></span>
        </li>
      </ul>
      <button className="w-full py-3 rounded-xl bg-white text-teal-700 font-semibold text-sm hover:bg-white/90 transition-colors">
        Conocer más
      </button>
    </div>
  );
}

function OutOfCoverageCard() {
  return (
    <div className="max-w-md mx-auto rounded-2xl border border-gray-200 bg-white text-gray-500 p-6 text-center">
      <div className="text-3xl mb-3">📍</div>
      <h3 className="text-lg font-bold text-gray-700 mb-2">Fuera de cobertura</h3>
      <p className="text-sm">
        Por ahora no tenemos servicios disponibles en esta zona. Estamos trabajando para llegar a más ciudades.
      </p>
    </div>
  );
}

export default function EligibilityCards({ discarded, georef }: EligibilityCardsProps) {
  const aplica_mm = discarded?.response === true;
  const aplica_inmo = aplica_mm || !!georef?.city_id;

  // Both MM and Inmo
  if (aplica_mm && aplica_inmo) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MMCard />
        <InmoCard both />
      </section>
    );
  }

  // Only Inmo
  if (aplica_inmo) {
    return (
      <section className="max-w-md mx-auto">
        <InmoCard both={false} />
      </section>
    );
  }

  // Neither
  return (
    <section>
      <OutOfCoverageCard />
    </section>
  );
}
