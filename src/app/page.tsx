'use client';
import { useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useFormState } from '@/hooks/useFormState';
import * as api from '@/lib/api';

// Layout
import Header from '@/components/layout/Header';
import Hero from '@/components/layout/Hero';
import ProgressBar from '@/components/layout/ProgressBar';
import StepsNav from '@/components/layout/StepsNav';
import Footer from '@/components/layout/Footer';

// Form steps
import PropertyTypeSelector from '@/components/form/PropertyTypeSelector';
import CitySearch from '@/components/form/CitySearch';
import StructuredAddress from '@/components/form/StructuredAddress';
import StepCatastral from '@/components/form/StepCatastral';
import StepCharacteristics from '@/components/form/StepCharacteristics';
import StepDetails from '@/components/form/StepDetails';
import StepContact from '@/components/form/StepContact';

// Panel cards
const MapCard = dynamic(() => import('@/components/panel/MapCard'), { ssr: false });
import CatastralCard from '@/components/panel/CatastralCard';
import ZoneCard from '@/components/panel/ZoneCard';
import POIsCard from '@/components/panel/POIsCard';

// Results
import ResultsHero from '@/components/results/ResultsHero';
import EligibilityCards from '@/components/results/EligibilityCards';
import PropertyTags from '@/components/results/PropertyTags';
const PriceChart = dynamic(() => import('@/components/results/PriceChart'), { ssr: false });
import CostsTable from '@/components/results/CostsTable';
import ResultsCTA from '@/components/results/ResultsCTA';

const STEPS = [
  { label: 'Ubicación' },
  { label: 'Catastral' },
  { label: 'Características' },
  { label: 'Detalles' },
  { label: 'Tus datos' },
];
const TOTAL_STEPS = 5;

export default function Home() {
  const {
    formData, updateForm, apiState, updateApi,
    currentStep, setCurrentStep,
    loading, setLoading, loadingMsg, setLoadingMsg,
    showResults, setShowResults, reset,
  } = useFormState();

  useEffect(() => {
    api.getCities().then(cities => updateApi({ cities })).catch(console.error);
  }, [updateApi]);

  const numRegex = /^\d{1,3}([a-zA-Z\s]*)?$/;
  const step1Valid = !!(formData.city && formData.tipoVia
    && formData.num1 && numRegex.test(formData.num1)
    && formData.num2 && numRegex.test(formData.num2)
    && formData.num3 && numRegex.test(formData.num3));

  const onStep1Complete = useCallback(async () => {
    if (!formData.address || !formData.city) return;
    try {
      const georef = await api.getGeoref(formData.address, formData.city, formData.propertyType);
      updateApi({ georef });
      const promises: Promise<void>[] = [];
      if (georef.latitude && georef.longitude) {
        promises.push(api.getPlacesOfInterest(georef.latitude, georef.longitude).then(pois => updateApi({ pois })).catch(console.error));
        promises.push(api.getDaneCode(georef.latitude, georef.longitude).then(daneCode => updateApi({ daneCode })).catch(console.error));
      }
      if (georef.median_zone_id) {
        promises.push(api.getMedianZoneInfo(georef.median_zone_id).then(medianZone => updateApi({ medianZone })).catch(console.error));
      }
      promises.push(api.getPropertyGeoDetails(formData.address).then(raw => updateApi({ catastral: api.parseCatastral(raw) })).catch(console.error));
      await Promise.all(promises);
    } catch (e) { console.error('Georef failed:', e); }
  }, [formData.address, formData.city, formData.propertyType, updateApi]);

  const onStep3Complete = useCallback(async () => {
    const geo = apiState.georef;
    if (!geo || !formData.area) return;
    try {
      const disc = await api.getDiscarded({
        area: String(formData.area), property_type_id: String(formData.propertyType),
        stratum: String(formData.stratum), city_id: String(formData.cityId || geo.city_id || ''),
        latitude: String(geo.latitude || ''), longitude: String(geo.longitude || ''),
        median_zone_id: String(geo.median_zone_id || ''), years_old: String(formData.age),
      });
      updateApi({ discarded: disc });
    } catch (e) { console.error('Discarded failed:', e); }
  }, [apiState.georef, formData, updateApi]);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setLoadingMsg('Registrando tu inmueble...');
    const msgs = ['Analizando ubicación...', 'Consultando mercado...', 'Comparando inmuebles...', 'Calculando costos...', 'Generando reporte...'];
    let i = 0;
    const iv = setInterval(() => { if (++i < msgs.length) setLoadingMsg(msgs[i]); }, 800);
    try {
      const geo = apiState.georef || {} as Record<string, unknown>;
      const payload: Record<string, unknown> = {
        direccion: formData.address, primera_direccion_ingresada: formData.address,
        ciudad: formData.cityName || formData.city, pais: 'CO',
        area: formData.area || 80, banos: formData.bathrooms, estrato: formData.stratum,
        garajes: formData.garages, num_habitaciones: formData.rooms, anos_antiguedad: formData.age,
        fuente_id: 7, tipo_inmueble_id: formData.propertyType, tipo_negocio_id: 1,
        ask_price: 0, terms_accepted: true,
        blacklist: 0, fuera_de_la_zona: 0, descartado_por_inmueble: 0,
        descartado_por_ultimo_piso_sin_ascensor: 0, descartado_por_antiguedad: 0,
        nombre_o_inmobiliaria: formData.name || 'Habi User', telefono: formData.phone || '',
        correo: formData.email || '', agente: 'Habi Nuevo',
        num_ascensores: formData.elevator, num_piso: formData.floor || 0,
        balcon: formData.balcony, terraza: formData.terrace, deposito: formData.storage,
        porteria: formData.doorman, remodelado: formData.remodeled,
        vista_exterior: formData.view !== 'Interna' ? 1 : 0,
        conjunto_edificio: (geo as Record<string, unknown>).project || '',
        nombre_conjunto: (geo as Record<string, unknown>).project || '',
      };
      if (apiState.daneCode) payload.cod_sect = apiState.daneCode;
      if (apiState.pois) payload.places_of_interest = { result: apiState.pois, success: true };

      const postRes = await api.postHabimetro(payload);
      updateApi({ postResult: postRes });
      if (!postRes.negocio_id || !postRes.inmueble_id) throw new Error('POST habimetro sin IDs');
      const result = await api.getHabimetro(postRes.negocio_id, postRes.inmueble_id);
      updateApi({ habimetro: result });
      clearInterval(iv);
      setLoading(false);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      clearInterval(iv);
      setLoading(false);
      alert('Error al generar el avalúo: ' + (e as Error).message);
    }
  }, [formData, apiState, updateApi, setLoading, setLoadingMsg, setShowResults]);

  const goNext = async () => {
    if (currentStep === 1) await onStep1Complete();
    if (currentStep === 3) await onStep3Complete();
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
  };
  const goBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-5" />
        <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl mb-2">Calculando tu avalúo</h2>
        <p className="text-gray-500">{loadingMsg}</p>
      </div>
    </div>
  );

  if (showResults && apiState.habimetro) {
    const hm = apiState.habimetro;
    const vH = api.normalizeHistoric(hm.historico_precio_venta || hm.historico_precios);
    const aH = api.normalizeHistoric(hm.historico_precio_arriendo || hm.historico_arriendos);
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-6">
          <ResultsHero avaluo={hm.avaluo} pricing={hm.pricing} />
          <EligibilityCards discarded={apiState.discarded} georef={apiState.georef} />
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-[family-name:var(--font-heading)] font-bold mb-4">Tu inmueble</h3>
              <PropertyTags formData={formData} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-[family-name:var(--font-heading)] font-bold mb-4">Histórico de precios</h3>
              <div className="h-[240px]"><PriceChart ventaData={vH} arriendoData={aH} /></div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-[family-name:var(--font-heading)] font-bold mb-4">Costos de venta estimados</h3>
              <CostsTable costs={hm.costos_transaccionales || []} totalValue={hm.avaluo?.venta_valorestimadototal || 0} />
            </div>
          </div>
          <ResultsCTA onRestart={reset} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Hero />
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm">
            <ProgressBar step={currentStep} totalSteps={TOTAL_STEPS} />
            <StepsNav currentStep={currentStep} totalSteps={TOTAL_STEPS} steps={STEPS} />
            {currentStep === 1 && (
              <div className="space-y-5 animate-in">
                <div><h2 className="font-[family-name:var(--font-heading)] font-bold text-xl mb-1">Cuéntanos sobre tu inmueble</h2><p className="text-sm text-gray-500">Con estos datos identificamos tu propiedad y su entorno.</p></div>
                <PropertyTypeSelector value={formData.propertyType} onChange={v => updateForm({ propertyType: v })} />
                <CitySearch cities={apiState.cities} value={formData.city} onChange={c => updateForm({ city: c.name, cityName: c.label, cityId: c.id })} />
                <StructuredAddress tipoVia={formData.tipoVia} num1={formData.num1} num2={formData.num2} num3={formData.num3} address={formData.address} onChange={(f, v) => updateForm({ [f]: v })} />
                <button onClick={goNext} disabled={!step1Valid} className="w-full py-3.5 rounded-full font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200 disabled:shadow-none">Continuar</button>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in">
                <div><h2 className="font-[family-name:var(--font-heading)] font-bold text-xl mb-1">Datos catastrales</h2><p className="text-sm text-gray-500">Si encontramos datos, te ahorramos tiempo.</p></div>
                <StepCatastral catastral={apiState.catastral} propertyType={formData.propertyType} onSelectUnit={(u, a) => updateForm({ unit: u, ...(a ? { area: a } : {}) })} />
                <div className="flex gap-3"><button onClick={goBack} className="px-4 py-3 text-gray-500 hover:text-purple-600">Atrás</button><button onClick={goNext} className="flex-1 py-3.5 rounded-full font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">Continuar</button></div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in">
                <div><h2 className="font-[family-name:var(--font-heading)] font-bold text-xl mb-1">Cuéntanos más de tu inmueble</h2><p className="text-sm text-gray-500">Con estas características estimamos un rango de valor.</p></div>
                <StepCharacteristics formData={formData} onChange={(f, v) => updateForm({ [f]: v })} />
                <div className="flex gap-3"><button onClick={goBack} className="px-4 py-3 text-gray-500 hover:text-purple-600">Atrás</button><button onClick={goNext} className="flex-1 py-3.5 rounded-full font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">Continuar</button></div>
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in">
                <div><h2 className="font-[family-name:var(--font-heading)] font-bold text-xl mb-1">Detalles adicionales</h2><p className="text-sm text-gray-500">Estos detalles afinan la precisión del avalúo.</p></div>
                <StepDetails formData={formData} onChange={(f, v) => updateForm({ [f]: v })} />
                <div className="flex gap-3"><button onClick={goBack} className="px-4 py-3 text-gray-500 hover:text-purple-600">Atrás</button><button onClick={goNext} className="flex-1 py-3.5 rounded-full font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">Continuar</button></div>
              </div>
            )}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in">
                <div><h2 className="font-[family-name:var(--font-heading)] font-bold text-xl mb-1">¿A dónde enviamos tu avalúo?</h2><p className="text-sm text-gray-500">Déjanos tus datos y en segundos tendrás tu reporte.</p></div>
                <StepContact formData={formData} onChange={(f, v) => updateForm({ [f]: v })} />
                <div className="flex gap-3"><button onClick={goBack} className="px-4 py-3 text-gray-500 hover:text-purple-600">Atrás</button><button onClick={onSubmit} className="flex-1 py-3.5 rounded-full font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">Ver mi avalúo</button></div>
              </div>
            )}
          </div>
          <div className="sticky top-20 space-y-4 hidden md:block">
            {!apiState.georef && (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center text-gray-400">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-gray-500 mb-2">Tu avalúo en tiempo real</h3>
                <p className="text-sm">A medida que completes los pasos, aquí verás información valiosa.</p>
              </div>
            )}
            {apiState.georef && <MapCard georef={apiState.georef} pois={apiState.pois} address={formData.address} />}
            {currentStep >= 2 && apiState.catastral && <CatastralCard catastral={apiState.catastral} project={apiState.georef?.project || ''} />}
            {currentStep >= 3 && <ZoneCard medianZone={apiState.medianZone} />}
            {currentStep >= 4 && apiState.pois && <POIsCard pois={apiState.pois} />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
