import React, { useState } from 'react';
import Card from '../components/Card';
import { runJsonQuery } from '../lib/gemini';
import Spinner from '../components/Spinner';
import { ClimaInteligenteResponse } from '../types';
import { Schema, Type } from '@google/genai';
import OutputSection from '../components/OutputSection';
import InfoBlock from '../components/InfoBlock';
import InfoList from '../components/InfoList';

import CloudIcon from '../components/icons/CloudIcon';
import ActionIcon from '../components/icons/ActionIcon';
import LeafIcon from '../components/icons/LeafIcon';
import GpsIcon from '../components/icons/GpsIcon';

const ClimaInteligente: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClimaInteligenteResponse | null>(null);
  const [error, setError] = useState('');

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      forecast: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      recommendations: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'items'],
      },
      practice: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      geolocation: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
    },
    required: ['forecast', 'recommendations', 'practice', 'geolocation'],
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData(event.currentTarget);
    const cultivo = formData.get('cultivo') as string;
    const geolocalizacion = formData.get('geolocalizacion') as string;
    const etapa = formData.get('etapa') as string;

    const prompt = `
      Actúa como un experto en agrometeorología y adaptación al cambio climático en el contexto peruano. Un productor provee los siguientes datos de su parcela:
      - Cultivo: ${cultivo}
      - Ubicación: ${geolocalizacion}
      - Etapa fenológica del cultivo: ${etapa}

      Genera un informe de "Clima Inteligente" en formato JSON con títulos claros y accionables:

      - forecast: Describe los riesgos climáticos más probables para las próximas 2 semanas.
      - recommendations: Ofrece 2-3 recomendaciones de manejo adaptativo específicas.
      - practice: Recomienda una práctica agrícola sostenible a mediano plazo.
      - geolocation: Explica brevemente la importancia de la geolocalización para exportaciones.
    `;

    try {
      const response = await runJsonQuery(prompt, responseSchema);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error al generar el pronóstico.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Clima Inteligente</h2>
      <p className="text-gray-600 mb-6">Herramientas para la Adaptación al Cambio Climático.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inputs (Entradas)">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="cultivo" className="block text-sm font-medium text-gray-700">Tipo de Cultivo</label>
              <input type="text" name="cultivo" id="cultivo" placeholder="Ej: Café, Papa" required className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="geolocalizacion" className="block text-sm font-medium text-gray-700">Ubicación del Cultivo</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input type="text" name="geolocalizacion" id="geolocalizacion" placeholder="Ej: Jaén, Cajamarca" required className="focus:ring-green-500 focus:border-green-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300" />
              </div>
            </div>
             <div>
              <label htmlFor="etapa" className="block text-sm font-medium text-gray-700">Etapa Fenológica</label>
              <select id="etapa" name="etapa" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                <option>Siembra</option>
                <option>Crecimiento</option>
                <option>Floración</option>
                <option>Cosecha</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
              {loading ? 'Generando...' : 'Generar Pronóstico'}
            </button>
          </form>
        </Card>

        <Card title="Functionality (Funcionalidad)">
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>Pronósticos Agrometeorológicos detallados y localizados.</li>
            <li>Recomendaciones de adaptación (manejo de agua, variedades, etc.).</li>
            <li>Monitoreo de salud del suelo y biodiversidad.</li>
            <li>Geolocalización de parcelas para cumplir normativas de exportación.</li>
          </ul>
        </Card>

        <div className="lg:col-span-2">
            <Card title="Outputs (Resultados con IA)">
                {loading && <Spinner />}
                {error && <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>}
                {!loading && !error && !result && <p className="text-gray-500">Sus alertas y guías climáticas aparecerán aquí.</p>}
                 {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <OutputSection title={result.forecast.title} icon={<CloudIcon />}>
                            <InfoBlock content={result.forecast.content} />
                        </OutputSection>
                    </div>
                    <OutputSection title={result.recommendations.title} icon={<ActionIcon />}>
                        <InfoList items={result.recommendations.items} />
                    </OutputSection>
                    <OutputSection title={result.practice.title} icon={<LeafIcon />}>
                        <InfoBlock content={result.practice.content} />
                    </OutputSection>
                    <div className="md:col-span-2">
                        <OutputSection title={result.geolocation.title} icon={<GpsIcon />}>
                            <InfoBlock content={result.geolocation.content} />
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

export default ClimaInteligente;
