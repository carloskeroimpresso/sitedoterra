const StorySection = () => {
  return (
    <section id="historia" className="py-[100px] px-[8%] grid grid-cols-1 lg:grid-cols-2 gap-[6rem] items-center" style={{ background: "var(--creme)" }}>
      <div className="relative reveal max-w-[380px] lg:max-w-none mx-auto lg:mx-0">
        <div className="w-full rounded-t-[200px] rounded-b-[16px] overflow-hidden flex items-center justify-center" style={{ aspectRatio: "4/5", background: "linear-gradient(160deg, var(--verde-claro) 0%, var(--verde) 100%)" }}>
          <div className="flex flex-col items-center gap-2 text-[rgba(255,255,255,0.4)] text-[0.75rem] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
            <svg width="60" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="28" r="14" stroke="white" strokeWidth="1.5" /><path d="M10 70c0-16.569 13.431-30 30-30s30 13.431 30 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <p>Foto da Consultora</p>
          </div>
        </div>
        <div className="absolute top-5 -right-5 w-full h-full rounded-t-[200px] rounded-b-[16px] border border-[rgba(196,150,58,0.25)] -z-10" />
        <div className="absolute bottom-[30px] -right-5 bg-[var(--branco)] rounded-[10px] py-[1.2rem] px-6 border-l-[3px] border-l-[var(--ouro)]" style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
          <span className="block text-[2.2rem] font-medium text-[var(--verde)]" style={{ fontFamily: "var(--font-heading)" }}>7 anos</span>
          <span className="text-[0.72rem] text-[var(--cinza)] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-body)" }}>transformando vidas</span>
        </div>
      </div>
      <div className="reveal" style={{ transitionDelay: "0.2s" }}>
        <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-text">Minha jornada</span></div>
        <h2 className="section-title">Uma história de<br /><em>cura e propósito</em></h2>
        {["Tudo começou quando minha filha tinha apenas 2 anos e eu me vi completamente perdida tentando encontrar alternativas naturais para as constantes gripes e alergias dela.", "Uma amiga me apresentou aos óleos essenciais doTERRA e aquilo mudou tudo. Em poucos meses, vi transformações que eu nem imaginava serem possíveis — não só na saúde da minha filha, mas em toda a nossa família.", "Hoje, 7 anos depois, tenho o privilégio de acompanhar mais de 850 famílias nessa mesma jornada de descoberta. Cada história que ouço me renova a certeza de que estou no lugar certo, fazendo exatamente o que fui chamada para fazer."].map((p, i) => (
          <p key={i} className="text-[0.95rem] leading-[1.9] text-[var(--cinza)] mb-[1.2rem]" style={{ fontFamily: "var(--font-body)" }}>{p}</p>
        ))}
        <p className="text-[2rem] italic text-[var(--verde)] font-normal mt-6" style={{ fontFamily: "var(--font-heading)" }}>Ana Beatriz ✦</p>
      </div>
    </section>
  );
};

export default StorySection;
