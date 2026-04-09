'use client';

interface ResultsCTAProps {
  onRestart: () => void;
}

export default function ResultsCTA({ onRestart }: ResultsCTAProps) {
  return (
    <section className="rounded-2xl bg-white border border-gray-200 p-8 text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        ¿Listo para dar el siguiente paso?
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Nuestros asesores pueden ayudarte a tomar la mejor decisión.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#7C01FF] text-white font-semibold text-sm hover:bg-[#6500D6] transition-colors">
          Hablar con un asesor
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:border-gray-400 transition-colors"
        >
          Avaluar otro inmueble
        </button>
      </div>
    </section>
  );
}
