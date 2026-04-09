import type { City, GeorefResult, CatastralData, MedianZoneInfo, POICategory, PostHabimetroResult, HabimetroResult, HistoricPrice } from '@/types';

// ── Config ──
const CFG = {
  georef:   { base: 'https://apiv2.habi.co/web-global-api-georeferencing',    key: 'NNKqq91UqB7mUraiwkmgm2b53FOSzeh14wDYPqvQ' },
  hm:       { base: 'https://apiv2.habi.co/habimetro-api',                    key: 'cTs075w7M48XrCr9LAES74HIJocDnHRM5uwFXURP' },
  globack:  { base: 'https://apiv2.habi.co/habi-habimetro-globack-container', key: '5yqceawUSMauWBRvywJYLoRj5wlAXYKaxWCjEV06' },
};

type Cfg = typeof CFG.georef;

function extract(data: Record<string, unknown>): unknown {
  if (typeof data?.body === 'string') {
    try { return JSON.parse(data.body); } catch { /* ignore */ }
  }
  if (data?.response !== undefined) return data.response;
  return data;
}

async function get<T>(cfg: Cfg, path: string, params: Record<string, string | number | boolean | null | undefined> = {}): Promise<T> {
  const url = new URL(`${cfg.base}/${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString(), { headers: { 'x-api-key': cfg.key } });
  if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
  return extract(await res.json()) as T;
}

async function post<T>(cfg: Cfg, path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${cfg.base}/${path}`, {
    method: 'POST',
    headers: { 'x-api-key': cfg.key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
  return extract(await res.json()) as T;
}

// ── Endpoints ──

export async function getCities(): Promise<City[]> {
  const data = await get<{ cities?: City[] }>(CFG.georef, 'get_cities', { country: 'CO' });
  const cities = data.cities || (data as unknown as City[]) || [];
  return [...cities].sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

export async function getGeoref(address: string, cityName: string, propertyTypeId = 1): Promise<GeorefResult> {
  const data = await get<{ georeferencing?: GeorefResult }>(CFG.georef, 'get_georeferencing_by_address', {
    country: 'CO', city_name: cityName, address,
    suggestions: 'true', property_type_id: propertyTypeId, open_address_input: 'true',
  });
  return data.georeferencing || (data as unknown as GeorefResult);
}

export async function getMedianZoneInfo(medianZoneId: number, monthRange = 12): Promise<MedianZoneInfo> {
  return get<MedianZoneInfo>(CFG.georef, 'get_median_zone_info', {
    country: 'CO', median_zone_id: medianZoneId, month_range: monthRange,
  });
}

export async function getPropertyGeoDetails(address: string) {
  return get<{ result: unknown[] }>(CFG.hm, 'get_property_geo_details', { address });
}

export async function getDaneCode(latitude: number, longitude: number): Promise<string> {
  const data = await get<{ cod_sect?: string }>(CFG.hm, 'get_dane_code', { latitude, longitude });
  return data.cod_sect || '';
}

export async function getPlacesOfInterest(latitude: number, longitude: number): Promise<POICategory[]> {
  const data = await get<{ result?: POICategory[] }>(CFG.globack, 'get_places_of_interest', {
    country: 'CO', latitude, longitude,
  });
  return data.result || (data as unknown as POICategory[]);
}

export async function getDiscarded(params: Record<string, string | number>): Promise<{ response: boolean }> {
  return get<{ response: boolean }>(CFG.globack, 'get_discarded', { country: 'CO', ...params });
}

export async function postHabimetro(payload: Record<string, unknown>): Promise<PostHabimetroResult> {
  return post<PostHabimetroResult>(CFG.globack, 'post_habimetro', payload);
}

export async function getHabimetro(negocioId: number, inmuebleId: number): Promise<HabimetroResult> {
  return get<HabimetroResult>(CFG.globack, 'get_habimetro', {
    negocio_id: negocioId, inmueble_id: inmuebleId,
  });
}

// ── Parsers ──

export function parseCatastral(raw: { result?: unknown[] } | null): CatastralData | null {
  if (!raw?.result || !Array.isArray(raw.result) || raw.result.length === 0) return null;

  const torres = (raw.result as Record<string, unknown>[]).map((item) => {
    const opts = (item.opciones || {}) as Record<string, unknown>;
    const apartamentos = ((opts.apartamento as unknown[]) || []).map(String);
    const vetArr = opts.vetustez_catastro;
    let vetustez: number | null = null;
    if (Array.isArray(vetArr) && vetArr.length > 0) vetustez = Number(vetArr[0]) || null;
    else if (typeof vetArr === 'number') vetustez = vetArr;

    const info: Record<string, { area_catastro: number | null; direccion_catastral: string }> = {};

    if (opts.apartamentos_info && typeof opts.apartamentos_info === 'object') {
      Object.assign(info, opts.apartamentos_info);
    } else if (Array.isArray(opts.area_catastro)) {
      apartamentos.forEach((apt, i) => {
        info[apt] = {
          area_catastro: (opts.area_catastro as number[])[i] || null,
          direccion_catastral: Array.isArray(opts.direccion_catastral) ? (opts.direccion_catastral as string[])[i] || '' : '',
        };
      });
    }

    return {
      complemento: String(item.complemento || 'edificio'),
      numero: Number(item.numero) || 1,
      pisos: (opts.piso as number[]) || [],
      apartamentos,
      apartamentos_info: info,
      vetustez,
      latitud: (opts.latitud as number) || null,
      longitud: (opts.longitud as number) || null,
    };
  });

  return { torres };
}

export function normalizeHistoric(data: HistoricPrice[] | Record<string, number> | undefined): HistoricPrice[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const qNames: Record<string, string> = { Q1: 'Ene-Mar', Q2: 'Abr-Jun', Q3: 'Jul-Sep', Q4: 'Oct-Dic', '1': 'Ene-Mar', '2': 'Abr-Jun', '3': 'Jul-Sep', '4': 'Oct-Dic' };
  return Object.entries(data)
    .map(([key, value]) => ({
      year: key.substring(0, 4),
      trimester: qNames[key.substring(4)] || key.substring(4),
      value: Number(value),
    }))
    .sort((a, b) => `${a.year}${a.trimester}`.localeCompare(`${b.year}${b.trimester}`));
}
