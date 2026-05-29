import { useState, useEffect } from "react";

const WA = "5521975200073";

const QUESTIONS = {
  adesao: [
    {
      id: "a1", label: "A1 · Adesão geral ao plano essa semana", type: "scale",
      weight: 15, max: 10
    },
    {
      id: "a2", label: "A2 · Refeições fora do plano", type: "pills", weight: 10,
      options: [
        { label: "Nenhuma", val: 4 }, { label: "1 vez", val: 3 },
        { label: "2–3 vezes", val: 2 }, { label: "4–5 vezes", val: 1 },
        { label: "Todo dia", val: 0 }
      ]
    },
    {
      id: "a3", label: "A3 · Hidratação diária estimada", type: "pills", weight: 10,
      options: [
        { label: "Menos de 1L", val: 0 }, { label: "1–1,5L", val: 2 },
        { label: "1,5–2L", val: 3 }, { label: "Mais de 2L", val: 4 }
      ]
    }
  ],
  corpo: [
    {
      id: "b1", label: "B1 · Nível de energia médio", type: "pills", weight: 8,
      options: [
        { label: "Muito baixo", val: 0 }, { label: "Abaixo", val: 1 },
        { label: "Normal", val: 2 }, { label: "Boa", val: 3 },
        { label: "Excelente", val: 4 }
      ]
    },
    {
      id: "b2", label: "B2 · Qualidade do sono", type: "pills", weight: 8,
      options: [
        { label: "Muito ruim", val: 0 }, { label: "Regular", val: 1 },
        { label: "Boa", val: 2 }, { label: "Muito boa", val: 3 },
        { label: "Ótima", val: 4 }
      ]
    },
    {
      id: "b3", label: "B3 · Sintomas físicos (marque todos)", type: "multi",
      options: [
        { label: "Inchaço", val: -1 }, { label: "Azia/refluxo", val: -1 },
        { label: "Intestino preso", val: -1 }, { label: "Diarreia", val: -1 },
        { label: "Tontura/fraqueza", val: -1 }, { label: "Dor de cabeça", val: -1 },
        { label: "Nenhum sintoma", val: 0 }
      ]
    },
    {
      id: "b4", label: "B4 · Funcionamento intestinal", type: "pills", weight: 8,
      options: [
        { label: "Muito irregular", val: 0 }, { label: "Irregular", val: 1 },
        { label: "Regular", val: 3 }, { label: "Muito regular", val: 4 }
      ]
    }
  ],
  comp: [
    {
      id: "c1", label: "C1 · Estado emocional geral", type: "pills", weight: 7,
      options: [
        { label: "Muito estressado(a)", val: 0 }, { label: "Ansioso(a)", val: 1 },
        { label: "Neutro", val: 2 }, { label: "Bem", val: 3 },
        { label: "Ótimo", val: 4 }
      ]
    },
    {
      id: "c2", label: "C2 · Comer emocional", type: "pills", weight: 7,
      options: [
        { label: "Não ocorreu", val: 4 }, { label: "1 episódio", val: 3 },
        { label: "2–3 episódios", val: 2 }, { label: "Frequente", val: 1 },
        { label: "Todo dia", val: 0 }
      ]
    },
    {
      id: "c3", label: "C3 · Vontades intensas por comida", type: "pills", weight: 6,
      options: [
        { label: "Nenhum", val: 4 }, { label: "Leves e controlados", val: 3 },
        { label: "Moderados", val: 2 }, { label: "Intensos", val: 1 },
        { label: "Incontroláveis", val: 0 }
      ]
    }
  ],
  treino: [
    {
      id: "d1", label: "D1 · Sessões de treino realizadas", type: "pills", weight: 8,
      options: [
        { label: "Nenhum", val: 0 }, { label: "1", val: 1 },
        { label: "2–3", val: 2 }, { label: "4–5", val: 3 }, { label: "6+", val: 4 }
      ]
    },
    {
      id: "d2", label: "D2 · Performance / disposição", type: "pills", weight: 7,
      options: [
        { label: "Muito baixa", val: 0 }, { label: "Abaixo", val: 1 },
        { label: "Normal", val: 2 }, { label: "Boa", val: 3 },
        { label: "Excelente", val: 4 }, { label: "Não treinei", val: 5 }
      ]
    }
  ]
};

const BLOCK_CONFIG = {
  adesao: { label: "Adesão Alimentar", weight: 35, color: "#c9a84c" },
  corpo:  { label: "Resposta Corporal", weight: 30, color: "#3ecf8e" },
  comp:   { label: "Comportamento",     weight: 20, color: "#60a5fa" },
  treino: { label: "Atividade Física",  weight: 15, color: "#fbbf24" }
};

export default function CheckinSemanal() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [blockScores, setBlockScores] = useState({});

  const setAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));
  const toggleMulti = (id, label) => {
    setAnswers(prev => {
      const cur = prev[id] || [];
      if (cur.includes(label)) return { ...prev, [id]: cur.filter(x => x !== label) };
      return { ...prev, [id]: [...cur, label] };
    });
  };

  useEffect(() => {
    let total = 0;
    const bs = {};

    Object.entries(QUESTIONS).forEach(([block, qs]) => {
      const cfg = BLOCK_CONFIG[block];
      let blockRaw = 0;
      let blockMax = 0;

      qs.forEach(q => {
        if (q.type === "scale") {
          const v = answers[q.id];
          const contrib = v !== undefined ? (v / 10) * q.weight : 0;
          blockRaw += contrib;
          blockMax += q.weight;
        } else if (q.type === "pills") {
          const v = answers[q.id];
          const contrib = v !== undefined ? (v / 4) * q.weight : 0;
          blockRaw += contrib;
          blockMax += q.weight;
        } else if (q.type === "multi") {
          const sel = answers[q.id] || [];
          const hasNone = sel.includes("Nenhum sintoma");
          if (!hasNone) {
            const penalty = sel.filter(s => {
              const opt = q.options.find(o => o.label === s);
              return opt && opt.val < 0;
            }).length;
            blockRaw -= penalty * 2;
          }
        }
      });

      const pct = blockMax > 0 ? Math.round(Math.min(100, Math.max(0, (blockRaw / blockMax) * 100))) : 0;
      bs[block] = pct;
      total += (pct / 100) * cfg.weight;
    });

    const t = Math.round(Math.min(100, Math.max(0, total)));
    setScore(t);
    setBlockScores(bs);
  }, [answers]);

  const getStatus = (s) => {
    if (s === null) return "Responda as perguntas";
    if (s >= 85) return "Paciente exemplar";
    if (s >= 75) return "Muito bem engajado";
    if (s >= 60) return "Engajamento moderado";
    if (s >= 45) return "Sinal de alerta";
    return "Risco de abandono";
  };

  const getColor = (s) => {
    if (s === null) return "#c9a84c";
    if (s >= 75) return "#3ecf8e";
    if (s >= 55) return "#fbbf24";
    return "#f87171";
  };

  const getVal = (id) => {
    const allQ = Object.values(QUESTIONS).flat();
    const q = allQ.find(x => x.id === id);
    if (!q) return "—";
    const a = answers[id];
    if (a === undefined || a === null) return "—";
    if (q.type === "scale") return `${a}/10`;
    if (q.type === "pills") {
      const opt = q.options.find(o => o.val === a);
      return opt ? opt.label : "—";
    }
    if (q.type === "multi") return (a && a.length) ? a.join(", ") : "—";
    return "—";
  };

  const handleSubmit = () => {
    const today = new Date().toLocaleDateString("pt-BR");
    const scoreNum = score !== null ? score : "—";
    const status = getStatus(score);

    const msg = `CHECK-IN SEMANAL\nData: ${today}\n\nSCORE DE ENGAJAMENTO: ${scoreNum}/100\nStatus: ${status}\nAdesao: ${blockScores.adesao || 0}% | Corpo: ${blockScores.corpo || 0}% | Comportamento: ${blockScores.comp || 0}% | Treino: ${blockScores.treino || 0}%\n\nADESAO ALIMENTAR\nA1 Adesao geral: ${getVal("a1")}\nA2 Refeicoes fora do plano: ${getVal("a2")}\nA3 Hidratacao: ${getVal("a3")}\n\nRESPOSTA CORPORAL\nB1 Energia: ${getVal("b1")}\nB2 Sono: ${getVal("b2")}\nB3 Sintomas: ${getVal("b3")}\nB4 Intestino: ${getVal("b4")}\n\nCOMPORTAMENTO ALIMENTAR\nC1 Estado emocional: ${getVal("c1")}\nC2 Comer emocional: ${getVal("c2")}\nC3 Vontades intensas: ${getVal("c3")}\n\nATIVIDADE FISICA\nD1 Sessoes de treino: ${getVal("d1")}\nD2 Performance: ${getVal("d2")}`;

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };

  const scoreColor = getColor(score);
  const circumference = 263.9;
  const offset = score !== null ? circumference - (score / 100) * circumference : circumference;

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "serif" }}>
        <div style={{ textAlign: "center", color: "white", padding: "40px" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(62,207,142,0.15)", border: "1px solid rgba(62,207,142,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 24px" }}>✓</div>
          <h2 style={{ fontSize: "2rem", marginBottom: 12, fontFamily: "serif" }}>Check-in enviado.</h2>
          <p style={{ color: "#999", fontFamily: "sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>Recebi seu check-in. Acompanho sua evolução toda semana e entro em contato se precisar intervir.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e6e0", fontFamily: "'Mulish', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pill { background: #111; touch-action: manipulation; -webkit-tap-highlight-color: transparent; cursor: pointer; border: 1px solid #2a2a2a; color: #888; font-size: 0.8rem; padding: 8px 14px; border-radius: 8px; cursor: pointer; transition: all 0.15s; user-select: none; display: inline-block; }
        .pill:hover { border-color: #c9a84c; color: #e8e6e0; }
        .pill.sel { background: rgba(201,168,76,0.15); border-color: #c9a84c; color: #c9a84c; font-weight: 600; }
        .scale-pip { flex: 1; touch-action: manipulation; -webkit-tap-highlight-color: transparent; cursor: pointer; height: 36px; border: 1px solid #2a2a2a; border-radius: 6px; background: #0a0a0a; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #555; transition: all 0.15s; }
        .scale-pip:hover { border-color: #c9a84c; color: #c9a84c; }
        .scale-pip.sel { background: #c9a84c; border-color: #c9a84c; color: #0a0a0a; }
      `}</style>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, background: "rgba(10,10,10,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid #222", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, zIndex: 50 }}>
        <span style={{ fontFamily: "serif", color: "#c9a84c", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.06em" }}>LEONARDO CUNHA</span>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.08)", padding: "5px 14px", borderRadius: 20 }}>Check-in Semanal</span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* HERO */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1.2, marginBottom: 10 }}>
            Sua semana em <em style={{ fontStyle: "italic", color: "#c9a84c" }}>dados.</em>
          </h1>
          <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300 }}>Respostas objetivas. Leva menos de 2 minutos. Suas respostas chegam direto para mim. É assim que acompanho sua evolução semana a semana e identifico quando preciso intervir.</p>
        </div>

        {/* SCORE WIDGET */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 14, padding: "24px 28px", marginBottom: 16, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width="96" height="96" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#222" strokeWidth="7" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="7"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.7rem", fontWeight: 800, color: scoreColor, lineHeight: 1, fontFamily: "sans-serif" }}>{score !== null ? score : "—"}</span>
              <span style={{ fontSize: "0.6rem", color: "#666" }}>/100</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 4 }}>Score de Engajamento</div>
            <div style={{ fontFamily: "serif", fontSize: "1.3rem", color: "#e8e6e0", marginBottom: 12 }}>{getStatus(score)}</div>
            {Object.entries(BLOCK_CONFIG).map(([key, cfg]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: "0.68rem", color: "#666", width: 100, flexShrink: 0 }}>{cfg.label}</span>
                <div style={{ flex: 1, height: 4, background: "#222", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: cfg.color, borderRadius: 10, width: `${blockScores[key] || 0}%`, transition: "width 0.5s ease" }} />
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: cfg.color, width: 32, textAlign: "right" }}>{blockScores[key] !== undefined ? `${blockScores[key]}%` : "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCKS */}
        {Object.entries(QUESTIONS).map(([blockKey, qs]) => {
          const cfg = BLOCK_CONFIG[blockKey];
          return (
            <div key={blockKey} style={{ background: "#111", border: "1px solid #222", borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ background: "#181818", borderBottom: "1px solid #222", padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${cfg.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: cfg.color, fontSize: "0.8rem", fontWeight: 700 }}>{blockKey[0].toUpperCase()}</span>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#e8e6e0" }}>{cfg.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "#666", marginTop: 2 }}>Peso: {cfg.weight}% do score</div>
                </div>
              </div>
              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
                {qs.map((q, qi) => (
                  <div key={q.id}>
                    {qi > 0 && <div style={{ height: 1, background: "#222", margin: "0 0 20px" }} />}
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#999", marginBottom: 10 }}>
                      <span style={{ color: "#c9a84c", fontWeight: 700 }}>{q.id.toUpperCase()} </span>{q.label.split("·")[1]}
                    </div>

                    {q.type === "scale" && (
                      <>
                        <div style={{ display: "flex", gap: 4 }}>
                          {Array.from({ length: 11 }, (_, i) => (
                            <div key={i} className={`scale-pip${answers[q.id] === i ? " sel" : ""}`}
                            onClick={(e) => { e.preventDefault(); setAnswer(q.id, i); }}
                            onTouchEnd={(e) => { e.preventDefault(); setAnswer(q.id, i); }}>{i}</div>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: "0.65rem", color: "#555" }}>
                          <span>Não segui</span><span>Segui 100%</span>
                        </div>
                      </>
                    )}

                    {q.type === "pills" && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {q.options.map(opt => (
                          <div key={opt.label} className={`pill${answers[q.id] === opt.val && answers[q.id] !== undefined ? " sel" : ""}`}
                            onClick={(e) => { e.preventDefault(); setAnswer(q.id, opt.val); }}
                            onTouchEnd={(e) => { e.preventDefault(); setAnswer(q.id, opt.val); }}>{opt.label}</div>
                        ))}
                      </div>
                    )}

                    {q.type === "multi" && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {q.options.map(opt => {
                          const sel = (answers[q.id] || []).includes(opt.label);
                          return (
                            <div key={opt.label} className={`pill${sel ? " sel" : ""}`}
                            onClick={(e) => { e.preventDefault(); toggleMulti(q.id, opt.label); }}
                            onTouchEnd={(e) => { e.preventDefault(); toggleMulti(q.id, opt.label); }}>
                              <span style={{ marginRight: 5, fontSize: "0.7rem", border: `1.5px solid ${sel ? "#c9a84c" : "#555"}`, borderRadius: 3, width: 13, height: 13, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{sel ? "✓" : ""}</span>
                              {opt.label}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* SUBMIT */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 14, padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.6, fontWeight: 300 }}>
            Score calculado automaticamente. <strong style={{ color: "#c9a84c", fontWeight: 600 }}>Você não precisa interpretar nada.</strong> Monitorar isso é parte do meu trabalho no seu acompanhamento.
          </div>
          <button onClick={handleSubmit}
            style={{ background: "#c9a84c", color: "#0a0a0a", border: "none", padding: "13px 30px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Enviar Check-in →
          </button>
        </div>

      </div>
    </div>
  );
}
