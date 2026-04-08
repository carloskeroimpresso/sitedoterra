const VitrineCTABanner = () => {
  return (
    <div
      className="flex items-center justify-between gap-8 flex-wrap px-[8%] py-6"
      style={{
        background: "linear-gradient(135deg, var(--creme-escuro) 0%, var(--creme) 100%)",
        borderTop: "3px solid var(--ouro)",
      }}
    >
      <div className="flex items-center gap-[14px] max-md:flex-col max-md:text-center">
        <span className="text-[1.4rem]">✨</span>
        <div>
          <p className="text-[1.25rem] font-medium text-[var(--verde)]" style={{ fontFamily: "var(--font-heading)" }}>
            Você é consultora doTERRA? Tenha um site profissional como este!
          </p>
          <span className="text-[0.82rem] text-[var(--cinza)]" style={{ fontFamily: "var(--font-body)" }}>
            Ferramenta completa com IA, agendamento, CRM e muito mais
          </span>
        </div>
      </div>
      <a
        href="#planos"
        className="inline-flex items-center gap-[10px] bg-[var(--verde)] text-[var(--branco)] text-[0.8rem] font-medium tracking-[0.1em] uppercase px-[2.2rem] py-[0.9rem] rounded-[2px] no-underline transition-all duration-300 whitespace-nowrap hover:bg-[var(--verde-medio)] hover:-translate-y-0.5"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Quero um site assim →
      </a>
    </div>
  );
};

export default VitrineCTABanner;
