'use client';
import { asset } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 mt-12">
      <div className="mx-auto max-w-[1200px] px-4 flex flex-col items-center gap-3">
        <img src={asset('/logo-habi.png')} alt="Habi" className="h-5 w-auto opacity-50" />
        <p className="text-xs text-gray-400 text-center max-w-lg leading-relaxed">
          Los valores son estimados con base en datos del mercado y no constituyen un avalúo comercial certificado.
        </p>
      </div>
    </footer>
  );
}
