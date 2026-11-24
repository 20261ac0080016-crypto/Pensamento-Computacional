import React, { useEffect, useState } from 'react';
import { PatternLevel, PatternToken } from '../../types/game';
import { sound } from '../../utils/sound';
import { ConceptDeck } from '../ConceptDeck';

interface PatternsLabProps {
  level: PatternLevel;
  isLastLevelInPillar: boolean;
  onComplete: (score: number, attempts: number) => void;
  onNext: () => void;
}

const TOKEN_COLORS: Record<PatternToken['color'], { fill: string; stroke: string; text: string }> = {
  amber: { fill: '#F59E0B', stroke: '#B45309', text: '#78350F' },
  cobalt: { fill: '#2563EB', stroke: '#1E40AF', text: '#FFFFFF' },
  emerald: { fill: '#10B981', stroke: '#047857', text: '#FFFFFF' },
  slate: { fill: '#64748B', stroke: '#334155', text: '#FFFFFF' },
};

const tokensEqual = (a: PatternToken | null, b: PatternToken | null) => {
  if (!a || !b) return false;
  return (
    a.shape === b.shape &&
    a.color === b.color &&
    (a.rotation ?? 0) === (b.rotation ?? 0) &&
    (a.value ?? '') === (b.value ?? '')
  );
};

const TokenGraphic: React.FC<{ token: PatternToken; size?: number }> = ({ token, size = 44 }) => {
  const palette = TOKEN_COLORS[token.color];
  const rotation = token.rotation ?? 0;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        style={{ transform: `rotate(${rotation}deg)` }}
        aria-hidden="true"
      >
        {token.shape === 'circle' && (
          <circle cx="24" cy="24" r="17" fill={palette.fill} stroke={palette.stroke} strokeWidth="2.5" />
        )}
        {token.shape === 'square' && (
          <rect
            x="8"
            y="8"
            width="32"
            height="32"
            rx="5"
            fill={palette.fill}
            stroke={palette.stroke}
            strokeWidth="2.5"
          />
        )}
        {token.shape === 'triangle' && (
          <polygon
            points="24,6 42,40 6,40"
            fill={palette.fill}
            stroke={palette.stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}
        {token.shape === 'diamond' && (
          <polygon
            points="24,5 43,24 24,43 5,24"
            fill={palette.fill}
            stroke={palette.stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {token.value !== undefined && (
        <span
          className="absolute font-mono text-xs font-bold pointer-events-none"
          style={{ color: palette.text }}
        >
          {token.value}
        </span>
      )}
    </div>
  );
};

export const PatternsLab: React.FC<PatternsLabProps> = ({
  level,
  isLastLevelInPillar,
  onComplete,
  onNext,
}) => {
  const [slotValues, setSlotValues] = useState<Record<string, PatternToken | null>>({});
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const initial: Record<string, PatternToken | null> = {};
    let firstEditable: string | null = null;
    level.slots.forEach((slot) => {
      initial[slot.id] = slot.token;
      if (slot.token === null && firstEditable === null) {
        firstEditable = slot.id;
      }
    });
    setSlotValues(initial);
    setSelectedSlotId(firstEditable);
    setSelectedRuleId(null);
    setRevealedHints(0);
    setAttempts(0);
    setStatus('idle');
    setFeedbackMessage('');
  }, [level]);

  const editableSlots = level.slots.filter((s) => s.token === null);
  const allSlotsFilled = editableSlots.every((s) => slotValues[s.id] !== null);

  const handleSelectPaletteToken = (token: PatternToken) => {
    if (status === 'success' || !selectedSlotId) return;
    sound.place();
    setSlotValues((prev) => {
      const next = { ...prev, [selectedSlotId]: token };
      const nextEmpty = editableSlots.find((s) => s.id !== selectedSlotId && !next[s.id]);
      if (nextEmpty) {
        setSelectedSlotId(nextEmpty.id);
      }
      return next;
    });
    if (status === 'error') {
      setStatus('idle');
      setFeedbackMessage('');
    }
  };

  const handleReset = () => {
    sound.click();
    const initial: Record<string, PatternToken | null> = {};
    let firstEditable: string | null = null;
    level.slots.forEach((slot) => {
      initial[slot.id] = slot.token;
      if (slot.token === null && firstEditable === null) {
        firstEditable = slot.id;
      }
    });
    setSlotValues(initial);
    setSelectedSlotId(firstEditable);
    setSelectedRuleId(null);
    setStatus('idle');
    setFeedbackMessage('');
  };

  const handleVerify = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const wrongSlots = editableSlots.filter(
      (s) => !tokensEqual(slotValues[s.id], s.expectedToken)
    );
    const ruleCorrect = selectedRuleId === level.correctRuleId;

    if (wrongSlots.length === 0 && ruleCorrect) {
      sound.success();
      const score = Math.max(60, 100 - (nextAttempts - 1) * 10 - revealedHints * 10);
      setStatus('success');
      setFeedbackMessage(
        `Excelente leitura de padrão! Sequência e regra validadas com sucesso (+${score} pts).`
      );
      onComplete(score, nextAttempts);
    } else {
      sound.error();
      setStatus('error');
      if (wrongSlots.length > 0 && !ruleCorrect) {
        setFeedbackMessage(
          'Há peças fora do padrão na grade e a regra selecionada não corresponde à sequência.'
        );
      } else if (wrongSlots.length > 0) {
        setFeedbackMessage(
          `${wrongSlots.length} ${
            wrongSlots.length === 1 ? 'posição está' : 'posições estão'
          } com a peça incorreta. Observe a repetição entre linhas ou ciclos.`
        );
      } else {
        setFeedbackMessage(
          'As peças da grade estão corretas, mas revise qual regra descreve o padrão.'
        );
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Interactive Stage */}
      <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-medium text-amber-700">
              Pilar 02 · Reconhecimento de Padrões
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Decodificador de Sequência & Matriz
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {editableSlots.filter((s) => slotValues[s.id] !== null).length}/{editableSlots.length}{' '}
            lacunas preenchidas
          </span>
        </div>

        {/* Pattern Board */}
        <div
          className="grid gap-3 mx-auto max-w-xl"
          style={{
            gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))`,
          }}
        >
          {level.slots.map((slot, idx) => {
            const isEditable = slot.token === null;
            const currentToken = slotValues[slot.id] ?? null;
            const isSelected = selectedSlotId === slot.id;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!isEditable || status === 'success'}
                onClick={() => {
                  if (isEditable) {
                    sound.click();
                    setSelectedSlotId(slot.id);
                  }
                }}
                className={`relative aspect-square min-h-[76px] rounded-xl border flex flex-col items-center justify-center transition-all ${
                  !isEditable
                    ? 'bg-slate-50 border-slate-200 cursor-default'
                    : isSelected
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 cursor-pointer'
                    : 'bg-white border-dashed border-slate-300 hover:border-amber-400 cursor-pointer'
                }`}
              >
                <span className="absolute top-1.5 left-2 font-mono text-[10px] text-slate-400 tabular-nums">
                  #{idx + 1}
                </span>

                {currentToken ? (
                  <TokenGraphic token={currentToken} size={46} />
                ) : (
                  <span className="font-display text-xl font-bold text-amber-600">?</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Token Palette */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">
              Paleta de peças — selecione uma lacuna "?" acima e clique na peça desejada:
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {level.palette.map((token, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!selectedSlotId || status === 'success'}
                onClick={() => handleSelectPaletteToken(token)}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/40 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Selecionar peça ${token.shape} ${token.color}`}
              >
                <TokenGraphic token={token} size={40} />
              </button>
            ))}
          </div>
        </div>

        {/* Rule Identification */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-900">{level.ruleQuestion}</p>
          <div className="space-y-2">
            {level.ruleOptions.map((opt) => {
              const isChosen = selectedRuleId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={status === 'success'}
                  onClick={() => {
                    sound.click();
                    setSelectedRuleId(opt.id);
                    if (status === 'error') {
                      setStatus('idle');
                      setFeedbackMessage('');
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border text-sm transition-colors cursor-pointer flex items-center gap-3 ${
                    isChosen
                      ? 'bg-amber-50 border-amber-500 text-slate-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isChosen ? 'border-amber-600 bg-amber-600' : 'border-slate-300'
                    }`}
                  >
                    {isChosen && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
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
          canVerify={allSlotsFilled && selectedRuleId !== null}
          onVerify={handleVerify}
          onReset={handleReset}
          onNext={onNext}
          isLastLevelInPillar={isLastLevelInPillar}
        />
      </div>
    </div>
  );
};
