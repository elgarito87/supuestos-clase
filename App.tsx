import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Student, SimulationEvent, SimulationState, Direction } from './types';
import { INITIAL_STUDENTS, COLORS, MAP_DIMENSIONS, MAP_LAYOUT, IS_WALKABLE } from './constants';
import StudentCard from './components/StudentCard';
import LogFeed from './components/LogFeed';
import ClassroomMap from './components/ClassroomMap';
import { generateSimulationTurn } from './services/geminiService';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [simState, setSimState] = useState<SimulationState>(SimulationState.IDLE);
  const [teacherInput, setTeacherInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(INITIAL_STUDENTS[0].id);
  
  // New student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPersonality, setNewStudentPersonality] = useState('');

  const addLog = (type: SimulationEvent['type'], content: string, agentName?: string) => {
    const newEvent: SimulationEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      content,
      agentName
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleStep = async (input: string | null = null) => {
    if (simState !== SimulationState.IDLE) return;
    setSimState(SimulationState.THINKING);

    if (input) {
      addLog('system', `El Profesor interviene: "${input}"`);
    } else {
      addLog('system', 'Pasa el tiempo...');
    }

    try {
      const result = await generateSimulationTurn(students, events, input);
      
      // Update logs
      result.events.forEach(e => {
        addLog(e.type, e.content, e.agentName);
      });

      // Update students state with new positions AND calculate facing
      setStudents(prevStudents => {
        return prevStudents.map(student => {
          const update = result.updatedStudents.find((u: any) => u.name === student.name);
          if (update) {
            let newFacing: Direction = student.facing;
            const dx = update.position.x - student.position.x;
            const dy = update.position.y - student.position.y;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) newFacing = 'right';
                else if (dx < 0) newFacing = 'left';
            } else if (Math.abs(dy) > 0) {
                if (dy > 0) newFacing = 'front';
                else if (dy < 0) newFacing = 'back';
            }

            return {
              ...student,
              currentStatus: update.currentStatus,
              currentThought: update.currentThought,
              memories: [...student.memories, update.newMemory],
              position: update.position,
              facing: newFacing
            };
          }
          return student;
        });
      });

    } catch (error) {
      console.error(error);
      addLog('system', 'Error al procesar la simulación.');
    } finally {
      setSimState(SimulationState.IDLE);
      setTeacherInput('');
    }
  };

  const handleManualMove = (studentId: string, x: number, y: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        // Calculate direction for manual move
        let newFacing: Direction = s.facing;
        const dx = x - s.position.x;
        const dy = y - s.position.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) newFacing = 'right';
          else if (dx < 0) newFacing = 'left';
        } else if (Math.abs(dy) > 0) {
          if (dy > 0) newFacing = 'front';
          else if (dy < 0) newFacing = 'back';
        }

        addLog('system', `Moviste a ${s.name} a (${x}, ${y})`);
        
        return {
          ...s,
          position: { x, y },
          facing: newFacing,
          currentStatus: 'Se movió a una nueva posición.',
          currentThought: 'El profesor me ha movido aquí.'
        };
      }
      return s;
    }));
  };

  const handleAddStudent = () => {
    if (!newStudentName || !newStudentPersonality) return;
    
    let spawnX = 1;
    let spawnY = 1;
    let found = false;
    for(let y=1; y < MAP_DIMENSIONS.height - 1; y++) {
        for(let x=1; x < MAP_DIMENSIONS.width - 1; x++) {
            if (IS_WALKABLE(MAP_LAYOUT[y][x]) && !students.find(s => s.position.x === x && s.position.y === y)) {
                spawnX = x;
                spawnY = y;
                found = true;
                break;
            }
        }
        if(found) break;
    }

    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStudentName,
      personality: newStudentPersonality,
      currentStatus: 'Acaba de entrar al aula.',
      currentThought: '¿Dónde me siento?',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      memories: ['Llegó al aula'],
      position: { x: spawnX, y: spawnY },
      facing: 'front'
    };

    setStudents([...students, newStudent]);
    addLog('system', `${newStudentName} se ha unido a la clase.`);
    setNewStudentName('');
    setNewStudentPersonality('');
    setIsSidebarOpen(false);
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row max-w-7xl mx-auto p-4 gap-4">
      
      {/* Left Column: Map & Controls */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Aula Generativa</h1>
            <p className="text-gray-500 text-xs md:text-sm">Simulacro espacial (Toca el mapa para mover)</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium hover:bg-indigo-100 transition-colors"
          >
            + Agregar Alumno
          </button>
        </header>

        {/* THE MAP */}
        <ClassroomMap 
          students={students} 
          onStudentClick={setSelectedStudentId}
          onTileClick={(x, y) => selectedStudentId && handleManualMove(selectedStudentId, x, y)}
          selectedStudentId={selectedStudentId}
        />

        {/* Selected Student Detail View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all">
           {selectedStudent ? (
              <div className="animate-fadeIn">
                 <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-bold text-gray-500 uppercase">Detalle del Estudiante</h2>
                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                        Seleccionado (Haz clic en el mapa para mover)
                    </span>
                 </div>
                 <StudentCard student={selectedStudent} />
              </div>
           ) : (
             <div className="text-center text-gray-400 py-8 italic">Selecciona un alumno en el mapa para ver sus detalles o moverlo</div>
           )}
        </div>

        {/* Action Bar */}
        <div className="mt-auto bg-white p-4 rounded-xl shadow-lg border border-gray-200 sticky bottom-4 z-20">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={teacherInput}
              onChange={(e) => setTeacherInput(e.target.value)}
              placeholder="Orden del profesor (ej: '¡Silencio todos!', 'Ana, ve a la pizarra')"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onKeyDown={(e) => e.key === 'Enter' && teacherInput && handleStep(teacherInput)}
            />
            <button
              disabled={simState !== SimulationState.IDLE}
              onClick={() => handleStep(teacherInput || null)}
              className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap
                ${simState !== SimulationState.IDLE 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 active:scale-95'}`}
            >
              {simState !== SimulationState.IDLE ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Simulando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  Siguiente Turno
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Logs */}
      <div className="w-full lg:w-80 flex flex-col gap-4 h-[400px] lg:h-[calc(100vh-2rem)] sticky top-4">
        <LogFeed events={events} />
      </div>

      {/* Modal for adding students */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar Nuevo Alumno</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  placeholder="Ej: Lucia"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personalidad (Semilla)</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-2 h-32 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newStudentPersonality}
                  onChange={e => setNewStudentPersonality(e.target.value)}
                  placeholder="Ej: Es muy curiosa y le gusta interrumpir para preguntar por qué las cosas son como son."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddStudent}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Crear Alumno
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;