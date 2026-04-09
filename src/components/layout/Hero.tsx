'use client';

const STATS = [
  { value: '+500K', label: 'avalúos realizados' },
  { value: '28', label: 'ciudades' },
  { value: '5 min', label: 'promedio' },
];

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#7C01FF] to-[#3D0099] text-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left column */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            Conoce el valor de tu inmueble gratis y en minutos
          </h1>
          <p className="text-purple-200 text-base sm:text-lg mb-8">
            Nuestro algoritmo analiza miles de datos del mercado inmobiliario para darte un estimado preciso del valor de tu propiedad.
          </p>
          <div className="flex gap-6 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold">{s.value}</p>
                <p className="text-xs sm:text-sm text-purple-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — preview card */}
        <div className="hidden md:flex justify-center">
          <div className="relative w-72 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 shadow-2xl">
            <p className="text-xs text-purple-200 mb-1 uppercase tracking-wide">
              Valor estimado
            </p>
            <p className="text-3xl font-bold mb-4">$452.460.000</p>
            <div className="h-2 rounded-full bg-white/20 mb-4">
              <div className="h-full w-3/4 rounded-full bg-teal-400" />
            </div>
            <div className="flex justify-between text-xs text-purple-200">
              <span>$420M</span>
              <span>$485M</span>
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              ✓
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
