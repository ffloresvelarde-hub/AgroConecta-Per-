import React, { useState } from 'react';
import Card from '../components/Card';
import { runJsonQuery } from '../lib/gemini';
import Spinner from '../components/Spinner';
import { CreditoProteccionResponse } from '../types';
import { Schema, Type } from '@google/genai';
import OutputSection from '../components/OutputSection';
import InfoList from '../components/InfoList';
import InfoBlock from '../components/InfoBlock';

import BankIcon from '../components/icons/BankIcon';
import ChecklistIcon from '../components/icons/ChecklistIcon';
import ShieldIcon from '../components/icons/ShieldIcon';
import NextStepIcon from '../components/icons/NextStepIcon';

const CreditoProteccion: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreditoProteccionResponse | null>(null);
  const [error, setError] = useState('');

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      financing: {
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
      insurance: {
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
    required: ['financing', 'requirements', 'insurance', 'nextStep'],
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData(event.currentTarget);
    const necesidad = formData.get('necesidad') as string;
    const titulacion = formData.get('titulacion') ? 'Sí' : 'No';
    const seguro = formData.get('seguro') ? 'Sí' : 'No';

    const prompt = `
      Actúa como un asesor financiero especializado en el sector agrícola de Perú. Un productor ha compartido sus necesidades:
      - Necesidad de crédito: S/ ${necesidad}
      - Tiene titulación de tierras: ${titulacion}
      - Interesado en seguro agrícola: ${seguro}

      Analiza esta información y proporciona una recomendación clara en formato JSON, con títulos claros y accionables:

      - financing: Sugiere 2-3 entidades financieras y tipos de producto.
      - requirements: Lista 3-4 requisitos generales para el crédito.
      - insurance: Explica brevemente el beneficio de un seguro y sugiere una opción.
      - nextStep: Aconseja cuál sería el primer paso práctico que debería dar.
    `;

    try {
      const response = await runJsonQuery(prompt, responseSchema);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error al buscar opciones.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Crédito & Protección</h2>
      <p className="text-gray-600 mb-6">Acceso a Financiamiento y Seguros para asegurar su inversión.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inputs (Entradas)">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="necesidad" className="block text-sm font-medium text-gray-700">Necesidad de Crédito</label>
              <input type="number" name="necesidad" id="necesidad" placeholder="Monto en S/" required className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
             <div className="flex items-center">
                <input id="titulacion" name="titulacion" type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                <label htmlFor="titulacion" className="ml-2 block text-sm text-gray-900">Cuento con titulación de tierras</label>
            </div>
             <div className="flex items-center">
                <input id="seguro" name="seguro" type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                <label htmlFor="seguro" className="ml-2 block text-sm text-gray-900">Interesado en Seguro Agrícola</label>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
              {loading ? 'Buscando...' : 'Buscar Opciones'}
            </button>
          </form>
        </Card>

        <Card title="Functionality (Funcionalidad)">
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>Información detallada sobre líneas de crédito de Agrobanco, cajas rurales, etc.</li>
            <li>Asistencia para simplificar la solicitud de créditos y seguros.</li>
            <li>Contenido de educación financiera para mejorar la gestión.</li>
            <li>Guías para la formalización y titulación de tierras.</li>
          </ul>
        </Card>

        <div className="lg:col-span-2">
            <Card title="Outputs (Resultados con IA)">
              {loading && <Spinner />}
              {error && <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>}
              {!loading && !error && !result && <p className="text-gray-500">Sus opciones de crédito y seguro sugeridas aparecerán aquí.</p>}
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <OutputSection title={result.financing.title} icon={<BankIcon />}>
                    <InfoList items={result.financing.items} />
                  </OutputSection>
                  <OutputSection title={result.requirements.title} icon={<ChecklistIcon />}>
                    <InfoList items={result.requirements.items} />
                  </OutputSection>
                   <OutputSection title={result.insurance.title} icon={<ShieldIcon />}>
                    <InfoBlock content={result.insurance.content} />
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

export default CreditoProteccion;
