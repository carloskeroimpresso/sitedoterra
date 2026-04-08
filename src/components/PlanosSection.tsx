const plans = [
  {
    tipo: "Plano Mensal",
    preco: "97",
    period: "por mês",
    economia: "",
    badge: "",
    destaque: false,
    features: ["Site profissional personalizado", "Chat IA especialista doTERRA", "Agendamento integrado", "CRM de clientes", "Todas as ferramentas", "Suporte por WhatsApp"],
    btnText: "Começar agora",
  },
  {
    tipo: "Plano Anual",
    preco: "299",
    period: "pagamento único · 12 meses",
    economia: "= R$ 24,75/mês — Economize 75%!",
    badge: "⭐ Mais popular",
    destaque: true,
    features: ["Tudo do plano mensal", "Domínio próprio incluso", "Base de conhecimento IA", "Relatórios avançados", "Prioridade no suporte", "Novidades em primeira mão"],
    btnText: "Quero o anual!",
  },
];

const PlanosSection = () => {
  return (
    <section id="planos" className="py-[100px] px-[8%] text-center relative overflow-hidden" style={{ background: "var(--verde)" }}>
      {/* Deco circles */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-[rgba(255,255,255,0.05)] -top-[200px] -left-[200px]" />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-[rgba(196,150,58,0.1)] -bottom-[150px] -right-[100px]" />

      <div className="relative z-[2]">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="eyebrow-line" style={{ background: "var(--ouro-claro)" }} />
          <span className="eyebrow-text" style={{ color: "var(--ouro-claro)" }}>Seja uma TopConsultora</span>
          <span className="eyebrow-line" style={{ background: "var(--ouro-claro)" }} />
        </div>
        <h2 className="text-[var(--branco)] mb-4" style={{ fontFamily: "var(--font-heading)", fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          Tenha um site assim<br /><em className="italic text-[var(--verde-menta)]">hoje mesmo</em>
        </h2>
        <p className="text-[rgba(255,255,255,0.6)] text-[1rem] mb-16 max-w-[500px] mx-auto" style={{ fontFamily: "var(--font-body)" }}>
          Sem precisar de programador. Pronto em minutos. Com IA, agendamento, CRM e muito mais.
        </p>

        <div className="flex gap-6 justify-center flex-wrap max-md:flex-col max-md:items-center">
          {plans.map((plan) => (
            <div
              key={plan.tipo}
              className={`rounded-[16px] p-[2.5rem_2rem] w-[280px] max-md:w-full max-md:max-w-[340px] text-left transition-all duration-400 relative hover:-translate-y-2 ${
                plan.destaque
                  ? "bg-[var(--ouro)] border border-[var(--ouro)] hover:bg-[var(--ouro-claro)]"
                  : "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)]"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-[14px] left-1/2 -translate-x-1/2 text-[0.65rem] font-medium tracking-[0.12em] uppercase px-[14px] py-1 rounded-[20px] whitespace-nowrap ${
                    plan.destaque ? "bg-[var(--verde)] text-[var(--branco)]" : "bg-[var(--ouro)] text-[var(--branco)]"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {plan.badge}
                </div>
              )}
              <div className={`text-[0.72rem] font-medium tracking-[0.2em] uppercase mb-4 ${plan.destaque ? "text-[rgba(255,255,255,0.75)]" : "text-[rgba(255,255,255,0.5)]"}`} style={{ fontFamily: "var(--font-body)" }}>
                {plan.tipo}
              </div>
              <div className="text-[3rem] font-medium text-[var(--branco)] leading-none mb-[0.2rem]" style={{ fontFamily: "var(--font-heading)" }}>
                <sup className="text-[1.2rem] font-light align-top inline-block mt-[0.6rem]">R$</sup>{plan.preco}
              </div>
              <div className={`text-[0.8rem] mb-2 ${plan.destaque ? "text-[rgba(255,255,255,0.7)]" : "text-[rgba(255,255,255,0.5)]"}`} style={{ fontFamily: "var(--font-body)" }}>
                {plan.period}
              </div>
              {plan.economia && (
                <div className={`text-[0.78rem] font-medium mb-6 ${plan.destaque ? "text-[rgba(255,255,255,0.9)]" : "text-[var(--verde-menta)]"}`} style={{ fontFamily: "var(--font-body)" }}>
                  {plan.economia}
                </div>
              )}
              <hr className="border-none border-t border-t-[rgba(255,255,255,0.15)] my-6" />
              <ul className="list-none flex flex-col gap-[0.7rem] mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-[10px] text-[0.82rem] text-[rgba(255,255,255,0.8)]" style={{ fontFamily: "var(--font-body)" }}>
                    <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[0.65rem] font-bold shrink-0 ${plan.destaque ? "bg-[rgba(255,255,255,0.25)]" : "bg-[rgba(255,255,255,0.15)]"}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`block text-center text-[0.8rem] font-medium tracking-[0.1em] uppercase py-[0.9rem] rounded-[8px] no-underline transition-all border ${
                  plan.destaque
                    ? "bg-[var(--verde)] border-[var(--verde)] text-[var(--branco)] hover:bg-[var(--verde-medio)]"
                    : "bg-[rgba(255,255,255,0.15)] border-[rgba(255,255,255,0.2)] text-[var(--branco)] hover:bg-[rgba(255,255,255,0.25)]"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanosSection;
