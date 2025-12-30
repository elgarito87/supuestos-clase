import { GoogleGenAI, Type } from "@google/genai";
import { Student, SimulationEvent } from "../types";
import { MAP_DIMENSIONS, MAP_ZONES, MAP_LAYOUT, IS_WALKABLE } from "../constants";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-3-flash-preview"; // Using the latest recommended model

export const generateSimulationTurn = async (
  students: Student[],
  history: SimulationEvent[],
  teacherInput: string | null
): Promise<{ events: any[]; updatedStudents: any[] }> => {
  
  const recentHistoryStr = history.slice(-15).map(h => 
    `[${h.timestamp}] ${h.agentName ? h.agentName : 'SISTEMA'}: ${h.content}`
  ).join("\n");

  const studentProfiles = students.map(s => 
    `- Alumno: ${s.name} (ID: ${s.id}, Pos: X=${s.position.x}, Y=${s.position.y})\n  Perfil: ${s.personality}\n  Acción Actual: ${s.currentStatus}\n  Pensamiento: ${s.currentThought}`
  ).join("\n\n");

  const asciiMap = MAP_LAYOUT.map((row, y) => 
    row.map((cellId, x) => {
        const student = students.find(s => s.position.x === x && s.position.y === y);
        if (student) return student.name.charAt(0); 
        if (IS_WALKABLE(cellId)) return '.'; 
        return '#'; 
    }).join("")
  ).join("\n");

  const mapContext = `
    MAPA DEL AULA (${MAP_DIMENSIONS.width}x${MAP_DIMENSIONS.height}):
    Leyenda: '.' = Suelo libre, '#' = Obstáculo, Letra = Alumno.
    
    ESTADO DEL GRID:
    ${asciiMap}

    PUNTOS DE INTERÉS:
    ${MAP_ZONES.map(z => `- ${z.label}: (${z.x}, ${z.y})`).join('\n    ')}
  `;

  const instruction = teacherInput 
    ? `EL PROFESOR HA DICHO: "${teacherInput}". Los alumnos deben procesar esta información y reaccionar de forma coherente según su personalidad.`
    : `SIMULACIÓN LIBRE: Los alumnos deben actuar de forma autónoma. Fomenta la movilidad: pueden levantarse, ir al librero, mirar por la ventana, acercarse a otros alumnos para hablar o quedarse en sus sitios. No los mantengas estáticos si su personalidad sugiere movimiento.`;

  const prompt = `
    Actúa como el motor cognitivo de un aula virtual inspirada en "Generative Agents".
    
    ${mapContext}

    AGENTES ESTUDIANTES:
    ${studentProfiles}

    MEMORIA RECIENTE (HISTORIAL):
    ${recentHistoryStr}

    ${instruction}

    REGLAS DE MOVIMIENTO Y COMPORTAMIENTO:
    1. Movimiento: Los alumnos pueden desplazarse a cualquier celda '.' (suelo). No pueden atravesar '#'.
    2. Interacción Social: Si un alumno está cerca de otro (distancia < 3), pueden hablar.
    3. Consistencia: Sus acciones deben derivar de su personalidad y de lo que ha pasado antes.
    4. Pensamiento vs Acción: El pensamiento debe revelar su motivación interna; la acción es lo que los demás ven.
    5. Libertad: ¡No tengas miedo de moverlos! Un alumno curioso irá a investigar, uno atlético estirará, uno social buscará amigos.

    GENERA EL SIGUIENTE TURNO EN FORMATO JSON:
    {
      "updates": [
        {
          "studentName": string,
          "thought": string,
          "action": string,
          "targetX": integer,
          "targetY": integer,
          "newMemory": string
        }
      ]
    }
    Genera actualizaciones para TODOS los estudiantes en cada turno.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            updates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  studentName: { type: Type.STRING },
                  thought: { type: Type.STRING },
                  action: { type: Type.STRING },
                  targetX: { type: Type.INTEGER },
                  targetY: { type: Type.INTEGER },
                  newMemory: { type: Type.STRING }
                },
                required: ["studentName", "thought", "action", "targetX", "targetY", "newMemory"]
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    const updates = json.updates || [];

    const newEvents: any[] = [];
    const updatedStudentData: any[] = [];

    updates.forEach((u: any) => {
      let safeX = Math.max(0, Math.min(MAP_DIMENSIONS.width - 1, u.targetX));
      let safeY = Math.max(0, Math.min(MAP_DIMENSIONS.height - 1, u.targetY));
      
      const targetTileId = MAP_LAYOUT[safeY] ? MAP_LAYOUT[safeY][safeX] : -1;
      
      // Si el destino no es caminable, se queda quieto pero mantiene su estado
      if (!IS_WALKABLE(targetTileId)) {
          const currentS = students.find(s => s.name === u.studentName);
          if (currentS) {
              safeX = currentS.position.x;
              safeY = currentS.position.y;
          }
      }

      newEvents.push({
        type: 'thought',
        agentName: u.studentName,
        content: u.thought
      });

      const isDialogue = u.action.toLowerCase().includes("dice") || u.action.toLowerCase().includes("habla") || u.action.toLowerCase().includes("cuenta");
      newEvents.push({
        type: isDialogue ? 'dialogue' : 'action',
        agentName: u.studentName,
        content: u.action
      });

      updatedStudentData.push({
        name: u.studentName,
        currentStatus: u.action,
        currentThought: u.thought,
        newMemory: u.newMemory,
        position: { x: safeX, y: safeY }
      });
    });

    return { events: newEvents, updatedStudents: updatedStudentData };

  } catch (error) {
    console.error("Error generating simulation step:", error);
    return { events: [], updatedStudents: [] };
  }
};