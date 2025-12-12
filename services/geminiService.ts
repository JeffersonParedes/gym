import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY; 
  if (!apiKey) {
    throw new Error("API_KEY not found in environment");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWorkoutRoutine = async (
  memberProfile: string,
  goal: string,
  daysPerWeek: string,
  limitations: string
): Promise<string> => {
  try {
    const ai = getClient();
    
    const prompt = `
      Actúa como un entrenador personal experto de "Club Cross-X".
      Crea una rutina de ejercicios detallada para un cliente con el siguiente perfil:
      
      - Perfil/Nivel: ${memberProfile}
      - Objetivo: ${goal}
      - Frecuencia: ${daysPerWeek} días por semana
      - Lesiones/Limitaciones: ${limitations || 'Ninguna'}

      Formato de salida esperado:
      Devuelve la respuesta en formato Markdown limpio.
      Incluye una tabla para cada día de entrenamiento con: Ejercicio, Series, Repeticiones, Descanso.
      Añade recomendaciones nutricionales breves al final.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar la rutina. Inténtalo de nuevo.";
  } catch (error) {
    console.error("Error generating routine:", error);
    return "Hubo un error al conectar con la IA. Asegúrate de tener una API Key válida.";
  }
};