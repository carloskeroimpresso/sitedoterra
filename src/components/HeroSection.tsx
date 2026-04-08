import { useSiteSettings } from "@/hooks/useSiteSettings";

const HeroSection = () => {
  const { settings, profile } = useSiteSettings();
  const consultantName = profile.full_name || settings.site_name || "Ana Beatriz";
  const nameParts = consultantName.split(" ");
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(" ");
  const roleText = profile.role_text || "Consultora doTERRA";
  const photoUrl = settings.consultant_photo_url || profile.avatar_url;
  const whatsapp = settings.whatsapp_number || "5511999999999";

  return (
    <section
      id="hero"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, var(--verde) 0%, #0D3320 60%, #0A2418 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[rgba(168,213,181,0.08)] -top-[150px] -right-[100px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[rgba(196,150,58,0.1)] top-[50px] right-[50px]" />
        <div className="absolute w-px h-[200px] left-1/2 bottom-[60px]" style={{ background: "linear-gradient(to bottom, transparent, rgba(196, 150, 58, 0.3), transparent)" }} />
        <div className="absolute top-[30%] left-[5%] grid grid-cols-6 gap-[14px]">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="block w-[3px] h-[3px] rounded-full bg-[rgba(168,213,181,0.2)]" />
          ))}
        </div>
      </div>

      <div className="pt-[120px] pb-[80px] px-[8%] relative z-[2]">
        <div className="flex items-center gap-3 mb-6 opacity-0 animate-[fadeUp_0.8s_ease_0.3s_forwards]">
          <span className="w-10 h-px bg-[var(--ouro)]" />
          <span className="text-[0.72rem] font-normal tracking-[0.2em] uppercase text-[var(--ouro)]" style={{ fontFamily: "var(--font-body)" }}>
            Consultora Certificada doTERRA
          </span>
        </div>

        <h1
          className="text-[var(--branco)] leading-[1.05] tracking-[-0.02em] mb-[0.3rem] opacity-0 animate-[fadeUp_0.8s_ease_0.5s_forwards]"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 300, fontSize: "clamp(3.5rem, 6vw, 5.5rem)" }}
        >
          {firstName} {restName && <><em className="italic text-[var(--verde-menta)]">{nameParts[1]}</em>{nameParts.length > 2 && <><br />{nameParts.slice(2).join(" ")}</>}</>}
        </h1>

        <p
          className="text-[var(--ouro-claro)] tracking-[0.08em] mb-8 opacity-0 animate-[fadeUp_0.8s_ease_0.65s_forwards]"
          style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 400 }}
        >
          {roleText}
        </p>

        <p
          className="text-[rgba(255,255,255,0.65)] leading-[1.8] max-w-[420px] mb-12 opacity-0 animate-[fadeUp_0.8s_ease_0.8s_forwards]"
          style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300 }}
        >
          {profile.bio || "Transformo bem-estar em rotina com os melhores óleos essenciais do mundo. Há 7 anos ajudo famílias a descobrirem o poder da natureza para uma vida mais equilibrada e saudável."}
        </p>

        <div className="flex gap-4 flex-wrap opacity-0 animate-[fadeUp_0.8s_ease_0.95s_forwards]">
          <a href="#ia" className="btn-primary-custom">Falar com a IA</a>
          <a href="#produtos" className="btn-secondary-custom">Ver Produtos →</a>
        </div>

        <div className="flex gap-10 mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)] opacity-0 animate-[fadeUp_0.8s_ease_1.1s_forwards] flex-wrap">
          {[
            { num: "7+", label: "Anos de experiência" },
            { num: "850+", label: "Clientes atendidas" },
            { num: "98%", label: "Satisfação" },
          ].map((stat) => (
            <div key={stat.label}>
              <span className="block text-[var(--branco)] text-[2rem] font-medium" style={{ fontFamily: "var(--font-heading)" }}>{stat.num}</span>
              <span className="text-[rgba(255,255,255,0.45)] text-[0.72rem] tracking-[0.12em] uppercase" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-[50vh] lg:h-screen flex items-end justify-center overflow-hidden">
        <div className="absolute bottom-0 w-[95%] max-w-[530px] h-[90%] rounded-t-[300px]" style={{ border: "1px solid rgba(196, 150, 58, 0.2)", transform: "translate(20px, 0)" }} />
        <div className="absolute bottom-0 w-[85%] max-w-[500px] h-[88%] rounded-t-[300px] overflow-hidden opacity-0 animate-[fadeIn_1s_ease_0.6s_forwards]">
          {photoUrl ? (
            <img src={photoUrl} alt={consultantName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: "linear-gradient(180deg, rgba(45,122,79,0.3) 0%, rgba(29,92,58,0.8) 100%)" }}>
              <svg viewBox="0 0 80 80" fill="none" className="w-20 opacity-40">
                <circle cx="40" cy="28" r="14" stroke="white" strokeWidth="1.5" />
                <path d="M10 70c0-16.569 13.431-30 30-30s30 13.431 30 30" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-[rgba(255,255,255,0.5)] text-[0.78rem] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-body)" }}>Foto da Consultora</p>
            </div>
          )}
        </div>
        <div className="absolute left-0 top-[40%] flex items-center gap-3 rounded px-5 py-4 opacity-0 animate-[fadeRight_0.8s_ease_1.2s_forwards]" style={{ background: "rgba(247,242,234,0.95)", backdropFilter: "blur(10px)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div className="w-[42px] h-[42px] rounded-full bg-[var(--verde-claro)] flex items-center justify-center text-[1.2rem] shrink-0">🌿</div>
          <div>
            <strong className="block text-[var(--verde)] text-[1rem] font-medium" style={{ fontFamily: "var(--font-heading)" }}>Certified Wellness</strong>
            <span className="text-[var(--cinza)] text-[0.72rem]" style={{ fontFamily: "var(--font-body)" }}>doTERRA Diamond Rank</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
