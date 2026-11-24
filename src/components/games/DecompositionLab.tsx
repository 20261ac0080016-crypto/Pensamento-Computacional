import React, { useEffect, useState } from 'react';
import { Check, FolderKanban, Trash2, X } from 'lucide-react';
import { DecompositionLevel } from '../../types/game';
import { sound } from '../../utils/sound';
import { ConceptDeck } from '../ConceptDeck';

interface DecompositionLabProps {
  level: DecompositionLevel;
  isLastLevelInPillar: boolean;
  onComplete: (score: number, attempts: number) => void;
  onNext: () => void;
}

export const DecompositionLab: React.FC<DecompositionLabProps> = ({
  level,
  isLastLevelInPillar,
  onComplete,
  onNext,
}) => {
  // taskId -> bucketId | null
  const [assignments, setAssignments] = useState<Record<string, string | null>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [checkedErrors, setCheckedErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const init: Record<string, string | null> = {};
    level.tasks.forEach((t) => {
      init[t.id] = null;
    });
    setAssignments(init);
    setSelectedTaskId(level.tasks[0]?.id ?? null);
    setRevealedHints(0);
    setAttempts(0);
    setStatus('idle');
    setFeedbackMessage('');
    setCheckedErrors({});
  }, [level]);

  const unassignedTasks = level.tasks.filter((t) => !assignments[t.id]);
  const assignedCount = level.tasks.length - unassignedTasks.length;

  const handleAssignToBucket = (bucketId: string) => {
    if (status === 'success' || !selectedTaskId) return;
    sound.place();
    setAssignments((prev) => {
      const next = { ...prev, [selectedTaskId]: bucketId };
      const nextUnassigned = level.tasks.find((t) => t.id !== selectedTaskId && !next[t.id]);
      setSelectedTaskId(nextUnassigned ? nextUnassigned.id : null);
      return next;
    });
    setCheckedErrors((prev) => ({ ...prev, [selectedTaskId]: false }));
    if (status === 'error') {
      setStatus('idle');
      setFeedbackMessage('');
    }
  };

  const handleRemoveFromBucket = (taskId: string) => {
    if (status === 'success') return;
    sound.click();
    setAssignments((prev) => ({ ...prev, [taskId]: null }));
    setSelectedTaskId(taskId);
    setCheckedErrors((prev) => ({ ...prev, [taskId]: false }));
    if (status === 'error') {
      setStatus('idle');
      setFeedbackMessage('');
    }
  };

  const handleReset = () => {
    sound.click();
    const init: Record<string, string | null> = {};
    level.tasks.forEach((t) => {
      init[t.id] = null;
    });
    setAssignments(init);
    setSelectedTaskId(level.tasks[0]?.id ?? null);
    setStatus('idle');
    setFeedbackMessage('');
    setCheckedErrors({});
  };

  const handleVerify = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const errors: Record<string, boolean> = {};
    let errorCount = 0;

    level.tasks.forEach((task) => {
      if (assignments[task.id] !== task.targetBucketId) {
        errors[task.id] = true;
        errorCount += 1;
      }
    });

    setCheckedErrors(errors);

    if (errorCount === 0) {
      sound.success();
      const score = Math.max(60, 100 - (nextAttempts - 1) * 10 - revealedHints * 10);
      setStatus('success');
      setFeedbackMessage(
        `Perfeito! Todas as ${level.tasks.length} tarefas foram organizadas nos módulos corretos (+${score} pts).`
      );
      onComplete(score, nextAttempts);
    } else {
      sound.error();
      setStatus('error');
      setFeedbackMessage(
        `${errorCount} ${
          errorCount === 1 ? 'tarefa está' : 'tarefas estão'
        } no módulo errado. Clique nas peças marcadas com X para reposicioná-las.`
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Interactive Stage */}
      <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-medium text-blue-700">
              Pilar 01 · Decomposição Modular
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Bancada de Tarefas & Módulos
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-600 tabular-nums">
            Classificadas: {assignedCount}/{level.tasks.length}
          </div>
        </div>

        {/* Unassigned Task Pool */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">
              1. Clique em uma tarefa para selecionar, depois clique no módulo de destino:
            </p>
          </div>

          {unassignedTasks.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {unassignedTasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setSelectedTaskId(task.id);
                    }}
                    className={`px-3.5 py-2.5 text-sm font-medium rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                    }`}
                  >
                    {task.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Todas as tarefas foram alocadas nos módulos abaixo. Clique em "Verificar Solução" ou
              toque em qualquer item abaixo para movê-lo.
            </div>
          )}
        </div>

        {/* Target Module Buckets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {level.buckets.map((bucket) => {
            const bucketTasks = level.tasks.filter((t) => assignments[t.id] === bucket.id);
            const canDropHere = Boolean(selectedTaskId) && status !== 'success';

            return (
              <div
                key={bucket.id}
                onClick={() => canDropHere && handleAssignToBucket(bucket.id)}
                className={`rounded-xl border p-4 flex flex-col justify-between min-h-[210px] transition-colors ${
                  canDropHere
                    ? 'border-blue-300 bg-blue-50/30 hover:bg-blue-50/60 cursor-pointer'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-200/80">
                    <div>
                      <h4 className="font-display text-sm font-bold text-slate-900">
                        {bucket.title}
                      </h4>
                      <p className="text-xs text-slate-500">{bucket.subtitle}</p>
                    </div>
                    <FolderKanban className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  </div>

                  <div className="space-y-2">
                    {bucketTasks.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        {canDropHere
                          ? 'Clique aqui para alocar a tarefa selecionada'
                          : 'Nenhuma tarefa alocada'}
                      </p>
                    ) : (
                      bucketTasks.map((task) => {
                        const isWrong = checkedErrors[task.id];
                        const isSuccess = status === 'success';
                        return (
                          <button
                            key={task.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromBucket(task.id);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium flex items-start justify-between gap-2 transition-colors ${
                              isSuccess
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : isWrong
                                ? 'bg-red-50 border-red-300 text-red-900 cursor-pointer'
                                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 cursor-pointer'
                            }`}
                          >
                            <span className="leading-snug">{task.label}</span>
                            {isSuccess ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <X
                                className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                  isWrong ? 'text-red-600' : 'text-slate-400'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                  <span>Itens</span>
                  <span>{bucketTasks.length}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Out-of-Scope Discard Bin */}
        {level.hasDiscardBin && (
          <div
            onClick={() => selectedTaskId && status !== 'success' && handleAssignToBucket('discard')}
            className={`rounded-xl border p-4 transition-colors ${
              selectedTaskId && status !== 'success'
                ? 'border-slate-300 bg-slate-100/70 hover:bg-slate-100 cursor-pointer'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-slate-600" />
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-900">
                    Fora do Escopo (Descartar)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tarefas que não fazem parte deste sistema ou diagnóstico
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-500 tabular-nums">
                {level.tasks.filter((t) => assignments[t.id] === 'discard').length} itens
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {level.tasks
                .filter((t) => assignments[t.id] === 'discard')
                .map((task) => {
                  const isWrong = checkedErrors[task.id];
                  const isSuccess = status === 'success';
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromBucket(task.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium inline-flex items-center gap-2 ${
                        isSuccess
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : isWrong
                          ? 'bg-red-50 border-red-300 text-red-900 cursor-pointer'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <span>{task.label}</span>
                      {!isSuccess && <X className="w-3 h-3 text-slate-400" />}
                    </button>
                  );
                })}
            </div>
          </div>
        )}
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
          canVerify={assignedCount === level.tasks.length}
          onVerify={handleVerify}
          onReset={handleReset}
          onNext={onNext}
          isLastLevelInPillar={isLastLevelInPillar}
        />
      </div>
    </div>
  );
};
