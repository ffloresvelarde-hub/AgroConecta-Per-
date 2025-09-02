
import React, { useState } from 'react';
import Card from '../components/Card';
import { runJsonQuery } from '../lib/gemini';
import Spinner from '../components/Spinner';
import { LogisticaExportacionResponse } from '../types';
import { Schema, Type } from '@google/genai';
import OutputSection from '../components/OutputSection';
import InfoList from '../components/InfoList';
import InfoBlock from '../components/InfoBlock';

import CostIcon from '../components/icons/CostIcon';
import DocumentIcon from '../components/icons/DocumentIcon';
import ShieldIcon from '../components/icons/ShieldIcon';
import NextStepIcon from '../components/icons/NextStepIcon';


const LogisticaExportacion: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LogisticaExportacionResponse | null>(null);
  const [error, setError] = useState('');

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      costing: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'items'],
      },
      documents: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'items'],
      },
      phytosanitary: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      nextStep: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
    },
    required: ['costing', 'documents', 'phytosanitary', 'nextStep'],
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData(event.currentTarget);
    const producto = formData.get('producto') as string;
    const volumen = formData.get('volumen') as string;
    const destino = formData.get('destino') as string;

    const prompt = `
      Actúa como un experto en logística y agroexportación peruana. Un productor quiere exportar y necesita una guía clara.
      - Producto: ${producto}
      - Volumen: ${volumen}
      - País de Destino: ${destino}

      Analiza esta solicitud y proporciona una guía práctica y concisa en formato JSON, con títulos claros y accionables:

      - costing: Estima 3-4 componentes clave del costo de exportación.
      - documents: Lista 2-3 documentos esenciales para esta operación.
      - phytosanitary: Describe el requisito fitosanitario más importante para este producto y destino.
      - nextStep: Aconseja cuál es el primer paso práctico y vital que el productor debe tomar.
    `;

    try {
      const response = await runJsonQuery(prompt, responseSchema);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error al generar la guía.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Logística & Exportación</h2>
      <p className="text-gray-600 mb-6">Guía para simplificar y planificar su proceso de exportación.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inputs (Entradas)">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="producto" className="block text-sm font-medium text-gray-700">Producto a Exportar</label>
              <input type="text" name="producto" id="producto" placeholder="Ej: Palta Hass, Café Orgánico" required className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="volumen" className="block text-sm font-medium text-gray-700">Volumen</label>
              <input type="text" name="volumen" id="volumen" placeholder="Ej: 1 contenedor de 40 pies, 500 kg" required className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
             <div>
              <label htmlFor="destino" className="block text-sm font-medium text-gray-700">País de Destino</label>
              <input type="text" name="destino" id="destino" placeholder="Ej: Países Bajos, Estados Unidos" required className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
              {loading ? 'Generando...' : 'Generar Guía de Exportación'}
            </button>
          </form>
        </Card>

        <Card title="Functionality (Funcionalidad)">
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>Estimación de costos de la cadena logística de exportación.</li>
            <li>Identificación de requisitos de acceso y certificaciones por mercado.</li>
            <li>Generación de checklists de documentación necesaria.</li>
            <li>Conexión con operadores logísticos y agentes de aduana.</li>
          </ul>
        </Card>

        <div className="lg:col-span-2">
            <Card title="Outputs (Resultados con IA)">
              {loading && <Spinner />}
              {error && <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>}
              {!loading && !error && !result && <p className="text-gray-500">Su guía de exportación personalizada aparecerá aquí.</p>}
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <OutputSection title={result.costing.title} icon={<CostIcon />}>
                    <InfoList items={result.costing.items} />
                  </OutputSection>
                   <OutputSection title={result.documents.title} icon={<DocumentIcon />}>
                    <InfoList items={result.documents.items} />
                  </OutputSection>
                  <OutputSection title={result.phytosanitary.title} icon={<ShieldIcon />}>
                    <InfoBlock content={result.phytosanitary.content} />
                  </OutputSection>
                  <OutputSection title={result.nextStep.title} icon={<NextStepIcon />}>
                    <InfoBlock content={result.nextStep.content} />
                  </OutputSection>
                </div>
              )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default LogisticaExportacion;
