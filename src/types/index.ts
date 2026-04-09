// ── API Types ──

export interface City {
  id: number;
  name: string;
  label: string;
  priority: number | null;
  latitude: number | null;
  longitude: number | null;
  pais_id?: number;
  area_metropolitana_id?: number;
  allow_open_address_input?: number;
}

export interface GeorefResult {
  lot_id: number | null;
  lot_flag: boolean;
  address: string | null;
  homologated_address: string | null;
  latitude: number | null;
  longitude: number | null;
  city_id: number | null;
  country_id: number | null;
  median_zone_id: number | null;
  project: string | null;
  georeferencing_flag: string | null;
  suggested_addresses: { direccion: string; label?: string; ciudad?: string }[] | null;
  open_address_input?: number;
}

export interface CatastralTorre {
  complemento: string;
  numero: number;
  pisos: number[];
  apartamentos: string[];
  apartamentos_info: Record<string, { area_catastro: number | null; direccion_catastral: string }>;
  vetustez: number | null;
  latitud: number | null;
  longitud: number | null;
}

export interface CatastralData {
  torres: CatastralTorre[];
}

export interface MedianZoneInfo {
  median_zone_id: number;
  leads_cierres: number;
  leads_cierres_desistimiento: number;
  ultimo_cierre?: string | null;
  primer_cierre?: string | null;
}

export interface POIItem {
  name: string;
  distance: number;
  walking_time: number;
  driving_time?: number;
  lat: number;
  lng: number;
}

export interface POICategory {
  label: string;
  id: string;
  icon: string;
  result: POIItem[];
}

export interface PricingData {
  flag_confidence: string;
  lower_bound: number;
  upper_bound: number;
}

export interface AvaluoData {
  venta_valorestimadototal: number;
  venta_valorestimado_mt2: number;
  arriendo_valorestimadototal: number;
  arriendo_valorestimado_mt2: number;
  id_servicio?: string;
}

export interface TransactionCost {
  id: number;
  nombre: string;
  titulo: string;
  concepto: string;
  tarifa: number;
}

export interface HistoricPrice {
  year: string;
  trimester: string;
  value: number;
}

export interface HabimetroResult {
  avaluo: AvaluoData;
  pricing: PricingData;
  costos_transaccionales: TransactionCost[];
  property_details?: Record<string, string>;
  property_characteristics?: Record<string, string | number>;
  historico_precio_venta?: HistoricPrice[] | Record<string, number>;
  historico_precio_arriendo?: HistoricPrice[] | Record<string, number>;
  historico_precios?: Record<string, number>;
  historico_arriendos?: Record<string, number>;
  places_of_interest?: POICategory[];
  caracteristicas?: Record<string, unknown>;
  master_flag?: unknown;
}

export interface PostHabimetroResult {
  negocio_id: number;
  inmueble_id: number;
  contacto_id: number;
}

// ── Form State ──

export interface FormData {
  propertyType: number;
  city: string;
  cityName: string;
  cityId: string;
  tipoVia: string;
  num1: string;
  num2: string;
  num3: string;
  address: string;
  unit: string;
  area: number;
  rooms: number;
  bathrooms: number;
  garages: number;
  age: number;
  stratum: number;
  elevator: number;
  balcony: number;
  terrace: number;
  storage: number;
  doorman: number;
  remodeled: number;
  floor: number;
  view: string;
  name: string;
  email: string;
  phone: string;
  intent: string;
}

export interface ApiState {
  cities: City[];
  georef: GeorefResult | null;
  catastral: CatastralData | null;
  daneCode: string | null;
  pois: POICategory[] | null;
  medianZone: MedianZoneInfo | null;
  discarded: { response: boolean } | null;
  postResult: PostHabimetroResult | null;
  habimetro: HabimetroResult | null;
}
