/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { Header } from './components/Header';
import { SummaryScreen } from './components/SummaryScreen';
import { TitleScreen } from './components/TitleScreen';
import { AbstractionLab } from './components/games/AbstractionLab';
import { AlgorithmsLab } from './components/games/AlgorithmsLab';
import { DecompositionLab } from './components/games/DecompositionLab';
import { PatternsLab } from './components/games/PatternsLab';
import {
  ABSTRACTION_LEVELS,
  ALGORITHM_LEVELS,
  DECOMPOSITION_LEVELS,
  PATTERN_LEVELS,
  PILLARS,
} from './data/levels';
import { GameViewState, PillarId, ProgressMap } from './types/game';
import { sound } from './utils/sound';

const STORAGE_KEY = 'oficina_logica_progress_v1';

const loadProgress = (): ProgressMap => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as ProgressMap;
    }
  } catch {
    // Ignore storage access errors
  }
  return {};
};

const getLevelIdsForPillar = (pillarId: PillarId): string[] => {
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

export default function App() {
  const [viewState, setViewState] = useState<GameViewState>('TITLE_MENU');
  const [activePillarId, setActivePillarId] = useState<PillarId>('decomposition');
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [muted, setMuted] = useState<boolean>(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage write errors
    }
  }, [progress]);

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    sound.setMuted(next);
    if (!next) {
      sound.click();
    }
  };

  const handleSelectPillar = (pillarId: PillarId, startAtFirst = false) => {
    sound.click();
    setActivePillarId(pillarId);
    if (startAtFirst) {
      setLevelIndex(0);
    } else {
      const ids = getLevelIdsForPillar(pillarId);
      const firstIncomplete = ids.findIndex((id) => !progress[id]?.completed);
      setLevelIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
    }
    setViewState('PLAYING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCampaign = () => {
    sound.click();
    for (const pillar of PILLARS) {
      const ids = getLevelIdsForPillar(pillar.id);
      const firstIncomplete = ids.findIndex((id) => !progress[id]?.completed);
      if (firstIncomplete >= 0) {
        setActivePillarId(pillar.id);
        setLevelIndex(firstIncomplete);
        setViewState('PLAYING');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setActivePillarId('decomposition');
    setLevelIndex(0);
    setViewState('PLAYING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    sound.click();
    setProgress({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleLevelComplete = (levelId: string, score: number, attempts: number) => {
    setProgress((prev) => {
      const existing = prev[levelId];
      return {
        ...prev,
        [levelId]: {
          completed: true,
          bestScore: Math.max(existing?.bestScore ?? 0, score),
          attempts: (existing?.attempts ?? 0) + attempts,
        },
      };
    });
  };

  const handleNextLevel = () => {
    sound.click();
    const pillarLevelIds = getLevelIdsForPillar(activePillarId);
    if (levelIndex < pillarLevelIds.length - 1) {
      setLevelIndex((idx) => idx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const allIds = PILLARS.flatMap((p) => getLevelIdsForPillar(p.id));
      const allDone = allIds.every((id) => progress[id]?.completed);
      setViewState(allDone ? 'CAMPAIGN_COMPLETE' : 'PILLAR_SUMMARY');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalScore = Object.values(progress).reduce((sum, rec) => sum + rec.bestScore, 0);
  const currentPillarMeta = PILLARS.find((p) => p.id === activePillarId) ?? PILLARS[0];
  const currentPillarLevelIds = getLevelIdsForPillar(activePillarId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        viewState={viewState}
        activePillarId={activePillarId}
        onGoHome={() => {
          sound.click();
          setViewState('TITLE_MENU');
        }}
        onSelectPillar={(id) => handleSelectPillar(id)}
        onPrimaryAction={() => {
          if (viewState === 'TITLE_MENU') {
            handleStartCampaign();
          } else {
            sound.click();
            setViewState('PILLAR_SUMMARY');
          }
        }}
      />

      <div className="flex-1">
        {viewState === 'TITLE_MENU' && (
          <TitleScreen
            progress={progress}
            onStartCampaign={handleStartCampaign}
            onSelectPillar={(id) => handleSelectPillar(id)}
            onResetProgress={handleResetProgress}
          />
        )}

        {viewState === 'PLAYING' && (
          <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            {/* Workspace HUD Toolbar */}
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setViewState('TITLE_MENU');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Pilares</span>
                </button>

                <span className="text-slate-300" aria-hidden="true">
                  /
                </span>

                <span className="font-display text-sm font-bold text-slate-900 whitespace-nowrap">
                  0{currentPillarMeta.order}. {currentPillarMeta.title}
                </span>
              </div>

              {/* Level Segmented Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {currentPillarLevelIds.map((id, idx) => {
                  const isCurrent = idx === levelIndex;
                  const isDone = progress[id]?.completed;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        sound.click();
                        setLevelIndex(idx);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        isCurrent
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="tabular-nums">Fase {idx + 1}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Score & Audio Control */}
              <div className="flex items-center gap-4">
                <div className="text-xs text-slate-600">
                  Pontos:{' '}
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {totalScore}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  aria-label={muted ? 'Ativar efeitos sonoros' : 'Silenciar efeitos sonoros'}
                  title={muted ? 'Ativar efeitos sonoros' : 'Silenciar efeitos sonoros'}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Active Pillar Lab */}
            {activePillarId === 'decomposition' && (
              <DecompositionLab
                level={DECOMPOSITION_LEVELS[levelIndex]}
                isLastLevelInPillar={levelIndex === DECOMPOSITION_LEVELS.length - 1}
                onComplete={(score, attempts) =>
                  handleLevelComplete(DECOMPOSITION_LEVELS[levelIndex].id, score, attempts)
                }
                onNext={handleNextLevel}
              />
            )}

            {activePillarId === 'patterns' && (
              <PatternsLab
                level={PATTERN_LEVELS[levelIndex]}
                isLastLevelInPillar={levelIndex === PATTERN_LEVELS.length - 1}
                onComplete={(score, attempts) =>
                  handleLevelComplete(PATTERN_LEVELS[levelIndex].id, score, attempts)
                }
                onNext={handleNextLevel}
              />
            )}

            {activePillarId === 'abstraction' && (
              <AbstractionLab
                level={ABSTRACTION_LEVELS[levelIndex]}
                isLastLevelInPillar={levelIndex === ABSTRACTION_LEVELS.length - 1}
                onComplete={(score, attempts) =>
                  handleLevelComplete(ABSTRACTION_LEVELS[levelIndex].id, score, attempts)
                }
                onNext={handleNextLevel}
              />
            )}

            {activePillarId === 'algorithms' && (
              <AlgorithmsLab
                level={ALGORITHM_LEVELS[levelIndex]}
                isLastLevelInPillar={levelIndex === ALGORITHM_LEVELS.length - 1}
                onComplete={(score, attempts) =>
                  handleLevelComplete(ALGORITHM_LEVELS[levelIndex].id, score, attempts)
                }
                onNext={handleNextLevel}
              />
            )}
          </main>
        )}

        {(viewState === 'PILLAR_SUMMARY' || viewState === 'CAMPAIGN_COMPLETE') && (
          <SummaryScreen
            mode={viewState === 'CAMPAIGN_COMPLETE' ? 'campaign' : 'pillar'}
            pillarId={activePillarId}
            progress={progress}
            onNextPillar={(nextId) => handleSelectPillar(nextId, true)}
            onReplayPillar={(id) => handleSelectPillar(id, true)}
            onGoHome={() => {
              sound.click();
              setViewState('TITLE_MENU');
            }}
          />
        )}
      </div>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>Oficina Lógica · Jogo Educativo de Pensamento Computacional</span>
          <span>Decomposição · Reconhecimento de Padrões · Abstração · Algoritmos</span>
        </div>
      </footer>
    </div>
  );
}
