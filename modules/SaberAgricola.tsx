import React, { useState } from 'react';
import Card from '../components/Card.tsx';
import { runJsonQuery, fileToGenerativePart } from '../lib/gemini.ts';
import Spinner from '../components/Spinner.tsx';
import { SaberAgricolaResponse } from '../types.ts';
import { Schema, Type } from '@google/genai';
import OutputSection from '../components/OutputSection.tsx';
import InfoList from '../components/InfoList.tsx';
import InfoBlock from '../components/InfoBlock.tsx';

import DiagnosisIcon from '../components/icons/DiagnosisIcon.tsx';
import ActionIcon from '../components/icons/ActionIcon.tsx';
import BookIcon from '../components/icons/BookIcon.tsx';
import ExpertIcon from '../components/icons/ExpertIcon.tsx';
import CameraIcon from '../components/icons/CameraIcon.tsx';

const SaberAgricola: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SaberAgricolaResponse | null>(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      diagnosis: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'items'],
      },
      recommendations: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['title', 'items'],
      },
      training: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
      experts: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
    },
    required: ['diagnosis', 'recommendations', 'training', 'experts'],
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    } else {
        setImageFile(null);
        setImagePreview(null);
    }
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData(event.currentTarget);
    const problema = formData.get('problema') as string;
    const interes = formData.get('interes') as string;

    const prompt = `
      Actúa como un ingeniero agrónomo experto y asesor técnico para agricultores en Perú. Se adjunta una imagen de una planta o cultivo con un problema.
      El productor necesita ayuda con lo siguiente:
      - Problema reportado: "${problema}"
      - Interés de capacitación: "${interes}"

      Basado en el análisis de la IMAGEN y la información proporcionada, proporciona una respuesta útil y estructurada en formato JSON, con títulos claros y accionables para cada sección:

      - diagnosis: Ofrece 2-3 posibles causas del problema, priorizando el diagnóstico visual de la imagen.
      - recommendations: Sugiere 2-3 acciones claras e inmediatas para tratar el problema identificado en la imagen.
      - training: Recomienda 1-2 cursos o guías relevantes.
      - experts: Sugiere qué tipo de institución local (INIA, SENASA, etc.) podría ayudar.
    `;

    try {
      let imagePart = null;
      if (imageFile) {
        imagePart = await fileToGenerativePart(imageFile);
      }
      const response = await runJsonQuery(prompt, responseSchema, imagePart ?? undefined);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error al buscar soluciones.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Saber Agrícola</h2>
      <p className="text-gray-600 mb-6">Su centro de Asistencia Técnica y Capacitación. Potenciado con diagnóstico por imagen.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inputs (Entradas)">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="problema" className="block text-sm font-medium text-gray-700">Reportar Problema</label>
              <input type="text" name="problema" id="problema" placeholder="Ej: Hojas amarillas en mi cafeto" required className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>

            <div>
                 <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Evidencia Visual (Recomendado)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {imagePreview ? (
                             <img src={imagePreview} alt="Vista previa del problema" className="mx-auto h-24 w-auto rounded-md" />
                        ) : (
                            <CameraIcon />
                        )}
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                <span>Subir un archivo</span>
                                <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                            </label>
                            <p className="pl-1">o arrastrar y soltar</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                    </div>
                </div>
            </div>

            <div>
              <label htmlFor="interes" className="block text-sm font-medium text-gray-700">Intereses de Capacitación</label>
              <select id="interes" name="interes" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                <option>Agricultura orgánica</option>
                <option>Riego eficiente</option>
                <option>Manejo post-cosecha</option>
                <option>Manejo de plagas y enfermedades</option>
                <option>Gestión empresarial</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
              {loading ? 'Analizando...' : 'Buscar Soluciones'}
            </button>
          </form>
        </Card>

        <Card title="Functionality (Funcionalidad)">
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>Herramientas para diagnóstico de plagas y enfermedades con IA visual.</li>
            <li>Biblioteca de Mejores Prácticas agrícolas.</li>
            <li>Cursos y tutoriales online en video e infografías.</li>
            <li>Conexión con expertos del INIA y la Red CITE.</li>
          </ul>
        </Card>

        <div className="lg:col-span-2">
            <Card title="Outputs (Resultados con IA)">
              {loading && <Spinner />}
              {error && <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>}
              {!loading && !error && !result && <p className="text-gray-500">Sus recomendaciones personalizadas aparecerán aquí.</p>}
               {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <OutputSection title={result.diagnosis.title} icon={<DiagnosisIcon />}>
                    <InfoList items={result.diagnosis.items} />
                  </OutputSection>
                  <OutputSection title={result.recommendations.title} icon={<ActionIcon />}>
                    <InfoList items={result.recommendations.items} />
                  </OutputSection>
                  <OutputSection title={result.training.title} icon={<BookIcon />}>
                    <InfoBlock content={result.training.content} />
                  </OutputSection>
                  <OutputSection title={result.experts.title} icon={<ExpertIcon />}>
                    <InfoBlock content={result.experts.content} />
                  </OutputSection>
                </div>
              )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default SaberAgricola;