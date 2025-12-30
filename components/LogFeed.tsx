import React, { useEffect, useRef } from 'react';
import { SimulationEvent } from '../types';

interface LogFeedProps {
  events: SimulationEvent[];
}

const LogFeed: React.FC<LogFeedProps> = ({ events }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="h-full flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial de Simulación
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {events.length === 0 && (
          <p className="text-center text-gray-400 text-sm italic mt-10">La simulación aún no ha comenzado.</p>
        )}
        
        {events.map((event) => (
          <div key={event.id} className={`flex flex-col animate-fadeIn`}>
            {event.type === 'system' ? (
              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{event.content}</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
            ) : (
              <div className={`relative pl-4 border-l-2 ${
                event.type === 'thought' ? 'border-blue-200' : 
                event.type === 'dialogue' ? 'border-green-400' : 'border-gray-300'
              }`}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-sm text-gray-800">{event.agentName}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                    {event.type === 'dialogue' ? 'Dijo' : event.type === 'thought' ? 'Pensó' : 'Hizo'}
                  </span>
                </div>
                <p className={`text-sm ${
                  event.type === 'thought' ? 'text-blue-600 italic' : 
                  event.type === 'dialogue' ? 'text-green-900 font-medium' : 'text-gray-600'
                }`}>
                  {event.content}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LogFeed;
