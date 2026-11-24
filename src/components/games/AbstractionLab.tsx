import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AbstractionLevel } from '../../types/game';
import { sound } from '../../utils/sound';
import { ConceptDeck } from '../ConceptDeck';

interface AbstractionLabProps {
  level: AbstractionLevel;
  isLastLevelInPillar: boolean;
  onComplete: (score: number, attempts: number) => void;
  onNext: () => void;
}

const LiveSchematicPreview: React.FC<{
  previewType: AbstractionLevel['previewType'];
  activeTags: Set<string>;
}> = ({ previewType, activeTags }) => {
  if (previewType === 'metro') {
    const showLines = activeTags.has('lines');
    const showStations = activeTags.has('stations');
    const showTransfers = activeTags.has('transfers');
    const noiseSeats = activeTags.has('noise-seats');
    const noiseLamps = activeTags.has('noise-lamps');
    const noiseCurves = activeTags.has('noise-curves');

    return (
      <svg viewBox="0 0 560 220" className="w-full h-52 bg-slate-50 rounded-lg border border-slate-200">
        {/* Background grid */}
        <defs>
          <pattern id="metro-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="560" height="220" fill="url(#metro-grid)" />

        {/* Noise: Real geographic squiggles */}
        {noiseCurves && (
          <path
            d="M 40 160 C 120 40, 200 190, 280 90 C 360 10, 440 180, 520 70"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="14"
            strokeDasharray="6 4"
          />
        )}

        {/* Essential: Schematic Metro Lines */}
        {showLines ? (
          <>
            <path d="M 60 150 L 200 150 L 280 90 L 500 90" fill="none" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 140 45 L 280 90 L 280 185 L 440 185" fill="none" stroke="#059669" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <path d="M 60 150 L 200 150 L 280 90 L 500 90" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 140 45 L 280 90 L 280 185 L 440 185" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
          </>
        )}

        {/* Stations */}
        {[
          { x: 60, y: 150, name: 'Estação Sul' },
          { x: 200, y: 150, name: 'Praça' },
          { x: 500, y: 90, name: 'Terminal Leste' },
          { x: 140, y: 45, name: 'Parque' },
          { x: 440, y: 185, name: 'Campus' },
        ].map((st) => (
          <g key={st.name}>
            <circle cx={st.x} cy={st.y} r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            {showStations && (
              <text x={st.x} y={st.y - 12} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1E293B">
                {st.name}
              </text>
            )}
          </g>
        ))}

        {/* Transfer Hub */}
        <circle
          cx="280"
          cy="90"
          r={showTransfers ? 10 : 6}
          fill="#FFFFFF"
          stroke={showTransfers ? '#D97706' : '#0F172A'}
          strokeWidth={showTransfers ? 3.5 : 2}
        />
        {showStations && (
          <text x="280" y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">
            {showTransfers ? 'Baldeação Central' : 'Central'}
          </text>
        )}

        {/* Noise clutter overlays */}
        {noiseSeats && (
          <g transform="translate(360, 122)">
            <rect width="168" height="28" rx="4" fill="#FEF2F2" stroke="#FCA5A5" />
            <text x="8" y="18" fontSize="10" fill="#991B1B" fontWeight="600">
              Ruído: Assento Azul-Marinho #4B
            </text>
          </g>
        )}
        {noiseLamps && (
          <g transform="translate(20, 20)">
            <rect width="175" height="28" rx="4" fill="#FEF2F2" stroke="#FCA5A5" />
            <text x="8" y="18" fontSize="10" fill="#991B1B" fontWeight="600">
              Ruído: Lâmpada LED 4000K Lote 9
            </text>
          </g>
        )}
      </svg>
    );
  }

  if (previewType === 'library') {
    const showBookId = activeTags.has('book-id');
    const showStudent = activeTags.has('student-id');
    const showDueDate = activeTags.has('due-date');
    const showStatus = activeTags.has('status');
    const noiseWeight = activeTags.has('noise-weight');
    const noiseShirt = activeTags.has('noise-shirt');

    return (
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-mono text-xs font-semibold text-slate-700">
            REGISTRO_EMPRESTIMO
          </span>
          {showStatus ? (
            <span className="font-mono text-xs font-bold text-emerald-700">
              STATUS: EMPRESTADO
            </span>
          ) : (
            <span className="font-mono text-xs text-slate-400">status indefinido</span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded bg-white border border-slate-200">
            <span className="text-slate-400 block">Exemplar ID</span>
            <span className="font-mono font-semibold text-slate-900">
              {showBookId ? 'LIV-0482-B' : '— oculto —'}
            </span>
          </div>
          <div className="p-2.5 rounded bg-white border border-slate-200">
            <span className="text-slate-400 block">Estudante</span>
            <span className="font-mono font-semibold text-slate-900">
              {showStudent ? 'MAT-2026-109' : '— oculto —'}
            </span>
          </div>
          <div className="p-2.5 rounded bg-white border border-slate-200">
            <span className="text-slate-400 block">Devolução</span>
            <span className="font-mono font-semibold text-slate-900">
              {showDueDate ? '28/11/2026' : '— oculto —'}
            </span>
          </div>

          {noiseWeight && (
            <div className="p-2.5 rounded bg-red-50 border border-red-200">
              <span className="text-red-700 block font-semibold">Ruído: Peso da capa</span>
              <span className="font-mono text-red-900">412 gramas</span>
            </div>
          )}

          {noiseShirt && (
            <div className="p-2.5 rounded bg-red-50 border border-red-200">
              <span className="text-red-700 block font-semibold">Ruído: Camiseta</span>
              <span className="font-mono text-red-900">Listrada branca</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Delivery Graph
  const showNodes = activeTags.has('nodes');
  const showEdges = activeTags.has('edges');
  const showWeights = activeTags.has('weights');
  const showDirection = activeTags.has('direction');
  const noiseArchitect = activeTags.has('noise-architect');
  const noiseHouses = activeTags.has('noise-houses');

  return (
    <svg viewBox="0 0 560 220" className="w-full h-52 bg-slate-50 rounded-lg border border-slate-200">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#059669" />
        </marker>
      </defs>

      {noiseHouses && (
        <g opacity="0.55">
          <rect x="40" y="30" width="44" height="36" fill="#FEE2E2" stroke="#EF4444" />
          <rect x="240" y="155" width="52" height="34" fill="#FEE2E2" stroke="#EF4444" />
          <text x="42" y="80" fontSize="9" fill="#991B1B">Casa amarela (ruído)</text>
        </g>
      )}

      {/* Edges */}
      {showEdges && (
        <>
          <line
            x1="95"
            y1="110"
            x2="250"
            y2="55"
            stroke="#059669"
            strokeWidth="3"
            markerEnd={showDirection ? 'url(#arrow)' : undefined}
          />
          <line
            x1="95"
            y1="110"
            x2="250"
            y2="165"
            stroke="#059669"
            strokeWidth="3"
            markerEnd={showDirection ? 'url(#arrow)' : undefined}
          />
          <line
            x1="285"
            y1="55"
            x2="450"
            y2="110"
            stroke="#059669"
            strokeWidth="3"
            markerEnd={showDirection ? 'url(#arrow)' : undefined}
          />
          <line
            x1="285"
            y1="165"
            x2="450"
            y2="110"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        </>
      )}

      {/* Edge weights */}
      {showWeights && showEdges && (
        <>
          <rect x="155" y="64" width="42" height="20" rx="4" fill="#FFFFFF" stroke="#059669" />
          <text x="176" y="78" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065F46">
            6 min
          </text>
          <rect x="155" y="132" width="46" height="20" rx="4" fill="#FFFFFF" stroke="#94A3B8" />
          <text x="178" y="146" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
            14 min
          </text>
          <rect x="350" y="64" width="42" height="20" rx="4" fill="#FFFFFF" stroke="#059669" />
          <text x="371" y="78" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065F46">
            5 min
          </text>
        </>
      )}

      {/* Nodes */}
      {showNodes && (
        <>
          <circle cx="80" cy="110" r="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <text x="80" y="114" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">Origem</text>

          <circle cx="268" cy="55" r="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <text x="268" y="59" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">Norte</text>

          <circle cx="268" cy="165" r="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <text x="268" y="169" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">Sul</text>

          <circle cx="468" cy="110" r="18" fill="#ECFDF5" stroke="#059669" strokeWidth="2.5" />
          <text x="468" y="114" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065F46">Destino</text>
        </>
      )}

      {noiseArchitect && (
        <g transform="translate(335, 175)">
          <rect width="205" height="26" rx="4" fill="#FEF2F2" stroke="#FCA5A5" />
          <text x="8" y="17" fontSize="10" fill="#991B1B" fontWeight="600">
            Ruído: Arquiteto da ponte (1974)
          </text>
        </g>
      )}
    </svg>
  );
};

export const AbstractionLab: React.FC<AbstractionLabProps> = ({
  level,
  isLastLevelInPillar,
  onComplete,
  onNext,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [revealedHints, setRevealedHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    setSelectedIds(new Set());
    setRevealedHints(0);
    setAttempts(0);
    setStatus('idle');
    setFeedbackMessage('');
  }, [level]);

  const activeVisualTags = new Set(
    level.attributes.filter((a) => selectedIds.has(a.id)).map((a) => a.visualTag)
  );

  const toggleAttribute = (id: string) => {
    if (status === 'success') return;
    sound.click();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
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
    setSelectedIds(new Set());
    setStatus('idle');
    setFeedbackMessage('');
  };

  const handleVerify = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const missingEssentials = level.attributes.filter(
      (a) => a.isEssential && !selectedIds.has(a.id)
    );
    const includedNoise = level.attributes.filter(
      (a) => !a.isEssential && selectedIds.has(a.id)
    );

    if (missingEssentials.length === 0 && includedNoise.length === 0) {
      sound.success();
      const score = Math.max(60, 100 - (nextAttempts - 1) * 10 - revealedHints * 10);
      setStatus('success');
      setFeedbackMessage(
        `Modelo limpo e preciso! Você reteve apenas os atributos essenciais (+${score} pts).`
      );
      onComplete(score, nextAttempts);
    } else {
      sound.error();
      setStatus('error');
      const parts: string[] = [];
      if (missingEssentials.length > 0) {
        parts.push(
          `faltam ${missingEssentials.length} ${
            missingEssentials.length === 1 ? 'atributo essencial' : 'atributos essenciais'
          }`
        );
      }
      if (includedNoise.length > 0) {
        parts.push(
          `há ${includedNoise.length} ${
            includedNoise.length === 1 ? 'detalhe irrelevante' : 'detalhes irrelevantes'
          } causando ruído no modelo`
        );
      }
      setFeedbackMessage(`Revise sua seleção: ${parts.join(' e ')}.`);
    }
  };

  const essentialTotal = level.attributes.filter((a) => a.isEssential).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Interactive Stage */}
      <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-medium text-emerald-700">Pilar 03 · Abstração</p>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Prévia Dinâmica do Modelo & Filtro de Atributos
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-600 tabular-nums">
            Ativos: {selectedIds.size} (meta: {essentialTotal} essenciais)
          </span>
        </div>

        {/* Live Schematic Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Visualização em tempo real do modelo abstraído</span>
            <span>Propósito: {level.goal}</span>
          </div>
          <LiveSchematicPreview previewType={level.previewType} activeTags={activeVisualTags} />
        </div>

        {/* Attribute Toggle Grid */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-600">
            Clique nos atributos para incluir no modelo ou descartá-los:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {level.attributes.map((attr) => {
              const isSelected = selectedIds.has(attr.id);
              return (
                <button
                  key={attr.id}
                  type="button"
                  disabled={status === 'success'}
                  onClick={() => toggleAttribute(attr.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{attr.label}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{attr.detail}</p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {isSelected ? (
                      <Eye className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        isSelected ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? 'INCLUÍDO' : 'OCULTO'}
                    </span>
                  </div>
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
          canVerify={selectedIds.size > 0}
          onVerify={handleVerify}
          onReset={handleReset}
          onNext={onNext}
          isLastLevelInPillar={isLastLevelInPillar}
          verifyLabel="Validar Modelo"
        />
      </div>
    </div>
  );
};
