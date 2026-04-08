import { useState, useRef, useEffect } from "react";

interface Message {
  type: "bot" | "user";
  content: string;
  isOilSuggestion?: boolean;
  oils?: string[];
}

const responses: Record<string, { text: string; oils: string[] }> = {
  default: { text: "Baseado no que você descreveu, recomendo:", oils: ["Lavender", "Balance", "Serenity"] },
  ansiedade: { text: "Para ansiedade e sono, os óleos mais indicados são:", oils: ["Lavender", "Serenity", "Balance", "Vetiver"] },
  dor: { text: "Para alívio de dores de cabeça, recomendo:", oils: ["Peppermint", "Deep Blue", "PastTense"] },
  imunidade: { text: "Para fortalecer a imunidade naturalmente:", oils: ["On Guard", "Oregano", "Frankincense"] },
  energia: { text: "Para mais energia e clareza mental:", oils: ["Peppermint", "Wild Orange", "Motivate", "InTune"] },
};

function getResponse(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("ansiedad") || m.includes("sono") || m.includes("dormir")) return responses.ansiedade;
  if (m.includes("dor") || m.includes("cabe")) return responses.dor;
  if (m.includes("imunid") || m.includes("gripe") || m.includes("resfriado")) return responses.imunidade;
  if (m.includes("energia") || m.includes("cansad") || m.includes("disposiç")) return responses.energia;
  return responses.default;
}

const suggestions = [
  { emoji: "😴", label: "Ansiedade e sono", text: "Estou com muita ansiedade e dificuldade para dormir" },
  { emoji: "🤕", label: "Dor de cabeça", text: "Tenho muita dor de cabeça frequente" },
  { emoji: "🛡️", label: "Imunidade", text: "Quero aumentar minha imunidade naturalmente" },
];

const AISpecialistSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", content: "Olá! Sou a assistente especialista em óleos essenciais doTERRA 🌿 Me conte como você está se sentindo hoje — fisicamente ou emocionalmente — e vou indicar os melhores óleos para o seu momento!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { type: "user", content: msg }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const resp = getResponse(msg);
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "bot", content: resp.text, isOilSuggestion: true, oils: resp.oils }]);
    }, 1600);
  };

  return (
    <section id="ia" className="py-[100px] px-[8%] grid grid-cols-1 lg:grid-cols-2 gap-[6rem] items-center" style={{ background: "var(--creme)" }}>
      <div className="reveal">
        <div className="section-eyebrow">
          <span className="eyebrow-line" />
          <span className="eyebrow-text">Tecnologia + Natureza</span>
        </div>
        <h2 className="section-title">Especialista <em>IA</em><br />doTERRA</h2>
        <p className="section-sub">Descreva como você está se sentindo — física ou emocionalmente — e nossa inteligência artificial vai indicar os melhores óleos essenciais para o seu momento.</p>
        <div className="mt-10 flex gap-4 flex-wrap">
          {suggestions.map((s) => (
            <button key={s.label} onClick={() => sendMessage(s.text)} className="bg-[rgba(29,92,58,0.07)] border border-[rgba(29,92,58,0.15)] rounded-[20px] px-4 py-[0.4rem] text-[0.78rem] text-[var(--verde)] cursor-pointer transition-all duration-200 hover:bg-[rgba(29,92,58,0.15)]" style={{ fontFamily: "var(--font-body)" }}>
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="reveal rounded-[16px] overflow-hidden bg-[var(--branco)]" style={{ boxShadow: "0 30px 80px rgba(29,92,58,0.1), 0 0 0 1px rgba(29,92,58,0.06)" }}>
        <div className="bg-[var(--verde)] py-[1.2rem] px-6 flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-full bg-[var(--verde-claro)] flex items-center justify-center text-[1.1rem] shrink-0">🤖</div>
          <div>
            <div className="text-[0.85rem] font-medium text-[var(--branco)]" style={{ fontFamily: "var(--font-body)" }}>Especialista IA doTERRA</div>
            <div className="text-[0.72rem] text-[var(--verde-menta)] flex items-center gap-[5px]" style={{ fontFamily: "var(--font-body)" }}>
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--verde-menta)] animate-pulse" />Online agora
            </div>
          </div>
        </div>

        <div ref={messagesRef} className="p-6 flex flex-col gap-4 min-h-[320px] max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`max-w-[80%] flex flex-col gap-1 ${msg.type === "user" ? "self-end" : "self-start"}`}>
              {msg.isOilSuggestion ? (
                <div className="rounded-[12px] p-4" style={{ background: "linear-gradient(135deg, rgba(45,122,79,0.08) 0%, rgba(196,150,58,0.06) 100%)", border: "1px solid rgba(45,122,79,0.15)" }}>
                  <div className="text-[0.95rem] font-medium text-[var(--verde)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>✨ {msg.content}</div>
                  <div className="flex flex-wrap gap-[6px] mb-3">
                    {msg.oils?.map((oil) => (
                      <span key={oil} className="bg-[var(--verde)] text-[var(--branco)] text-[0.72rem] px-[10px] py-[3px] rounded-[20px] font-medium" style={{ fontFamily: "var(--font-body)" }}>{oil}</span>
                    ))}
                  </div>
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[7px] bg-[#25D366] text-white text-[0.75rem] font-medium px-4 py-2 rounded-[6px] no-underline transition-all hover:bg-[#1ebe57]" style={{ fontFamily: "var(--font-body)" }}>
                    Conversar com a Ana
                  </a>
                </div>
              ) : (
                <div className={`px-4 py-3 text-[0.85rem] leading-[1.6] ${msg.type === "bot" ? "bg-[var(--creme)] text-[var(--preto)] rounded-[4px_12px_12px_12px]" : "bg-[var(--verde)] text-[var(--branco)] rounded-[12px_12px_4px_12px]"}`} style={{ fontFamily: "var(--font-body)" }}>
                  {msg.content}
                </div>
              )}
              <span className={`text-[0.65rem] text-[var(--cinza-claro)] px-1 ${msg.type === "user" ? "text-right" : ""}`}>agora</span>
            </div>
          ))}
          {isTyping && (
            <div className="self-start">
              <div className="flex gap-1 px-4 py-3 bg-[var(--creme)] rounded-[4px_12px_12px_12px] w-fit">
                <div className="w-[6px] h-[6px] rounded-full bg-[var(--cinza-claro)] animate-[typingBounce_1.4s_infinite_ease-in-out]" />
                <div className="w-[6px] h-[6px] rounded-full bg-[var(--cinza-claro)] animate-[typingBounce_1.4s_infinite_ease-in-out_0.2s]" />
                <div className="w-[6px] h-[6px] rounded-full bg-[var(--cinza-claro)] animate-[typingBounce_1.4s_infinite_ease-in-out_0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-4 border-t border-[rgba(0,0,0,0.06)] flex gap-[10px]">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Como você está se sentindo?" className="flex-1 bg-[var(--creme)] border border-[rgba(29,92,58,0.15)] rounded-[24px] px-[1.2rem] py-[0.65rem] text-[0.85rem] text-[var(--preto)] outline-none transition-[border-color] duration-300 placeholder:text-[var(--cinza-claro)] focus:border-[var(--verde-medio)]" style={{ fontFamily: "var(--font-body)" }} />
          <button onClick={() => sendMessage()} className="w-10 h-10 rounded-full bg-[var(--verde)] border-none cursor-pointer flex items-center justify-center transition-all hover:bg-[var(--verde-medio)] hover:scale-105 shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 fill-white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AISpecialistSection;
