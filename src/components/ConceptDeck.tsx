import React from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';

interface ConceptDeckProps {
  title: string;
  scenario: string;
  instruction: string;
  hints: string[];
  revealedHints: number;
  onRevealHint: () => void;
  status: 'idle' | 'error' | 'success';
  feedbackMessage: string;
  explanation: string;
  attempts: number;
  canVerify: boolean;
  onVerify: () => void;
  onReset: () => void;
  onNext: () => void;
  isLastLevelInPillar: boolean;
  verifyLabel?: string;
  extraContent?: React.ReactNode;
}

export const ConceptDeck: React.FC<ConceptDeckProps> = ({
  title,
  scenario,
  instruction,
  hints,
  revealedHints,
  onRevealHint,
  status,
  feedbackMessage,
  explanation,
  attempts,
  canVerify,
  onVerify,
  onReset,
  onNext,
  isLastLevelInPillar,
  verifyLabel = 'Verificar Solução',
  extraContent,
}) => {
  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{scenario}</p>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <p className="text-xs font-semibold text-slate-500">Objetivo da fase</p>
          <p className="text-sm font-medium text-slate-900 leading-relaxed">{instruction}</p>
        </div>

        {extraContent}

        {/* Progressive Hints */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 font-mono tabular-nums">
              Dicas ({revealedHints}/{hints.length})
            </span>
            {revealedHints < hints.length && status !== 'success' && (
              <button
                type="button"
                onClick={onRevealHint}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ver Dica</span>
              </button>
            )}
          </div>

          {revealedHints > 0 && (
            <ul className="space-y-2">
              {hints.slice(0, revealedHints).map((hint, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 bg-amber-50/70 border border-amber-200 rounded-lg p-3 leading-relaxed"
                >
                  <span className="font-semibold text-amber-800">Dica {idx + 1}: </span>
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Status Feedback (never hue-only: explicit icon + label) */}
        {status === 'error' && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-1">
            <div className="flex items-center gap-2 text-red-800 text-xs font-bold">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>AJUSTE NECESSÁRIO</span>
            </div>
            <p className="text-sm text-red-900 leading-relaxed">{feedbackMessage}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>SOLUÇÃO VALIDADA</span>
            </div>
            <p className="text-sm font-medium text-emerald-950 leading-relaxed">
              {feedbackMessage}
            </p>
            <div className="pt-2 border-t border-emerald-200/80">
              <p className="text-xs font-semibold text-emerald-800 mb-0.5">Conceito aplicado</p>
              <p className="text-xs text-emerald-900 leading-relaxed">{explanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Tentativas nesta fase</span>
          <span className="font-mono font-semibold text-slate-800 tabular-nums">{attempts}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar</span>
          </button>

          {status === 'success' ? (
            <button
              type="button"
              onClick={onNext}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{isLastLevelInPillar ? 'Concluir Pilar' : 'Próximo Desafio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onVerify}
              disabled={!canVerify}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{verifyLabel}</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
