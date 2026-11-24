import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Flag,
  Gem,
  Play,
  Plus,
  Repeat,
  RotateCcw,
  RotateCw,
  Square,
  Trash2,
} from 'lucide-react';
import {
  AlgoCommandType,
  AlgoInstruction,
  AlgorithmLevel,
  Direction,
} from '../../types/game';
import { sound } from '../../utils/sound';
import { ConceptDeck } from '../ConceptDeck';

interface AlgorithmsLabProps {
  level: AlgorithmLevel;
  isLastLevelInPillar: boolean;
  onComplete: (score: number, attempts: number) => void;
  onNext: () => void;
}

const COMMAND_LABELS: Record<AlgoCommandType, string> = {
  MOVE: 'Avançar',
  LEFT: 'Girar Esq.',
  RIGHT: 'Girar Dir.',
  COLLECT: 'Coletar',
  LOOP_2: 'Repetir 2×',
  LOOP_3: 'Repetir 3×',
};

const DIR_ROTATION: Record<Direction, number> = {
  N: 0,
  E: 90,
  S: 180,
  W: 270,
};

const turnLeft = (d: Direction): Direction =>
  d === 'N' ? 'W' : d === 'W' ? 'S' : d === 'S' ? 'E' : 'N';

const turnRight = (d: Direction): Direction =>
  d === 'N' ? 'E' : d === 'E' ? 'S' : d === 'S' ? 'W' : 'N';

const stepForward = (r: number, c: number, d: Direction) => {
  if (d === 'N') return { r: r - 1, c };
  if (d === 'E') return { r, c: c + 1 };
  if (d === 'S') return { r: r + 1, c };
  return { r, c: c - 1 };
};

interface FlattenedStep {
  cmd: AlgoCommandType;
  instructionUid: string;
}

export const AlgorithmsLab: React.FC<AlgorithmsLabProps> = ({
  level,
  isLastLevelInPillar,
  onComplete,
  onNext,
}) => {
  const [program, setProgram] = useState<AlgoInstruction[]>([]);
  const [activeLoopUid, setActiveLoopUid] = useState<string | null>(null);

  const [robotPos, setRobotPos] = useState({ r: level.start.r, c: level.start.c });
  const [robotDir, setRobotDir] = useState<Direction>(level.start.dir);
  const [collectedKeys, setCollectedKeys] = useState<Set<string>>(new Set());
  const [activeStepUid, setActiveStepUid] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [revealedHints, setRevealedHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const timerRef = useRef<number | null>(null);

  const clearRunTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetSimulationOnly = () => {
    clearRunTimer();
    setIsRunning(false);
    setRobotPos({ r: level.start.r, c: level.start.c });
    setRobotDir(level.start.dir);
    setCollectedKeys(new Set());
    setActiveStepUid(null);
  };

  useEffect(() => {
    clearRunTimer();
    setProgram([]);
    setActiveLoopUid(null);
    setRobotPos({ r: level.start.r, c: level.start.c });
    setRobotDir(level.start.dir);
    setCollectedKeys(new Set());
    setActiveStepUid(null);
    setIsRunning(false);
    setRevealedHints(0);
    setAttempts(0);
    setStatus('idle');
    setFeedbackMessage('');
    return () => clearRunTimer();
  }, [level]);

  // Count total blocks (top-level + loop body blocks)
  const totalBlockCount = program.reduce(
    (sum, inst) => sum + 1 + (inst.body ? inst.body.length : 0),
    0
  );

  const handleAddCommand = (cmd: AlgoCommandType) => {
    if (isRunning || status === 'success') return;
    if (totalBlockCount >= level.maxBlocks) {
      sound.error();
      return;
    }

    if (cmd === 'LOOP_2' || cmd === 'LOOP_3') {
      if (activeLoopUid) {
        // Exit loop mode if clicking loop again, or add new top-level loop
        setActiveLoopUid(null);
      }
      const newUid = `inst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      sound.place();
      setProgram((prev) => [...prev, { uid: newUid, type: cmd, body: [] }]);
      setActiveLoopUid(newUid);
    } else if (activeLoopUid) {
      sound.place();
      setProgram((prev) =>
        prev.map((inst) =>
          inst.uid === activeLoopUid && inst.body
            ? { ...inst, body: [...inst.body, cmd] }
            : inst
        )
      );
    } else {
      sound.place();
      const newUid = `inst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setProgram((prev) => [...prev, { uid: newUid, type: cmd }]);
    }

    if (status === 'error') {
      setStatus('idle');
      setFeedbackMessage('');
    }
  };

  const handleRemoveInstruction = (uid: string) => {
    if (isRunning || status === 'success') return;
    sound.click();
    setProgram((prev) => prev.filter((i) => i.uid !== uid));
    if (activeLoopUid === uid) setActiveLoopUid(null);
  };

  const handleRemoveLoopChild = (loopUid: string, childIndex: number) => {
    if (isRunning || status === 'success') return;
    sound.click();
    setProgram((prev) =>
      prev.map((inst) =>
        inst.uid === loopUid && inst.body
          ? { ...inst, body: inst.body.filter((_, idx) => idx !== childIndex) }
          : inst
      )
    );
  };

  const handleResetAll = () => {
    sound.click();
    resetSimulationOnly();
    setProgram([]);
    setActiveLoopUid(null);
    setStatus('idle');
    setFeedbackMessage('');
  };

  const flattenProgram = (): FlattenedStep[] => {
    const steps: FlattenedStep[] = [];
    for (const inst of program) {
      if ((inst.type === 'LOOP_2' || inst.type === 'LOOP_3') && inst.body) {
        const count = inst.type === 'LOOP_2' ? 2 : 3;
        for (let k = 0; k < count; k++) {
          for (const subCmd of inst.body) {
            steps.push({ cmd: subCmd, instructionUid: inst.uid });
          }
        }
      } else {
        steps.push({ cmd: inst.type, instructionUid: inst.uid });
      }
    }
    return steps;
  };

  const handleExecute = () => {
    if (isRunning || program.length === 0) return;

    const steps = flattenProgram();
    if (steps.length === 0) {
      sound.error();
      setStatus('error');
      setFeedbackMessage('O bloco de repetição está vazio. Adicione comandos dentro dele.');
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    resetSimulationOnly();
    setStatus('idle');
    setFeedbackMessage('');
    setIsRunning(true);

    let r = level.start.r;
    let c = level.start.c;
    let dir: Direction = level.start.dir;
    const collected = new Set<string>();
    let stepIdx = 0;

    const isWall = (rr: number, cc: number) =>
      level.walls.some((w) => w.r === rr && w.c === cc);
    const hasCrystal = (rr: number, cc: number) =>
      level.crystals.some((cr) => cr.r === rr && cr.c === cc);

    const runNextStep = () => {
      if (stepIdx >= steps.length) {
        setIsRunning(false);
        setActiveStepUid(null);

        const atGoal = r === level.goal.r && c === level.goal.c;
        const allCollected = collected.size === level.crystals.length;

        if (atGoal && allCollected) {
          sound.success();
          const efficiencyBonus = totalBlockCount <= level.optimalBlocks ? 10 : 0;
          const score = Math.min(
            100,
            Math.max(60, 90 + efficiencyBonus - (nextAttempts - 1) * 10 - revealedHints * 10)
          );
          setStatus('success');
          setFeedbackMessage(
            `Algoritmo executado com sucesso! Todos os cristais foram coletados e o robô alcançou o farol (+${score} pts).`
          );
          onComplete(score, nextAttempts);
        } else {
          sound.error();
          setStatus('error');
          if (!allCollected) {
            setFeedbackMessage(
              `O programa terminou, mas faltou coletar ${
                level.crystals.length - collected.size
              } cristal(is) antes de encerrar.`
            );
          } else {
            setFeedbackMessage(
              'O robô não terminou sobre o farol de destino. Ajuste os comandos e tente novamente.'
            );
          }
        }
        return;
      }

      const current = steps[stepIdx];
      setActiveStepUid(current.instructionUid);

      if (current.cmd === 'MOVE') {
        const next = stepForward(r, c, dir);
        if (
          next.r < 0 ||
          next.r >= level.gridSize ||
          next.c < 0 ||
          next.c >= level.gridSize ||
          isWall(next.r, next.c)
        ) {
          sound.error();
          setIsRunning(false);
          setActiveStepUid(null);
          setStatus('error');
          setFeedbackMessage(
            'Colisão detectada! O robô tentou avançar contra um muro ou para fora da pista.'
          );
          return;
        }
        r = next.r;
        c = next.c;
        sound.step();
        setRobotPos({ r, c });
      } else if (current.cmd === 'LEFT') {
        dir = turnLeft(dir);
        sound.click();
        setRobotDir(dir);
      } else if (current.cmd === 'RIGHT') {
        dir = turnRight(dir);
        sound.click();
        setRobotDir(dir);
      } else if (current.cmd === 'COLLECT') {
        const key = `${r},${c}`;
        if (hasCrystal(r, c) && !collected.has(key)) {
          collected.add(key);
          sound.collect();
          setCollectedKeys(new Set(collected));
        } else {
          sound.click();
        }
      }

      stepIdx += 1;
      timerRef.current = window.setTimeout(runNextStep, 320);
    };

    timerRef.current = window.setTimeout(runNextStep, 220);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Interactive Stage: Grid Arena + Program Track */}
      <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-medium text-indigo-700">Pilar 04 · Algoritmos</p>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Arena do Robô & Sequência de Comandos
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 tabular-nums">
            <span>
              Cristais: {collectedKeys.size}/{level.crystals.length}
            </span>
            <span aria-hidden="true">·</span>
            <span className={totalBlockCount >= level.maxBlocks ? 'text-amber-700 font-bold' : ''}>
              Blocos: {totalBlockCount}/{level.maxBlocks}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* 2D Grid Map */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div
              className="grid gap-1.5 p-3 bg-slate-100 rounded-xl border border-slate-200 w-full max-w-[340px]"
              style={{
                gridTemplateColumns: `repeat(${level.gridSize}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: level.gridSize * level.gridSize }).map((_, idx) => {
                const r = Math.floor(idx / level.gridSize);
                const c = idx % level.gridSize;
                const wall = level.walls.some((w) => w.r === r && w.c === c);
                const crystal = level.crystals.some((cr) => cr.r === r && cr.c === c);
                const crystalCollected = collectedKeys.has(`${r},${c}`);
                const isGoal = level.goal.r === r && level.goal.c === c;
                const isRobotHere = robotPos.r === r && robotPos.c === c;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square rounded-lg flex items-center justify-center relative transition-colors ${
                      wall
                        ? 'bg-slate-800 border border-slate-900'
                        : isGoal
                        ? 'bg-emerald-50 border-2 border-emerald-500'
                        : 'bg-white border border-slate-200'
                    }`}
                  >
                    {isGoal && !isRobotHere && (
                      <Flag className="w-5 h-5 text-emerald-600" aria-label="Destino" />
                    )}

                    {crystal && !crystalCollected && (
                      <Gem className="w-5 h-5 text-amber-500" aria-label="Cristal" />
                    )}

                    {isRobotHere && (
                      <div
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm transition-transform duration-200"
                        style={{ transform: `rotate(${DIR_ROTATION[robotDir]}deg)` }}
                        aria-label={`Robô olhando para ${robotDir}`}
                      >
                        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Gem className="w-3.5 h-3.5 text-amber-500" /> Cristal
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-emerald-600" /> Farol
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5 fill-slate-800 text-slate-800" /> Muro
              </span>
            </div>
          </div>

          {/* Command Palette & Program Track */}
          <div className="md:col-span-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600">
                1. Adicione blocos ao algoritmo:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {level.allowedCommands.map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    disabled={isRunning || status === 'success' || totalBlockCount >= level.maxBlocks}
                    onClick={() => handleAddCommand(cmd)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                      cmd === 'LOOP_2' || cmd === 'LOOP_3'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {cmd === 'MOVE' && <ArrowUp className="w-3.5 h-3.5" />}
                    {cmd === 'LEFT' && <RotateCcw className="w-3.5 h-3.5" />}
                    {cmd === 'RIGHT' && <RotateCw className="w-3.5 h-3.5" />}
                    {cmd === 'COLLECT' && <Gem className="w-3.5 h-3.5 text-amber-600" />}
                    {(cmd === 'LOOP_2' || cmd === 'LOOP_3') && <Repeat className="w-3.5 h-3.5" />}
                    <span>{COMMAND_LABELS[cmd]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Program Sequence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600">
                  2. Sequência atual ({program.length} blocos principais):
                </p>
                {activeLoopUid && (
                  <button
                    type="button"
                    onClick={() => setActiveLoopUid(null)}
                    className="text-xs font-semibold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Sair do Laço
                  </button>
                )}
              </div>

              <div className="min-h-[160px] max-h-[260px] overflow-y-auto p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                {program.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">
                    Clique nos comandos acima para montar o algoritmo do robô.
                  </p>
                ) : (
                  program.map((inst, idx) => {
                    const isLoop = inst.type === 'LOOP_2' || inst.type === 'LOOP_3';
                    const isActiveStep = activeStepUid === inst.uid;
                    const isEditingLoop = activeLoopUid === inst.uid;

                    return (
                      <div
                        key={inst.uid}
                        className={`rounded-lg border p-2.5 transition-colors ${
                          isActiveStep
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : isLoop
                            ? 'bg-indigo-50/70 border-indigo-200 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="font-mono opacity-60 tabular-nums">
                              {idx + 1}.
                            </span>
                            <span>{COMMAND_LABELS[inst.type]}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isLoop && !isRunning && status !== 'success' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveLoopUid(isEditingLoop ? null : inst.uid)
                                }
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                                  isEditingLoop
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-indigo-700 border border-indigo-200'
                                }`}
                              >
                                {isEditingLoop ? 'Editando' : '+ Inserir'}
                              </button>
                            )}
                            {!isRunning && status !== 'success' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveInstruction(inst.uid)}
                                className="p-1 rounded hover:bg-black/5 cursor-pointer"
                                aria-label="Remover bloco"
                              >
                                <Trash2 className="w-3.5 h-3.5 opacity-60" />
                              </button>
                            )}
                          </div>
                        </div>

                        {isLoop && (
                          <div className="mt-2 rounded-lg bg-white/70 border border-indigo-200 p-2 space-y-1.5">
                            {inst.body && inst.body.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {inst.body.map((subCmd, sIdx) => (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    disabled={isRunning || status === 'success'}
                                    onClick={() => handleRemoveLoopChild(inst.uid, sIdx)}
                                    className="px-2 py-1 rounded bg-white border border-indigo-200 text-[11px] font-medium text-slate-800 inline-flex items-center gap-1 hover:border-red-300 cursor-pointer"
                                  >
                                    <span>{COMMAND_LABELS[subCmd]}</span>
                                    {!isRunning && status !== 'success' && (
                                      <span className="text-slate-400">×</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-indigo-700/80 flex items-center gap-1">
                                <Plus className="w-3 h-3" /> Adicione passos acima para repetir
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Playback button inline */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isRunning || program.length === 0 || status === 'success'}
                onClick={handleExecute}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Executando...' : 'Executar Algoritmo'}</span>
              </button>

              {status !== 'success' && (robotPos.r !== level.start.r || robotPos.c !== level.start.c || robotDir !== level.start.dir) && (
                <button
                  type="button"
                  onClick={resetSimulationOnly}
                  className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                >
                  Reposicionar Robô
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Right Control & Concept Deck */}
      <div className="lg:col-span-4">
        <ConceptDeck
          title={level.title}
          scenario={level.scenario}
          instruction={level.instruction}
          hints={level.hints}
          revealedHints={revealedHints}
          onRevealHint={() => {
            sound.click();
            setRevealedHints((r) => Math.min(level.hints.length, r + 1));
          }}
          status={status}
          feedbackMessage={feedbackMessage}
          explanation={level.explanation}
          attempts={attempts}
          canVerify={!isRunning && program.length > 0}
          onVerify={handleExecute}
          onReset={handleResetAll}
          onNext={onNext}
          isLastLevelInPillar={isLastLevelInPillar}
          verifyLabel="Executar Algoritmo"
        />
      </div>
    </div>
  );
};
