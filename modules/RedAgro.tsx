import React, { useState } from 'react';
import Card from '../components/Card.tsx';
import Spinner from '../components/Spinner.tsx';
import { runJsonQuery } from '../lib/gemini.ts';
import { RedAgroResponse } from '../types.ts';
import { Schema, Type } from '@google/genai';
import OutputSection from '../components/OutputSection.tsx';
import InfoBlock from '../components/InfoBlock.tsx';

import NetworkIcon from '../components/icons/NetworkIcon.tsx';
import PencilIcon from '../components/icons/PencilIcon.tsx';
import HandshakeIcon from '../components/icons/HandshakeIcon.tsx';
import GovIcon from '../components/icons/GovIcon.tsx';

const RedAgro: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RedAgroResponse | null>(null);
  const [error, setError] = useState('');
  
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      connections: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      draft: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      advice: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      support: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
    },
    required: ['connections', 'draft', 'advice', 'support'],
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData(event.currentTarget);
    const agrupacion = formData.get('agrupacion') ? 'Busca unirse a una cooperativa/asociación' : 'Busca ofrecer/encontrar un servicio';
    const ubicacion = formData.get('ubicacion') as string;
    const servicio = formData.get('servicio') as string;

    const prompt = `
      Actúa como un facilitador de redes y alianzas para el sector agrícola peruano. Un productor está buscando conectarse:
      - Interés: ${agrupacion}
      - Ubicación: ${ubicacion}
      - Detalles adicionales: "${servicio}"

      Con esta información, genera una respuesta en formato JSON que fomente la colaboración, usando títulos claros y accionables:

      - connections: Sugiere 2 tipos de organizaciones o cooperativas modelo en la región.
      - draft: Crea un borrador de mensaje corto y efectivo para un foro.
      - advice: Ofrece un consejo práctico sobre cómo establecer alianzas exitosas.
      - support: Menciona un programa estatal peruano de apoyo (AGROIDEAS, AGRORURAL).
    `;

    try {
      const response = await runJsonQuery(prompt, responseSchema);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error al publicar en la red.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Red Agro</h2>
      <p className="text-gray-600 mb-6">Plataforma de Colaboración y Alianzas para crecer juntos.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inputs (Entradas)">
          <form className="space-y-4" onSubmit={handleSubmit}>
             <div className="flex items-center">
                <input id="agrupacion" name="agrupacion" type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                <label htmlFor="agrupacion" className="ml-2 block text-sm text-gray-900">Busco unirme a una cooperativa/asociación</label>
            </div>
             <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación (Distrito/Región)</label>
              <input type="text" name="ubicacion" id="ubicacion" placeholder="Ej: Jaén, Cajamarca" required className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="servicio" className="block text-sm font-medium text-gray-700">Ofrecer/Buscar Servicio (Opcional)</label>
              <textarea id="servicio" name="servicio" rows={3} className="max-w-lg shadow-sm block w-full focus:ring-green-500 focus:border-green-500 sm:text-sm border border-gray-300 rounded-md" placeholder="Ej: Ofrezco servicio de transporte refrigerado en la región norte."></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
              {loading ? 'Publicando...' : 'Publicar en la Red'}
            </button>
          </form>
        </Card>

        <Card title="Functionality (Funcionalidad)">
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>Directorio de Organizaciones de Productores a nivel nacional.</li>
            <li>Foros de discusión para compartir experiencias y resolver dudas.</li>
            <li>Facilitador de Alianzas Público-Privadas (AGRORURAL, AGROIDEAS).</li>
            <li>Espacio para compartir recursos (maquinaria, transporte).</li>
          </ul>
        </Card>

        <div className="lg:col-span-2">
            <Card title="Outputs (Resultados con IA)">
               {loading && <Spinner />}
               {error && <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>}
               {!loading && !error && !result && <p className="text-gray-500">Las conexiones y oportunidades sugeridas aparecerán aquí.</p>}
               {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <OutputSection title={result.connections.title} icon={<NetworkIcon />}>
                    <InfoBlock content={result.connections.content} />
                  </OutputSection>
                  <OutputSection title={result.draft.title} icon={<PencilIcon />}>
                    <div className="p-3 bg-gray-100 rounded-md border italic">
                        <InfoBlock content={result.draft.content} />
                    </div>
                  </OutputSection>
                  <OutputSection title={result.advice.title} icon={<HandshakeIcon />}>
                    <InfoBlock content={result.advice.content} />
                  </OutputSection>
                   <OutputSection title={result.support.title} icon={<GovIcon />}>
                    <InfoBlock content={result.support.content} />
                  </OutputSection>
                </div>
              )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default RedAgro;