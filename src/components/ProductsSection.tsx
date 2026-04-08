import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fallbackProducts = [
  { id: "1", emoji: "🌿", badge: "Mais vendido", category: "Proteção imunológica", name: "On Guard®", description: "Blend protetor com sabor de canela, cravo, laranja-selvagem e eucalipto. Fortalece o sistema imunológico naturalmente.", price: "R$ 189,00", bg_gradient: "linear-gradient(135deg, #e8f5ee 0%, #c8e8d8 100%)", has_price: true, promo_price: null, external_link: null, image_url: null },
  { id: "2", emoji: "💜", badge: "Bestseller", category: "Relaxamento & sono", name: "Lavender", description: "O óleo mais versátil do mundo. Calma, relaxa, auxilia o sono e tem propriedades calmantes naturais incomparáveis.", price: "R$ 149,00", bg_gradient: "linear-gradient(135deg, #f0f4fe 0%, #c8d8f8 100%)", has_price: true, promo_price: null, external_link: null, image_url: null },
  { id: "3", emoji: "🍋", badge: "", category: "Energia & clareza", name: "Lemon", description: "Fresco e revitalizante, o limão doTERRA limpa, energiza e eleva o ânimo. Perfeito para aromatizar e purificar ambientes.", price: "R$ 89,00", bg_gradient: "linear-gradient(135deg, #fff8e8 0%, #fce8b0 100%)", has_price: true, promo_price: null, external_link: null, image_url: null },
];

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}

function calcDiscount(price: string, promoPrice: string): number {
  const p = parsePrice(price);
  const pp = parsePrice(promoPrice);
  if (p <= 0 || pp <= 0 || pp >= p) return 0;
  return Math.round((1 - pp / p) * 100);
}

const ProductsSection = () => {
  const { data: products } = useQuery({
    queryKey: ["products_public"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").eq("active", true).order("sort_order");
      return data && data.length > 0 ? data : null;
    },
  });

  const items = products || fallbackProducts;

  return (
    <section id="produtos" className="py-[100px] px-[8%]" style={{ background: "var(--branco)" }}>
      <div className="flex items-end justify-between mb-12 flex-wrap gap-8">
        <div className="reveal">
          <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-text">Favoritos</span></div>
          <h2 className="section-title">Produtos <em>em destaque</em></h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p: any, i: number) => {
          const hasPrice = p.has_price !== false;
          const hasPromo = hasPrice && p.promo_price;
          const discount = hasPromo ? calcDiscount(p.price, p.promo_price) : 0;
          const productLink = p.external_link || "#";

          return (
            <div key={p.id || p.name} className="reveal rounded-[14px] overflow-hidden border border-[rgba(0,0,0,0.05)] transition-all duration-400 bg-[var(--branco)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(29,92,58,0.1)]" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="flex items-center justify-center text-[4rem] relative overflow-hidden" style={{ aspectRatio: "4/3", background: p.bg_gradient || "linear-gradient(135deg, #e8f5ee 0%, #c8e8d8 100%)" }}>
                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <span>{p.emoji}</span>}
                {p.badge && <span className="absolute top-3 left-3 bg-[var(--ouro)] text-white text-[0.65rem] font-medium tracking-[0.08em] uppercase px-[10px] py-[3px] rounded-[20px]" style={{ fontFamily: "var(--font-body)" }}>{p.badge}</span>}
                {discount > 0 && <span className="absolute top-3 right-3 bg-red-500 text-white text-[0.65rem] font-bold px-[8px] py-[3px] rounded-[20px]">-{discount}%</span>}
              </div>
              <div className="p-6">
                <div className="text-[0.68rem] font-medium tracking-[0.15em] uppercase text-[var(--verde-claro)] mb-1" style={{ fontFamily: "var(--font-body)" }}>{p.category}</div>
                <div className="text-[1.2rem] font-medium text-[var(--verde)] mb-2 leading-[1.2]" style={{ fontFamily: "var(--font-heading)" }}>{p.name}</div>
                <p className="text-[0.82rem] text-[var(--cinza)] leading-[1.7] mb-5" style={{ fontFamily: "var(--font-body)" }}>{p.description}</p>
                <div className="flex items-center justify-between">
                  {hasPrice ? (
                    <div className="flex items-baseline gap-2">
                      {hasPromo ? (
                        <>
                          <span className="text-[0.9rem] text-[var(--cinza-claro)] line-through" style={{ fontFamily: "var(--font-body)" }}>{p.price}</span>
                          <span className="text-[1.4rem] font-medium text-[var(--preto)]" style={{ fontFamily: "var(--font-heading)" }}>{p.promo_price}</span>
                        </>
                      ) : (
                        <span className="text-[1.4rem] font-medium text-[var(--preto)]" style={{ fontFamily: "var(--font-heading)" }}>{p.price}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[0.85rem] text-[var(--cinza)]" style={{ fontFamily: "var(--font-body)" }}>Consulte o preço</span>
                  )}
                  <a href={productLink} target={p.external_link ? "_blank" : undefined} rel={p.external_link ? "noopener noreferrer" : undefined} className="bg-[var(--verde)] text-[var(--branco)] text-[0.72rem] font-medium tracking-[0.08em] px-[1.1rem] py-[0.55rem] rounded-[6px] no-underline uppercase transition-all hover:bg-[var(--verde-medio)]" style={{ fontFamily: "var(--font-body)" }}>
                    {p.external_link ? "Comprar ↗" : "Ver produto"}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductsSection;
