import type { Metadata } from 'next';
import { Montserrat, Roboto } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Habi — Avalúo gratis de tu inmueble',
  description: 'Conoce el valor real de tu casa o apartamento en minutos. Avalúo gratuito, en línea, con datos del mercado colombiano.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${roboto.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50 font-[family-name:var(--font-roboto)]">
        {children}
      </body>
    </html>
  );
}
