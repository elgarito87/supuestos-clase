import React from 'react';
import { Direction } from '../types';

const SHIRT_COLORS: Record<string, string> = {
  'bg-blue-500': '#1565C0',
  'bg-pink-500': '#AD1457',
  'bg-green-500': '#2E7D32',
  'bg-yellow-500': '#F9A825',
  'bg-purple-500': '#6A1B9A',
  'bg-red-500': '#C62828',
  'bg-indigo-500': '#283593',
  'bg-orange-500': '#EF6C00',
};

// Generates features based on name to keep them consistent
const getFeatures = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);
  
  return {
    skin: seed % 2 === 0 ? '#FFCC80' : '#8D6E63', // Light or Dark
    hair: seed % 3 === 0 ? '#212121' : (seed % 3 === 1 ? '#5D4037' : '#E65100'), // Black, Brown, Ginger
    glasses: seed % 5 === 0
  };
};

interface PixelStudentProps {
    className: string;
    name: string;
    facing?: Direction;
}

export const PixelStudent = ({ className, name, facing = 'front' }: PixelStudentProps) => {
  const shirtColor = SHIRT_COLORS[className] || '#455A64';
  const { skin, hair, glasses } = getFeatures(name);
  
  const isLeft = facing === 'left';
  const transform = isLeft ? 'scale(-1, 1)' : undefined;
  const transformOrigin = isLeft ? 'center' : undefined;

  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md" style={{ transform, transformOrigin }}>
      <g shapeRendering="crispEdges">
         
         {/* --- FRONT VIEW --- */}
         {(facing === 'front' || facing === 'right' || facing === 'left') && (
           <g>
             {/* Legs */}
             <rect x="10" y="20" width="4" height="12" fill="#263238" />
             <rect x="18" y="20" width="4" height="12" fill="#263238" />
             
             {/* Torso */}
             <rect x="8" y="14" width="16" height="10" fill={shirtColor} stroke="#000" strokeWidth="0.5" />
             
             {/* Arms (Resting by side) */}
             <rect x="4" y="14" width="4" height="10" fill={shirtColor} />
             <rect x="24" y="14" width="4" height="10" fill={shirtColor} />
             <rect x="4" y="24" width="4" height="2" fill={skin} /> {/* Hands */}
             <rect x="24" y="24" width="4" height="2" fill={skin} />

             {/* Head */}
             <rect x="10" y="6" width="12" height="8" fill={skin} />
             
             {/* Hair Top */}
             <rect x="8" y="4" width="16" height="4" fill={hair} />
             <rect x="6" y="6" width="2" height="4" fill={hair} /> {/* Sideburns */}
             <rect x="24" y="6" width="2" height="4" fill={hair} />

             {/* Face Features (Only if Front) */}
             {facing === 'front' && (
                <g>
                  <rect x="12" y="8" width="2" height="2" fill="#000" />
                  <rect x="18" y="8" width="2" height="2" fill="#000" />
                  <rect x="14" y="11" width="4" height="1" fill="#000" opacity="0.6" /> {/* Mouth */}
                  {glasses && (
                     <g opacity="0.8">
                       <rect x="11" y="8" width="4" height="2" stroke="#000" strokeWidth="1" fill="none" />
                       <rect x="17" y="8" width="4" height="2" stroke="#000" strokeWidth="1" fill="none" />
                     </g>
                  )}
                </g>
             )}
             
             {/* Profile Specifics */}
             {(facing === 'right' || facing === 'left') && (
                <g>
                   <rect x="22" y="8" width="2" height="2" fill="#000" /> {/* Eye on side */}
                </g>
             )}

           </g>
         )}

         {/* --- BACK VIEW --- */}
         {facing === 'back' && (
           <g>
             {/* Legs */}
             <rect x="10" y="20" width="4" height="12" fill="#263238" />
             <rect x="18" y="20" width="4" height="12" fill="#263238" />
             
             {/* Torso */}
             <rect x="8" y="14" width="16" height="10" fill={shirtColor} stroke="#000" strokeWidth="0.5" />
             
             {/* Arms */}
             <rect x="4" y="14" width="4" height="10" fill={shirtColor} />
             <rect x="24" y="14" width="4" height="10" fill={shirtColor} />
             
             {/* Head */}
             <rect x="10" y="6" width="12" height="8" fill={skin} />
             
             {/* Hair Full Back */}
             <rect x="8" y="4" width="16" height="8" fill={hair} />
           </g>
         )}
      </g>
    </svg>
  );
};