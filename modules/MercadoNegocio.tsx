import React, { useState } from 'react';
import Card from '../components/Card.tsx';
import { runJsonQuery } from '../lib/gemini.ts';
import Spinner from '../components/Spinner.tsx';
import { MercadoNegocioResponse } from '../types.ts';
import { Schema, Type } from '@google/genai';
import OutputSection from '../components/OutputSection.tsx';
import InfoBlock from '../components/InfoBlock.tsx';
import InfoList from '../components/InfoList.tsx';

import TrendIcon from '../components/icons/TrendIcon.tsx';
import PriceTagIcon from '../components/icons/PriceTagIcon.tsx';
import TargetIcon from '../components/icons/TargetIcon.tsx';
import ChecklistIcon from '../components/icons/ChecklistIcon.tsx';
import LightbulbIcon from '../components/icons/LightbulbIcon.tsx';

const MercadoNegocio: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MercadoNegocioResponse | null>(null);
  const [error, setError] = useState('');

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      trends: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      prices: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      buyers: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'items'],
      },
      requirements: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'items'],
      },
      differentiation: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
    },
     required: ['trends', 'prices', 'buyers', 'requirements', 'differentiation'],
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData(event.currentTarget);
    const cultivo = formData.get('cultivo') as string;
    const ubicacion = formData.get('ubicacion') as string;
    const mercado = formData.get('mercado') as string;

    const prompt = `
      Actúa como un experto en agronegocios peruanos. Un productor ha proporcionado la siguiente información:
      - Cultivo/Producto: ${cultivo}
      - Ubicación: ${ubicacion}
      - Mercado Objetivo: ${mercado}

      Basado en esta información, proporciona un análisis de mercado conciso y útil en formato JSON.
      Debes proveer títulos claros y accionables para cada sección.
      - trends: Describe las tendencias actuales para este producto.
      - prices: Ofrece un rango de precios estimado.
      - buyers: Nombra 2-3 compradores potenciales.
      - requirements: Menciona 1-2 certificaciones o requisitos importantes.
      - differentiation: Sugiere una forma de diferenciar su producto.
    `;

    try {
      const response = await runJsonQuery(prompt, responseSchema);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error al generar el análisis.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Mercado & Negocio</h2>
      <p className="text-gray-600 mb-6">Inteligencia de Mercados y Comercialización para impulsar sus ventas.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inputs (Entradas)">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="cultivo" className="block text-sm font-medium text-gray-700">Tipo de Cultivo/Producto</label>
              <select id="cultivo" name="cultivo" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                <option>Café</option>
                <option>Cacao</option>
                <option>Banano</option>
                <option>Papa</option>
                <option>Mango</option>
                <option>Uva</option>
                <option>Espárrago</option>
                <option>Palta</option>
              </select>
            </div>
            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación del Productor</label>
              <input type="text" name="ubicacion" id="ubicacion" placeholder="Ej: Cajamarca, Jaén" required className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
                <label htmlFor="mercado" className="block text-sm font-medium text-gray-700">Mercado Objetivo</label>
                <select id="mercado" name="mercado" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                    <option>Nacional</option>
                    <option>Internacional</option>
                </select>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
              {loading ? 'Analizando...' : 'Analizar Mercado'}
            </button>
          </form>
        </Card>

        <Card title="Functionality (Funcionalidad)">
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>Análisis de Tendencias de Mercado en tiempo real.</li>
            <li>Requisitos de Acceso a Mercados (Normativas y Certificaciones).</li>
            <li>Conexión directa con Compradores nacionales e internacionales.</li>
            <li>Identificación de Oportunidades de Diferenciación y nichos.</li>
          </ul>
        </Card>

        <div className="lg:col-span-2">
            <Card title="Outputs (Resultados con IA)">
              {loading && <Spinner />}
              {error && <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>}
              {!loading && !error && !result && <p className="text-gray-500">Los resultados de su análisis aparecerán aquí.</p>}
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <OutputSection title={result.trends.title} icon={<TrendIcon />}>
                    <InfoBlock content={result.trends.content} />
                  </OutputSection>
                  <OutputSection title={result.prices.title} icon={<PriceTagIcon />}>
                    <InfoBlock content={result.prices.content} />
                  </OutputSection>
                  <OutputSection title={result.differentiation.title} icon={<LightbulbIcon />}>
                    <InfoBlock content={result.differentiation.content} />
                  </OutputSection>
                  <OutputSection title={result.buyers.title} icon={<TargetIcon />}>
                    <InfoList items={result.buyers.items} />
                  </OutputSection>
                  <div className="md:col-span-2 lg:col-span-2">
                    <OutputSection title={result.requirements.title} icon={<ChecklistIcon />}>
                        <InfoList items={result.requirements.items} />
                    </OutputSection>
                  </div>
                </div>
              )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default MercadoNegocio;