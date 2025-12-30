import React from 'react';
import { Student } from '../types';
import { MAP_DIMENSIONS, MAP_LAYOUT, MAP_ZONES, TILE_IDS, IS_WALKABLE } from '../constants';
import { PixelStudent } from './PixelStudent';
import { PixelFurniture, FurnitureType } from './PixelFurniture';

interface ClassroomMapProps {
  students: Student[];
  onStudentClick: (studentId: string) => void;
  onTileClick?: (x: number, y: number) => void;
  selectedStudentId: string | null;
}

const ClassroomMap: React.FC<ClassroomMapProps> = ({ students, onStudentClick, onTileClick, selectedStudentId }) => {
  
  // Helper to render tile graphics based on ID
  const renderTile = (id: number) => {
    switch(id) {
        case TILE_IDS.FLOOR_WOOD:
        case TILE_IDS.FLOOR_WOOD_2:
            return (
                <svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none">
                    <rect width="32" height="32" fill="#C19A6B" /> {/* Wood Base */}
                    <line x1="0" y1="8" x2="32" y2="8" stroke="#A1887F" strokeWidth="0.5" opacity="0.5" />
                    <line x1="0" y1="16" x2="32" y2="16" stroke="#A1887F" strokeWidth="0.5" opacity="0.5" />
                    <line x1="0" y1="24" x2="32" y2="24" stroke="#A1887F" strokeWidth="0.5" opacity="0.5" />
                    {/* Random speckles */}
                    {id === TILE_IDS.FLOOR_WOOD && <rect x="5" y="5" width="1" height="1" fill="#8D6E63" opacity="0.4"/>}
                    {id === TILE_IDS.FLOOR_WOOD && <rect x="25" y="20" width="1" height="1" fill="#8D6E63" opacity="0.4"/>}
                </svg>
            );
        case TILE_IDS.RUG_PURPLE:
            return (
                <svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none">
                    <rect width="32" height="32" fill="#7B1FA2" />
                    <rect x="2" y="2" width="28" height="28" fill="#9C27B0" />
                    <rect x="4" y="4" width="24" height="24" fill="none" stroke="#AB47BC" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
            );
        case TILE_IDS.WALL_TOP:
        case TILE_IDS.WALL_SIDE_LEFT:
        case TILE_IDS.WALL_SIDE_RIGHT:
        case TILE_IDS.WALL_SIDE_BOTTOM:
        case TILE_IDS.WALL_PLAIN:
        case TILE_IDS.WALL_CORNER_TL:
        case TILE_IDS.WALL_CORNER_TR:
        case TILE_IDS.WALL_CORNER_BL:
        case TILE_IDS.WALL_CORNER_BR:
            return (
                 <svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none">
                    <rect width="32" height="32" fill="#ECEFF1" />
                    {(id === TILE_IDS.WALL_TOP || id === TILE_IDS.WALL_CORNER_TL || id === TILE_IDS.WALL_CORNER_TR) && 
                        <rect x="0" y="28" width="32" height="4" fill="#CFD8DC" />}
                    {(id === TILE_IDS.WALL_SIDE_LEFT || id === TILE_IDS.WALL_CORNER_TL || id === TILE_IDS.WALL_CORNER_BL) && 
                        <rect x="28" y="0" width="4" height="32" fill="#CFD8DC" opacity="0.5"/>}
                 </svg>
            );
        case TILE_IDS.CHALKBOARD:
            return (
                <svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none">
                    <rect width="32" height="32" fill="#ECEFF1" />
                    <rect x="0" y="4" width="32" height="24" fill="#1B5E20" stroke="#CFD8DC" strokeWidth="1" />
                    <rect x="2" y="24" width="28" height="2" fill="#455A64" />
                </svg>
            );
        case TILE_IDS.WINDOW:
             return (
                <svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none">
                    <rect width="32" height="32" fill="#ECEFF1" />
                    <rect x="4" y="2" width="24" height="28" fill="#B3E5FC" stroke="#455A64" strokeWidth="2" />
                    <line x1="16" y1="2" x2="16" y2="30" stroke="#455A64" strokeWidth="2" />
                    <line x1="4" y1="16" x2="28" y2="16" stroke="#455A64" strokeWidth="2" />
                </svg>
             );
        case TILE_IDS.DOOR_CLOSED:
             return (
                 <svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none">
                     <rect width="32" height="32" fill="#ECEFF1" />
                     <rect x="4" y="0" width="24" height="32" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
                     <circle cx="24" cy="16" r="2" fill="#FFB74D" />
                 </svg>
             );
        case TILE_IDS.BULLETIN_BOARD:
              return (
                 <svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none">
                     <rect width="32" height="32" fill="#ECEFF1" />
                     <rect x="2" y="4" width="28" height="24" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
                     <rect x="4" y="6" width="24" height="20" fill="#E0C39E" />
                     <rect x="6" y="8" width="6" height="6" fill="#F44336" />
                     <rect x="14" y="10" width="8" height="6" fill="#2196F3" />
                 </svg>
              );
        case TILE_IDS.BOOKSHELF:
              return (
                 <svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none">
                    <rect width="32" height="32" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
                    <line x1="0" y1="10" x2="32" y2="10" stroke="#5D4037" strokeWidth="2" />
                    <line x1="0" y1="20" x2="32" y2="20" stroke="#5D4037" strokeWidth="2" />
                    <rect x="4" y="2" width="4" height="8" fill="#E53935" />
                    <rect x="9" y="2" width="4" height="8" fill="#1E88E5" />
                    <rect x="14" y="2" width="4" height="8" fill="#FDD835" />
                    <rect x="5" y="12" width="4" height="8" fill="#43A047" />
                    <rect x="12" y="12" width="4" height="8" fill="#8E24AA" />
                 </svg>
              );
        default:
            return <div className="w-full h-full bg-gray-200" />;
    }
  }

  const handleTileClick = (x: number, y: number) => {
    if (selectedStudentId && onTileClick && IS_WALKABLE(MAP_LAYOUT[y][x])) {
      onTileClick(x, y);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden select-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Mapa del Aula</h3>
        {selectedStudentId && (
            <span className="text-[10px] text-indigo-500 font-bold animate-pulse uppercase">
                Modo Movimiento Activo
            </span>
        )}
      </div>
      
      <div 
        className="grid relative bg-[#263238] p-0 border-4 border-[#37474F] shadow-2xl overflow-hidden cursor-crosshair"
        style={{
          gridTemplateColumns: `repeat(${MAP_DIMENSIONS.width}, minmax(0, 1fr))`,
          aspectRatio: `${MAP_DIMENSIONS.width}/${MAP_DIMENSIONS.height}`
        }}
      >
        {/* Render Tile Grid */}
        {MAP_LAYOUT.map((row, y) => (
          row.map((tileId, x) => {
            const zone = MAP_ZONES.find(z => z.x === x && z.y === y);
            const isWalkable = IS_WALKABLE(tileId);
            
            return (
              <div 
                key={`cell-${x}-${y}`} 
                onClick={() => handleTileClick(x, y)}
                className={`relative flex items-center justify-center overflow-visible group`}
              >
                {/* 1. Base Tile */}
                <div className="absolute inset-0 z-0">
                    {renderTile(tileId)}
                    {/* Hover effect for movement */}
                    {selectedStudentId && isWalkable && (
                        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors z-10" />
                    )}
                </div>

                {/* 2. Furniture Overlay */}
                {zone && (
                    <div className="relative z-10 w-full h-full pointer-events-none">
                         <PixelFurniture type={zone.type as FurnitureType} />
                    </div>
                )}
              </div>
            );
          })
        ))}

        {/* Render Students */}
        {students.map((student) => {
          const left = (student.position.x / MAP_DIMENSIONS.width) * 100;
          const top = (student.position.y / MAP_DIMENSIONS.height) * 100;
          const width = 100 / MAP_DIMENSIONS.width;
          const height = 100 / MAP_DIMENSIONS.height;
          
          const isSelected = selectedStudentId === student.id;

          return (
            <div
              key={student.id}
              onClick={(e) => {
                e.stopPropagation();
                onStudentClick(student.id);
              }}
              className={`absolute transition-all duration-700 ease-linear cursor-pointer flex flex-col items-center justify-center ${isSelected ? 'z-40' : 'z-30 hover:z-40'}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            >
              <div 
                className={`
                  w-full h-full relative group animate-step
                  ${isSelected ? 'filter drop-shadow-[0_0_4px_#4F46E5]' : ''}
                `}
              >
                <div className="w-[120%] h-[120%] -translate-y-[25%] -translate-x-[10%] transition-transform hover:scale-110">
                    <PixelStudent 
                        className={student.color} 
                        name={student.name} 
                        facing={student.facing} 
                    />
                </div>
                
                {/* Selected Indicator Ring */}
                {isSelected && (
                    <div className="absolute -inset-1 border-2 border-indigo-400 border-dashed rounded-full animate-spin-slow opacity-50 pointer-events-none" />
                )}

                {/* Name Tag */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-[6px] px-1 py-0 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {student.name}
                </div>
              </div>
              
              {/* Dialogue Bubble */}
              {student.currentStatus.toLowerCase().includes('dice') && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[8px] px-1 py-0.5 rounded border border-gray-300 shadow-sm z-40 whitespace-nowrap animate-bounce">
                  💬
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-center flex-wrap">
         <div className="flex items-center gap-1">
             <div className="w-3 h-3 bg-[#C19A6B]"></div> Suelo
         </div>
         <div className="flex items-center gap-1">
             <div className="w-3 h-3 bg-[#7B1FA2]"></div> Alfombra
         </div>
         <div className="flex items-center gap-2 font-medium italic">
            <span>💡 Selecciona un alumno y haz clic en el suelo para moverlo</span>
         </div>
      </div>
      
      <style>{`
        @keyframes step {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-step {
          animation: step 0.8s infinite steps(2); 
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ClassroomMap;