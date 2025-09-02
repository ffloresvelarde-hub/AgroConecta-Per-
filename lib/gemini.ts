import { GoogleGenAI, GenerateContentResponse, Schema } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. Please set it.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string; } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') {
        return reject(new Error("Failed to read file as data URL."));
      }
      // result is "data:mime/type;base64,..."
      const base64Data = result.split(',')[1];
      if (!base64Data) {
         return reject(new Error("Could not extract base64 data from file."));
      }
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (err) => {
        reject(err);
    }
    reader.readAsDataURL(file);
  });
}


export async function runJsonQuery(
    prompt: string, 
    schema: Schema,
    imagePart?: { inlineData: { data: string; mimeType: string; } }
): Promise<any> {
  if (!API_KEY) {
    throw new Error("La clave de API no está configurada. Por favor, contacte al soporte técnico.");
  }
  
  try {
    const contents = imagePart ? { parts: [imagePart, { text: prompt }] } : prompt;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
    });

    const jsonText = response.text.trim();
    // The response can still sometimes have markdown, so we clean it.
    const cleanedJsonText = jsonText.startsWith('```json') ? jsonText.replace(/^```json\n|```$/g, '') : jsonText;
    
    return JSON.parse(cleanedJsonText);
  } catch (error) {
    console.error("Error calling Gemini API or parsing JSON:", error);
    if (error instanceof Error) {
        throw new Error(`Error al contactar el modelo de IA o procesar su respuesta: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al contactar el modelo de IA.");
  }
}
