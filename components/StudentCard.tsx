import React from 'react';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onEdit?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-3 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${student.color}`}>
          {student.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 leading-tight">{student.name}</h3>
          <p className="text-xs text-gray-500 truncate max-w-[150px]">{student.id}</p>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {/* Status Bubble */}
        <div className="bg-gray-50 rounded-lg p-2 text-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">Estado Visible</span>
          <p className="text-gray-700 leading-snug">{student.currentStatus}</p>
        </div>

        {/* Thought Bubble - representing Reflection from the paper */}
        <div className="bg-blue-50 rounded-lg p-2 text-sm border border-blue-100 relative">
          <span className="text-xs font-semibold text-blue-400 uppercase block mb-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clipRule="evenodd" />
            </svg>
            Pensamiento Interno
          </span>
          <p className="text-blue-800 italic leading-snug">"{student.currentThought}"</p>
        </div>
      </div>

      <div className="pt-2">
         <p className="text-xs text-gray-400 line-clamp-2" title={student.personality}>
            <span className="font-semibold text-gray-500">Rasgos:</span> {student.personality}
         </p>
      </div>
    </div>
  );
};

export default StudentCard;
