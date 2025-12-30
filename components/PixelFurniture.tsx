import React from 'react';

export type FurnitureType = 'desk' | 'teacher_desk' | 'plant' | 'trashcan';

interface PixelFurnitureProps {
  type: FurnitureType;
  className?: string;
}

export const PixelFurniture: React.FC<PixelFurnitureProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'desk':
      return (
        <svg viewBox="0 0 32 32" className={`w-full h-full ${className}`} shapeRendering="crispEdges">
          {/* Top */}
          <rect x="2" y="10" width="28" height="12" fill="#C19A6B" stroke="#5D4037" strokeWidth="2" />
          {/* Legs */}
          <rect x="4" y="22" width="4" height="10" fill="#9E9E9E" />
          <rect x="24" y="22" width="4" height="10" fill="#9E9E9E" />
          {/* Chair hint (tucked in) */}
          <rect x="10" y="22" width="12" height="2" fill="#5D4037" opacity="0.6" />
        </svg>
      );
    case 'teacher_desk':
      return (
        <svg viewBox="0 0 32 32" className={`w-full h-full ${className}`} shapeRendering="crispEdges">
           {/* Main Body */}
           <rect x="2" y="8" width="28" height="16" fill="#8D6E63" stroke="#3E2723" strokeWidth="2" />
           {/* Legs */}
           <rect x="4" y="24" width="6" height="8" fill="#5D4037" />
           <rect x="22" y="24" width="6" height="8" fill="#5D4037" />
           {/* Drawers / Details */}
           <rect x="20" y="10" width="8" height="6" fill="#3E2723" opacity="0.3" />
        </svg>
      );
    case 'trashcan':
       return (
         <svg viewBox="0 0 32 32" className={`w-full h-full ${className}`} shapeRendering="crispEdges">
           <rect x="8" y="10" width="16" height="20" fill="#90A4AE" stroke="#455A64" strokeWidth="2" />
           <line x1="12" y1="12" x2="12" y2="28" stroke="#455A64" />
           <line x1="16" y1="12" x2="16" y2="28" stroke="#455A64" />
           <line x1="20" y1="12" x2="20" y2="28" stroke="#455A64" />
         </svg>
       );
    case 'plant':
       return (
         <svg viewBox="0 0 32 32" className={`w-full h-full ${className}`} shapeRendering="crispEdges">
           <rect x="12" y="20" width="8" height="10" fill="#795548" />
           <rect x="14" y="16" width="4" height="4" fill="#33691E" />
           <circle cx="10" cy="14" r="6" fill="#4CAF50" />
           <circle cx="22" cy="14" r="6" fill="#4CAF50" />
           <circle cx="16" cy="10" r="6" fill="#66BB6A" />
         </svg>
       );
    default:
      return null;
  }
};