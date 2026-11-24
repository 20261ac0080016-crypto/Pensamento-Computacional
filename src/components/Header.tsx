import React from 'react';
import { PILLARS } from '../data/levels';
import { GameViewState, PillarId } from '../types/game';

interface HeaderProps {
  viewState: GameViewState;
  activePillarId: PillarId;
  onGoHome: () => void;
  onSelectPillar: (pillarId: PillarId) => void;
  onPrimaryAction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewState,
  activePillarId,
  onGoHome,
  onSelectPillar,
  onPrimaryAction,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={onGoHome}
          className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        >
          Oficina Lógica
        </button>

        {/* Zone 2: Clean single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onGoHome}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
              viewState === 'TITLE_MENU'
                ? 'text-slate-900 border-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Início
          </button>
          {PILLARS.map((pillar) => {
            const isActive = viewState === 'PLAYING' && activePillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => onSelectPillar(pillar.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-slate-900 border-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {pillar.shortTitle}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {viewState === 'TITLE_MENU' ? 'Iniciar Jornada' : 'Resumo Geral'}
          </button>
        </div>
      </div>
    </header>
  );
};
