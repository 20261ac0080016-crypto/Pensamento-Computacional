import React from 'react';
import { ArrowRight, CheckCircle2, Home, RotateCcw, Trophy } from 'lucide-react';
import {
  ABSTRACTION_LEVELS,
  ALGORITHM_LEVELS,
  DECOMPOSITION_LEVELS,
  PATTERN_LEVELS,
  PILLARS,
} from '../data/levels';
import { PillarId, ProgressMap } from '../types/game';

interface SummaryScreenProps {
  mode: 'pillar' | 'campaign';
  pillarId: PillarId;
  progress: ProgressMap;
  onNextPillar: (nextId: PillarId) => void;
  onReplayPillar: (pillarId: PillarId) => void;
  onGoHome: () => void;
}

const getLevelsForPillar = (pillarId: PillarId) => {
  switch (pillarId) {
    case 'decomposition':
      return DECOMPOSITION_LEVELS;
    case 'patterns':
      return PATTERN_LEVELS;
    case 'abstraction':
      return ABSTRACTION_LEVELS;
    case 'algorithms':
      return ALGORITHM_LEVELS;
  }
};

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  mode,
  pillarId,
  progress,
  onNextPillar,
  onReplayPillar,
  onGoHome,
}) => {
  const currentPillarIndex = PILLARS.findIndex((p) => p.id === pillarId);
  const currentPillar = PILLARS[currentPillarIndex];
  const nextPillar =
    currentPillarIndex >= 0 && currentPillarIndex < PILLARS.length - 1
      ? PILLARS[currentPillarIndex + 1]
      : null;

  const totalScore = Object.values(progress).reduce((acc, rec) => acc + rec.bestScore, 0);
  const totalCompleted = Object.values(progress).filter((rec) => rec.completed).length;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <span>{mode === 'campaign' ? 'Relatório Final da Jornada' : 'Pilar Concluído'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{totalCompleted}/12 fases completas</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900">
              {mode === 'campaign'
                ? 'Todos os quatro pilares explorados!'
                : `Você concluiu ${currentPillar.title}`}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {mode === 'campaign'
                ? 'Você praticou decomposição modular, detecção de padrões, abstração de dados e construção de algoritmos com laços de repetição.'
                : currentPillar.description}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-3 shrink-0">
            <Trophy className="w-6 h-6 text-amber-600" />
            <div>
              <p className="text-xs text-slate-500">Pontuação Total</p>
              <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                {totalScore} pts
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="font-display text-base font-semibold text-slate-900 mb-4">
            Desempenho por Pilar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map((pillar) => {
              const levels = getLevelsForPillar(pillar.id);
              const done = levels.filter((l) => progress[l.id]?.completed).length;
              const pillarScore = levels.reduce(
                (sum, l) => sum + (progress[l.id]?.bestScore ?? 0),
                0
              );

              return (
                <div
                  key={pillar.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono tabular-nums">0{pillar.order}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {done}/{levels.length} fases
                      </span>
                    </div>
                    <p className="font-display font-semibold text-slate-900">{pillar.title}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                      {pillarScore} pts
                    </span>
                    {done === levels.length && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Home className="w-4 h-4" />
              <span>Voltar ao Início</span>
            </button>

            <button
              type="button"
              onClick={() => onReplayPillar(pillarId)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rejogar {currentPillar.shortTitle}</span>
            </button>
          </div>

          {nextPillar && (
            <button
              type="button"
              onClick={() => onNextPillar(nextPillar.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Próximo Pilar: {nextPillar.shortTitle}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>
    </main>
  );
};
