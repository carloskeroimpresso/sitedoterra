const VideoSection = () => {
  return (
    <section id="video" className="py-[80px] px-[8%] grid grid-cols-1 lg:grid-cols-2 gap-[5rem] items-center" style={{ background: "var(--verde)" }}>
      <div className="reveal">
        <div className="section-eyebrow">
          <span className="eyebrow-line" style={{ background: "var(--ouro-claro)" }} />
          <span className="eyebrow-text" style={{ color: "var(--ouro-claro)" }}>Assista agora</span>
        </div>
        <h2 className="section-title" style={{ color: "var(--branco)" }}>
          O que são óleos
          <br />
          <em style={{ color: "var(--verde-menta)" }}>essenciais puros?</em>
        </h2>
        <p className="section-sub" style={{ color: "rgba(255,255,255,0.6)" }}>
          Neste vídeo explico de forma simples como os óleos funcionam, por que a pureza faz toda a diferença e como começar sua jornada com segurança.
        </p>
        <div className="mt-8">
          <a href="#ia" className="btn-secondary-custom">Tirar dúvidas com a IA →</a>
        </div>
      </div>

      <div className="reveal rounded-[12px] overflow-hidden relative border border-[rgba(255,255,255,0.1)] cursor-pointer group" style={{ aspectRatio: "16/9", background: "rgba(0,0,0,0.3)", transitionDelay: "0.2s" }}>
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3 transition-all"
          style={{ background: "linear-gradient(160deg, rgba(45,122,79,0.5) 0%, rgba(13,51,32,0.9) 100%)" }}
        >
          <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center border-2 border-[rgba(255,255,255,0.4)] transition-all duration-300 group-hover:bg-[var(--ouro)] group-hover:border-[var(--ouro)] group-hover:scale-[1.08]" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
            <div className="w-0 h-0 ml-1" style={{ borderStyle: "solid", borderWidth: "12px 0 12px 22px", borderColor: "transparent transparent transparent white" }} />
          </div>
          <span className="text-[rgba(255,255,255,0.6)] text-[0.78rem] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
            Assistir vídeo • 8 min
          </span>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
