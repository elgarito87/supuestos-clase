export interface Position {
  x: number;
  y: number;
}

export type Direction = 'front' | 'back' | 'left' | 'right';

export interface Student {
  id: string;
  name: string;
  personality: string; // The "seed memory" or description
  currentStatus: string; // Current visible action
  currentThought: string; // Internal reflection
  color: string; // Avatar color
  memories: string[]; // Short-term memory stream
  position: Position; // Coordinates on the grid
  facing: Direction; // Visual direction
}

export interface SimulationEvent {
  id: string;
  timestamp: string;
  type: 'action' | 'dialogue' | 'thought' | 'system';
  agentId?: string; // Null if system event
  agentName?: string;
  content: string;
}

export enum SimulationState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  GENERATING = 'GENERATING',
}