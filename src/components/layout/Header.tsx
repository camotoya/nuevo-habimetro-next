'use client';
import { asset, cn } from '@/lib/utils';

const TABS = [
  { id: 'vender', label: 'Vender' },
  { id: 'comprar', label: 'Comprar' },
  { id: 'broker', label: 'Soy Broker' },
  { id: 'cuanto', label: '¿Cuánto cuesta mi vivienda?' },
];

interface Props {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Header({ activeTab = 'vender', onTabChange }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center justify-between">
        <img src={asset('/logo-habi.png')} alt="Habi" className="h-9 w-auto shrink-0" />
        <nav className="hidden sm:flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'px-4 py-2 rounded-full text-[14px] font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:text-purple-700 hover:bg-purple-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        {/* Mobile: simplified nav */}
        <div className="sm:hidden flex items-center gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
