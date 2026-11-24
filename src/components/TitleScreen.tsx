import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Layers, RotateCcw } from 'lucide-react';
import {
  ABSTRACTION_LEVELS,
  ALGORITHM_LEVELS,
  DECOMPOSITION_LEVELS,
  PATTERN_LEVELS,
  PILLARS,
} from '../data/levels';
import { PillarId, ProgressMap } from '../types/game';

interface TitleScreenProps {
  progress: ProgressMap;
  onStartCampaign: () => void;
  onSelectPillar: (pillarId: PillarId) => void;
  onResetProgress: () => void;
}

const getPillarLevelIds = (pillarId: PillarId): string[] => {
  switch (pillarId) {
    case 'decomposition':
      return DECOMPOSITION_LEVELS.map((l) => l.id);
    case 'patterns':
      return PATTERN_LEVELS.map((l) => l.id);
    case 'abstraction':
      return ABSTRACTION_LEVELS.map((l) => l.id);
    case 'algorithms':
      return ALGORITHM_LEVELS.map((l) => l.id);
  }
};

export const TitleScreen: React.FC<TitleScreenProps> = ({
  progress,
  onStartCampaign,
  onSelectPillar,
  onResetProgress,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const allLevelIds = PILLARS.flatMap((p) => getPillarLevelIds(p.id));
  const completedCount = allLevelIds.filter((id) => progress[id]?.completed).length;
  const totalScore = allLevelIds.reduce((sum, id) => sum + (progress[id]?.bestScore ?? 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 py-2">
          <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <span>Laboratório Interativo</span>
            <span aria-hidden="true">·</span>
            <span>Execução Local no Navegador</span>
          </div>

          <h1
            className="font-display font-bold text-slate-900 tracking-tight leading-[1.1] max-w-2xl"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
          >
            Domine os quatro pilares do Pensamento Computacional na prática.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Resolva desafios táteis de decomposição de sistemas, reconhecimento de padrões,
            filtragem por abstração e programação de algoritmos passo a passo — sem precisar de
            conexão com servidores externos.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onStartCampaign}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span>{completedCount > 0 ? 'Continuar Jornada' : 'Iniciar Missão Completa'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={onResetProgress}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reiniciar Progresso</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Hero Focal Blueprint Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 border-b border-slate-100 pb-3">
              <span>Mapa dos Pilares</span>
              <span className="font-mono tabular-nums">
                {completedCount}/{allLevelIds.length} concluídos
              </span>
            </div>

            <div className="space-y-3">
              {PILLARS.map((pillar) => {
                const ids = getPillarLevelIds(pillar.id);
                const done = ids.filter((id) => progress[id]?.completed).length;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => onSelectPillar(pillar.id)}
                    className="w-full flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono tabular-nums">0{pillar.order}</span>
                        <span aria-hidden="true">·</span>
                        <span>{pillar.tagline}</span>
                      </div>
                      <p className="font-display font-semibold text-slate-900 truncate">
                        {pillar.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs font-medium text-slate-600 tabular-nums">
                        {done}/{ids.length}
                      </span>
                      {done === ids.length ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pontuação acumulada</span>
            <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
              {totalScore} pts
            </span>
          </div>
        </div>
      </section>

      {/* Full-width 4-Column Quantitative Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-xl p-6">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">Pilares Fundamentais</p>
          <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">4 módulos</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">Desafios Progressivos</p>
          <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">12 fases</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">Progresso Atual</p>
          <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
            {completedCount} de {allLevelIds.length}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">Motor de Execução</p>
          <p className="font-display text-2xl font-bold text-slate-900">100% Navegador</p>
        </div>
      </section>

      {/* 4 Pillar Cards Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Escolha um pilar para explorar
            </h2>
            <p className="text-sm text-slate-600">
              Cada laboratório possui mecânicas próprias para treinar uma habilidade essencial.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar) => {
            const ids = getPillarLevelIds(pillar.id);
            const done = ids.filter((id) => progress[id]?.completed).length;
            const hasFailed = failedImages[pillar.id];

            return (
              <article
                key={pillar.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between transition-colors hover:border-slate-300"
              >
                <div>
                  <div className="aspect-square bg-slate-100 relative overflow-hidden border-b border-slate-100">
                    {!hasFailed ? (
                      <img
                        src={pillar.imagePath}
                        alt={`Ilustração conceitual de ${pillar.title}`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [pillar.id]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
                        <Layers className="w-10 h-10 text-slate-400 mb-2" />
                        <span className="font-display font-semibold text-slate-700">
                          {pillar.title}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono tabular-nums">0{pillar.order}.</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {done}/{ids.length} fases
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectPillar(pillar.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{done === ids.length ? 'Rejogar Pilar' : 'Abrir Laboratório'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};
