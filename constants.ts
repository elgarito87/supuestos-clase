import { Student } from "./types";

// Tile IDs from JSON
export const TILE_IDS = {
  FLOOR_WOOD: 0,
  FLOOR_WOOD_2: 1, // Alternativo
  FLOOR_TILE: 2,
  FLOOR_TILE_2: 3,
  RUG_PURPLE: 4,
  WALL_PLAIN: 5,
  WALL_TOP: 6,
  CHALKBOARD: 7,
  WHITEBOARD: 8,
  WINDOW: 9,
  DOOR_CLOSED: 10,
  BULLETIN_BOARD: 11,
  BOOKSHELF: 12,
  WALL_CORNER_TL: 13,
  WALL_CORNER_TR: 14,
  WALL_CORNER_BL: 15,
  WALL_CORNER_BR: 16,
  WALL_SIDE_LEFT: 17,
  WALL_SIDE_RIGHT: 18,
  WALL_SIDE_BOTTOM: 19
};

// Helper to define walkable areas (Floors and Rugs)
export const IS_WALKABLE = (id: number) => {
  return [
    TILE_IDS.FLOOR_WOOD, 
    TILE_IDS.FLOOR_WOOD_2, 
    TILE_IDS.FLOOR_TILE, 
    TILE_IDS.FLOOR_TILE_2, 
    TILE_IDS.RUG_PURPLE
  ].includes(id);
};

export const MAP_DIMENSIONS = { width: 20, height: 15 };

// Constructed Map based on the visual layout
export const MAP_LAYOUT = [
  [13, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 14], 
  [17, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], 
  [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], 
  [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], 
  [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18], 
  [15, 19, 19, 19, 19, 19, 19, 19, 19, 19, 10, 19, 19, 19, 19, 19, 19, 19, 19, 16] 
];

export const MAP_ZONES = [
  { x: 9, y: 2, label: 'Escritorio Profe', type: 'teacher_desk' },
  { x: 2, y: 12, label: 'Planta', type: 'plant' },
  { x: 17, y: 12, label: 'Papelera', type: 'trashcan' },
  // Pupitres
  { x: 6, y: 5, label: 'Pupitre', type: 'desk' },
  { x: 8, y: 5, label: 'Pupitre', type: 'desk' },
  { x: 12, y: 5, label: 'Pupitre', type: 'desk' },
  { x: 14, y: 5, label: 'Pupitre', type: 'desk' },
  { x: 6, y: 7, label: 'Pupitre', type: 'desk' },
  { x: 8, y: 7, label: 'Pupitre', type: 'desk' },
  { x: 12, y: 7, label: 'Pupitre', type: 'desk' },
  { x: 14, y: 7, label: 'Pupitre', type: 'desk' },
  { x: 6, y: 9, label: 'Pupitre', type: 'desk' },
  { x: 8, y: 9, label: 'Pupitre', type: 'desk' },
  { x: 12, y: 9, label: 'Pupitre', type: 'desk' },
  { x: 14, y: 9, label: 'Pupitre', type: 'desk' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Mateo',
    personality: 'Extrovertido y bromista. Siempre busca hacer reír a los demás, incluso en medio de clase. Se distrae con facilidad.',
    currentStatus: 'Sentado, buscando a quién contarle un chiste.',
    currentThought: '¿Cómo se dice espejo en chino? "Aitoiyo".',
    color: 'bg-blue-500',
    memories: ['Llegó a clase con ganas de fiesta'],
    position: { x: 6, y: 6 },
    facing: 'back'
  },
  {
    id: 's2',
    name: 'Sofía',
    personality: 'Responsable y perfeccionista. Delegada de la clase. Le gusta que todo esté en orden y sigue las reglas al pie de la letra.',
    currentStatus: 'Revisando que todos tengan sus materiales.',
    currentThought: 'Espero que hoy no haya mucho caos.',
    color: 'bg-green-500',
    memories: ['Anotó la tarea en su agenda'],
    position: { x: 8, y: 6 },
    facing: 'back'
  },
  {
    id: 's3',
    name: 'Carlos',
    personality: 'Tímido y observador. Le apasionan los videojuegos y la tecnología. Prefiere escuchar que hablar.',
    currentStatus: 'Mirando su cuaderno de dibujos.',
    currentThought: 'Ojalá pudiera programar un mod para esto.',
    color: 'bg-red-500',
    memories: ['Evitó el contacto visual al entrar'],
    position: { x: 12, y: 6 },
    facing: 'back'
  },
  {
    id: 's4',
    name: 'Ana',
    personality: 'Atlética y competitiva. No puede estar mucho tiempo sentada. Tiene mucha energía y siempre quiere moverse.',
    currentStatus: 'Moviendo la pierna nerviosamente.',
    currentThought: '¿Cuánto falta para gimnasia?',
    color: 'bg-yellow-500',
    memories: ['Subió las escaleras corriendo'],
    position: { x: 14, y: 6 },
    facing: 'back'
  },
  {
    id: 's5',
    name: 'Lucía',
    personality: 'Artista y soñadora. Se pierde en sus pensamientos. Siempre tiene un lápiz en la mano dibujando en los márgenes.',
    currentStatus: 'Mirando por la ventana pensativa.',
    currentThought: 'Esa nube parece un dragón comiendo pizza.',
    color: 'bg-pink-500',
    memories: ['Encontró una piedra brillante en el patio'],
    position: { x: 18, y: 4 },
    facing: 'right'
  },
  {
    id: 's6',
    name: 'Hugo',
    personality: 'Curioso y analítico. Le encanta la ciencia. Siempre pregunta "¿por qué?" a todo lo que dice el profesor.',
    currentStatus: 'Cerca de la pizarra examinando una tiza.',
    currentThought: 'Si la tiza es calcio, ¿por qué no sabe a leche?',
    color: 'bg-purple-500',
    memories: ['Leyó un dato sobre hormigas esta mañana'],
    position: { x: 7, y: 1 },
    facing: 'front'
  },
  {
    id: 's7',
    name: 'Elena',
    personality: 'Social y carismática. Conoce todos los cotilleos. Le encanta organizar eventos y juntar a la gente.',
    currentStatus: 'Caminando hacia el pupitre de Sofía.',
    currentThought: 'Tengo que contarle a Sofía lo que pasó en el recreo de ayer.',
    color: 'bg-orange-500',
    memories: ['Habló con tres personas antes de entrar'],
    position: { x: 9, y: 8 },
    facing: 'left'
  },
  {
    id: 's8',
    name: 'Bruno',
    personality: 'Tranquilo y bondadoso. Le gusta leer y ayudar a los demás. Es el mediador cuando hay conflictos.',
    currentStatus: 'En el librero buscando algo nuevo.',
    currentThought: 'Este libro de historia parece interesante.',
    color: 'bg-indigo-500',
    memories: ['Le prestó un borrador a Mateo'],
    position: { x: 1, y: 2 },
    facing: 'back'
  },
  {
    id: 's9',
    name: 'Valentina',
    personality: 'Directa y ambiciosa. Quiere ser la mejor en todo. No tiene miedo de decir lo que piensa.',
    currentStatus: 'Sentada rígidamente esperando instrucciones.',
    currentThought: 'Voy a sacar la nota más alta del examen.',
    color: 'bg-red-700',
    memories: ['Repasó tres veces el tema anoche'],
    position: { x: 12, y: 8 },
    facing: 'back'
  },
  {
    id: 's10',
    name: 'Diego',
    personality: 'Creativo y un poco desordenado. Siempre tararea canciones. Le cuesta seguir el ritmo de la clase porque vive en su propio mundo musical.',
    currentStatus: 'Tarareando una melodía mientras ordena su mochila.',
    currentThought: 'Do-re-mi... esa nota no encaja.',
    color: 'bg-teal-500',
    memories: ['Perdió su lápiz azul, otra vez'],
    position: { x: 14, y: 10 },
    facing: 'front'
  }
];

export const COLORS = [
  'bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-red-500', 'bg-indigo-500', 'bg-orange-500',
  'bg-teal-500', 'bg-red-700'
];