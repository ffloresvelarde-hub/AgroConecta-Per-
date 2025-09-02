export enum Module {
  MercadoNegocio = 'Mercado & Negocio',
  SaberAgricola = 'Saber Agrícola',
  CreditoProteccion = 'Crédito & Protección',
  ClimaInteligente = 'Clima Inteligente',
  RedAgro = 'Red Agro',
  LogisticaExportacion = 'Logística & Exportación',
}

export interface MercadoNegocioResponse {
  trends: { title: string; content: string };
  prices: { title: string; content: string };
  buyers: { title: string; items: string[] };
  requirements: { title: string; items: string[] };
  differentiation: { title: string; content: string };
}

export interface SaberAgricolaResponse {
  diagnosis: { title: string; items: string[] };
  recommendations: { title: string; items: string[] };
  training: { title: string; content: string };
  experts: { title: string; content: string };
}

export interface CreditoProteccionResponse {
  financing: { title: string; items: string[] };
  requirements: { title: string; items: string[] };
  insurance: { title: string; content: string };
  nextStep: { title: string; content: string };
}

export interface ClimaInteligenteResponse {
  forecast: { title: string; content: string };
  recommendations: { title: string; items: string[] };
  practice: { title: string; content: string };
  geolocation: { title: string; content: string };
}

export interface RedAgroResponse {
  connections: { title: string; content: string };
  draft: { title: string; content: string };
  advice: { title: string; content: string };
  support: { title: string; content: string };
}

export interface LogisticaExportacionResponse {
  costing: { title: string; items: string[] };
  documents: { title: string; items: string[] };
  phytosanitary: { title: string; content: string };
  nextStep: { title: string; content: string };
}
