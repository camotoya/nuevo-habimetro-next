'use client';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center justify-between">
        <Image
          src="/logo-habi.png"
          alt="Habi"
          width={128}
          height={36}
          className="h-9 w-auto"
        />
        <span className="hidden sm:inline text-xs text-purple-700 bg-purple-50 px-3 py-1 rounded-full font-medium">
          Avalúo gratuito en línea
        </span>
      </div>
    </header>
  );
}
