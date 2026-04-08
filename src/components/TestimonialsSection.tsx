import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fallbackTestimonials = [
  { id: "1", text: "Depois de 3 semanas usando o protocolo de sono da Ana, minha insônia de anos simplesmente desapareceu.", name: "Mariana Ferreira", location: "São Paulo, SP", initials: "MF", featured: false, company: null, role_title: null, photo_url: null },
  { id: "2", text: "A Ana é muito mais do que uma consultora — ela é uma verdadeira parceira de bem-estar.", name: "Carla Souza", location: "Campinas, SP", initials: "CS", featured: true, company: null, role_title: null, photo_url: null },
  { id: "3", text: "Meu filho tem 6 anos e desde que passei a usar os óleos doTERRA em casa, reduzimos muito as idas ao pediatra.", name: "Renata Lima", location: "Rio de Janeiro, RJ", initials: "RL", featured: false, company: null, role_title: null, photo_url: null },
];

const TestimonialsSection = () => {
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials_public"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").eq("active", true).order("sort_order");
      return data && data.length > 0 ? data : null;
    },
  });

  const items = testimonials || fallbackTestimonials;

  return (
    <section id="depoimentos" className="py-[100px] px-[8%]" style={{ background: "var(--branco)" }}>
      <div className="flex items-end justify-between mb-16 flex-wrap gap-8">
        <div className="reveal">
          <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-text">O que dizem por aí</span></div>
          <h2 className="section-title">Histórias que me<br /><em>inspiram todo dia</em></h2>
        </div>
        <p className="section-sub reveal">Cada depoimento é uma vida transformada pela natureza.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((t: any, i: number) => (
          <div key={t.id} className={`reveal rounded-[12px] p-8 border transition-all duration-400 cursor-default hover:-translate-y-[6px] ${t.featured ? "bg-[var(--verde)] border-transparent hover:shadow-[0_20px_50px_rgba(29,92,58,0.3)]" : "bg-[var(--creme)] border-[rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(29,92,58,0.12)]"}`} style={{ transitionDelay: `${i * 0.15}s` }}>
            <div className={`text-[3rem] leading-none mb-4 ${t.featured ? "text-[rgba(168,213,181,0.5)]" : "text-[var(--verde-menta)]"}`} style={{ fontFamily: "var(--font-heading)" }}>&ldquo;</div>
            <p className={`text-[0.92rem] leading-[1.8] italic mb-6 ${t.featured ? "text-[rgba(255,255,255,0.75)]" : "text-[var(--cinza)]"}`} style={{ fontFamily: "var(--font-body)" }}>{t.text}</p>
            <div className={`text-[0.8rem] tracking-[2px] mb-4 ${t.featured ? "text-[var(--ouro-claro)]" : "text-[var(--ouro)]"}`}>★★★★★</div>
            <div className="flex items-center gap-3">
              {t.photo_url ? (
                <img src={t.photo_url} alt={t.name} className="w-[42px] h-[42px] rounded-full object-cover shrink-0" />
              ) : (
                <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-[1.1rem] font-medium shrink-0 ${t.featured ? "bg-[rgba(255,255,255,0.15)] text-[var(--branco)]" : "bg-[var(--verde-menta)] text-[var(--verde)]"}`} style={{ fontFamily: "var(--font-heading)" }}>{t.initials}</div>
              )}
              <div>
                <div className={`text-[0.85rem] font-medium ${t.featured ? "text-[var(--branco)]" : "text-[var(--preto)]"}`} style={{ fontFamily: "var(--font-body)" }}>{t.name}</div>
                {(t.role_title || t.company) && (
                  <div className={`text-[0.72rem] ${t.featured ? "text-[rgba(255,255,255,0.6)]" : "text-[var(--cinza)]"}`} style={{ fontFamily: "var(--font-body)" }}>
                    {[t.role_title, t.company].filter(Boolean).join(" · ")}
                  </div>
                )}
                <div className={`text-[0.72rem] ${t.featured ? "text-[rgba(255,255,255,0.5)]" : "text-[var(--cinza-claro)]"}`} style={{ fontFamily: "var(--font-body)" }}>{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
