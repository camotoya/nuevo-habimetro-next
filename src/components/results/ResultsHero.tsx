'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { AvaluoData, PricingData } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ResultsHeroProps {
  avaluo: AvaluoData;
  pricing: PricingData;
}

export default function ResultsHero({ avaluo, pricing }: ResultsHeroProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const target = avaluo.venta_valorestimadototal;

  useEffect(() => {
    startRef.current = null;
    const duration = 1200;

    function animate(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [target]);

  const { lower_bound, upper_bound, flag_confidence } = pricing;
  const range = upper_bound - lower_bound || 1;
  const markerPct = Math.max(0, Math.min(100, ((target - lower_bound) / range) * 100));

  const confidenceMap: Record<string, { label: string; dot: string }> = {
    alta:  { label: 'Alta', dot: '🟢' },
    media: { label: 'Media', dot: '🟡' },
    baja:  { label: 'Baja', dot: '🔴' },
  };
  const confidence = confidenceMap[flag_confidence?.toLowerCase()] ?? confidenceMap.media;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#7C01FF] to-[#3D0099] text-white p-6 sm:p-10">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/logo-habi.png"
          alt="Habi"
          width={96}
          height={28}
          className="h-7 w-auto brightness-0 invert"
        />
      </div>

      {/* Label */}
      <p className="text-center text-sm text-white/80 mb-1">Valor estimado de tu inmueble</p>

      {/* Animated value */}
      <p className="text-center text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        {formatCurrency(displayValue)}
      </p>

      {/* Range bar */}
      <div className="mx-auto max-w-md mb-6">
        <div className="relative h-2 rounded-full bg-white/20">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-white/50"
            style={{ width: `${markerPct}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-purple-300 shadow-lg"
            style={{ left: `calc(${markerPct}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/60 mt-1">
          <span>{formatCurrency(lower_bound)}</span>
          <span>{formatCurrency(upper_bound)}</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-white/60 mb-0.5">Precio por m²</p>
          <p className="text-sm font-semibold">{formatCurrency(avaluo.venta_valorestimado_mt2)}</p>
        </div>
        <div>
          <p className="text-xs text-white/60 mb-0.5">Confianza</p>
          <p className="text-sm font-semibold">
            {confidence.dot} {confidence.label}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/60 mb-0.5">Arriendo estimado</p>
          <p className="text-sm font-semibold">{formatCurrency(avaluo.arriendo_valorestimadototal)}</p>
        </div>
      </div>
    </section>
  );
}
