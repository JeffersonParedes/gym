import React, { useState } from 'react';
import { Member } from '../types';
import { generateWorkoutRoutine } from '../services/geminiService';
import { saveRoutine, getRoutines } from '../services/dataService';

interface RoutinesProps {
  members: Member[];
}

const Routines: React.FC<RoutinesProps> = ({ members }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [goal, setGoal] = useState('Perder peso y tonificar');
  const [days, setDays] = useState('3');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [savedRoutines, setSavedRoutines] = useState(getRoutines());

  const handleGenerate = async () => {
    if (!selectedMemberId) {
      alert("Por favor selecciona un socio.");
      return;
    }

    const member = members.find(m => m.id === selectedMemberId);
    if (!member) return;

    setLoading(true);
    setResult('');
    
    // Call Gemini API
    const routineText = await generateWorkoutRoutine(
      "Intermedio", // Hardcoded for demo, could be a field
      goal,
      days,
      member.medicalConditions || 'Ninguna'
    );

    setResult(routineText);
    setLoading(false);
  };

  const handleSave = () => {
    const member = members.find(m => m.id === selectedMemberId);
    if (member && result) {
      const newRoutine = saveRoutine({
        memberId: member.id,
        memberName: `${member.firstName} ${member.lastName}`,
        generatedContent: result,
        goal: goal
      });
      setSavedRoutines([...savedRoutines, newRoutine]);
      alert("Rutina guardada exitosamente.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      
      {/* Configuration Panel */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Generador de Rutinas IA</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Socio</label>
            <select 
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
            >
              <option value="">-- Seleccionar Socio --</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
              ))}
            </select>
            {selectedMemberId && members.find(m => m.id === selectedMemberId)?.medicalConditions && (
               <p className="text-xs text-red-500 mt-1">
                 ⚠ Nota: Usuario tiene condición médica: {members.find(m => m.id === selectedMemberId)?.medicalConditions}
               </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ej. Hipertrofia, Resistencia..."
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Días por Semana</label>
             <select 
               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
               value={days}
               onChange={(e) => setDays(e.target.value)}
             >
               <option value="2">2 Días</option>
               <option value="3">3 Días</option>
               <option value="4">4 Días</option>
               <option value="5">5 Días</option>
               <option value="6">6 Días</option>
             </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              loading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
            }`}
          >
            {loading ? 'Generando con Gemini...' : 'Generar Rutina'}
          </button>
        </div>

        {/* History Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-semibold text-gray-800 mb-3">Historial Reciente</h3>
           <div className="space-y-3">
             {savedRoutines.slice(-3).reverse().map(routine => (
               <div key={routine.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                 <p className="font-medium text-gray-900">{routine.memberName}</p>
                 <p className="text-gray-500 text-xs">Objetivo: {routine.goal}</p>
                 <p className="text-gray-400 text-xs mt-1">{new Date(routine.createdAt).toLocaleDateString()}</p>
               </div>
             ))}
             {savedRoutines.length === 0 && <p className="text-gray-400 text-sm">No hay rutinas guardadas.</p>}
           </div>
        </div>
      </div>

      {/* Result Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Resultado</h3>
          {result && (
            <button onClick={handleSave} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200">
              Guardar Rutina
            </button>
          )}
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 font-mono text-sm">
          {loading ? (
             <div className="flex items-center justify-center h-full text-indigo-600 animate-pulse">
               Creando el plan perfecto...
             </div>
          ) : result ? (
            <pre className="whitespace-pre-wrap font-sans text-gray-700">{result}</pre>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Configura los parámetros y genera una rutina.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Routines;