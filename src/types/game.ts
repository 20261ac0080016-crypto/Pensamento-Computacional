export type PillarId = 'decomposition' | 'patterns' | 'abstraction' | 'algorithms';

export type GameViewState = 'TITLE_MENU' | 'PLAYING' | 'PILLAR_SUMMARY' | 'CAMPAIGN_COMPLETE';

export interface PillarMeta {
  id: PillarId;
  order: number;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  imagePath: string;
  accentHex: string;
  accentBgClass: string;
  accentTextClass: string;
  accentBorderClass: string;
  accentSoftBgClass: string;
}

/* --- Pillar 1: Decomposition --- */
export interface DecompositionTask {
  id: string;
  label: string;
  targetBucketId: string; // 'discard' if it is an irrelevant/noise task
}

export interface DecompositionBucket {
  id: string;
  title: string;
  subtitle: string;
}

export interface DecompositionLevel {
  id: string;
  levelNumber: number;
  title: string;
  scenario: string;
  instruction: string;
  buckets: DecompositionBucket[];
  hasDiscardBin: boolean;
  tasks: DecompositionTask[];
  hints: string[];
  explanation: string;
}

/* --- Pillar 2: Pattern Recognition --- */
export type PatternTokenShape = 'circle' | 'triangle' | 'square' | 'diamond';
export type PatternTokenColor = 'amber' | 'cobalt' | 'emerald' | 'slate';

export interface PatternToken {
  shape: PatternTokenShape;
  color: PatternTokenColor;
  rotation?: number; // 0, 90, 180, 270
  value?: number | string;
}

export interface PatternSlot {
  id: string;
  token: PatternToken | null; // null means editable target slot
  expectedToken: PatternToken;
}

export interface PatternRuleOption {
  id: string;
  label: string;
}

export interface PatternLevel {
  id: string;
  levelNumber: number;
  mode: 'sequence' | 'matrix' | 'motif';
  title: string;
  scenario: string;
  instruction: string;
  gridCols: number;
  slots: PatternSlot[];
  palette: PatternToken[];
  ruleQuestion: string;
  ruleOptions: PatternRuleOption[];
  correctRuleId: string;
  hints: string[];
  explanation: string;
}

/* --- Pillar 3: Abstraction --- */
export interface AbstractionAttribute {
  id: string;
  label: string;
  detail: string;
  isEssential: boolean;
  visualTag: string; // used by the live SVG schematic preview
}

export interface AbstractionLevel {
  id: string;
  levelNumber: number;
  previewType: 'metro' | 'library' | 'delivery';
  title: string;
  scenario: string;
  goal: string;
  instruction: string;
  attributes: AbstractionAttribute[];
  hints: string[];
  explanation: string;
}

/* --- Pillar 4: Algorithms --- */
export type Direction = 'N' | 'E' | 'S' | 'W';

export type AlgoCommandType = 'MOVE' | 'LEFT' | 'RIGHT' | 'COLLECT' | 'LOOP_2' | 'LOOP_3';

export interface AlgoInstruction {
  uid: string;
  type: AlgoCommandType;
  body?: AlgoCommandType[]; // used when type is LOOP_2 or LOOP_3
}

export interface GridCoord {
  r: number;
  c: number;
}

export interface AlgorithmLevel {
  id: string;
  levelNumber: number;
  title: string;
  scenario: string;
  instruction: string;
  gridSize: number;
  start: { r: number; c: number; dir: Direction };
  goal: GridCoord;
  walls: GridCoord[];
  crystals: GridCoord[];
  allowedCommands: AlgoCommandType[];
  maxBlocks: number;
  optimalBlocks: number;
  hints: string[];
  explanation: string;
}

export interface LevelCompletionRecord {
  completed: boolean;
  bestScore: number;
  attempts: number;
}

export type ProgressMap = Record<string, LevelCompletionRecord>;
