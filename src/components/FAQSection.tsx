import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fallbackFaq = [
  { id: "1", question: "Os óleos doTERRA são seguros para usar com crianças?", answer: "Sim! Os óleos doTERRA são certificados CPTG® (Grau de Pureza Terapêutica Certificado), o que significa que não contêm aditivos, pesticidas ou substâncias prejudiciais. Para crianças, recomendo sempre diluir mais (1-2 gotas para 10ml de óleo vegetal) e consultar os guias específicos por faixa etária." },
  { id: "2", question: "Como começo? Qual kit indicar para iniciantes?", answer: "O melhor ponto de entrada é o Kit Básico Familiar, que inclui os 10 óleos mais usados e versáteis. Mas dependendo do seu objetivo (saúde, sono, energia, proteção), posso indicar o kit ideal. Nossa consulta gratuita existe exatamente para isso — agende e conversamos!" },
  { id: "3", question: "Posso usar óleos essenciais na gravidez?", answer: "Alguns óleos são seguros com as devidas precauções, enquanto outros devem ser evitados nos primeiros trimestres. Lavender, Frankincense e Wild Orange são geralmente bem tolerados. Recomendo fortemente uma consulta personalizada para gestantes." },
  { id: "4", question: "Como fazer para comprar? Precisa ser membro?", answer: "Você pode comprar como cliente a varejo (preço normal) ou se tornar membro Wellness Advocate com 25% de desconto em todas as compras. Não há mensalidade — basta fazer uma compra mínima de pontos por mês ou não fazer nada (sem obrigação!)." },
  { id: "5", question: "Os óleos doTERRA têm aprovação da ANVISA?", answer: "A doTERRA opera em conformidade com a legislação brasileira. Os óleos são comercializados como cosméticos ou suplementos alimentares, dentro das categorias reguladas pela ANVISA." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data: faqItems } = useQuery({
    queryKey: ["faq_public"],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("active", true).order("sort_order");
      return data && data.length > 0 ? data : null;
    },
  });

  const items = faqItems || fallbackFaq;

  return (
    <section id="faq" className="py-[100px] px-[8%] grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-[6rem] items-start" style={{ background: "var(--creme)" }}>
      <div className="reveal">
        <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-text">Tiro suas dúvidas</span></div>
        <h2 className="section-title">Perguntas<br /><em>frequentes</em></h2>
        <p className="section-sub mt-4">Não encontrou sua dúvida? Fale diretamente com a IA ou pelo WhatsApp.</p>
        <a href="#ia" className="btn-primary-custom mt-8 inline-flex" style={{ background: "var(--verde)" }}>Perguntar à IA →</a>
      </div>
      <div className="reveal flex flex-col" style={{ transitionDelay: "0.2s" }}>
        {items.map((item: any, i: number) => {
          const isOpen = openIndex === i;
          const q = item.question || item.q;
          const a = item.answer || item.a;
          return (
            <div key={item.id || i} className="border-b border-[rgba(0,0,0,0.07)]">
              <div className="flex items-center justify-between py-[1.3rem] cursor-pointer gap-4" onClick={() => setOpenIndex(isOpen ? null : i)}>
                <span className={`text-[0.95rem] font-medium leading-[1.5] transition-colors duration-300 ${isOpen ? "text-[var(--verde)]" : "text-[var(--preto)]"}`} style={{ fontFamily: "var(--font-body)" }}>{q}</span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[1rem] transition-all duration-300 ${isOpen ? "bg-[var(--verde)] text-white rotate-45" : "bg-[rgba(29,92,58,0.08)] text-[var(--verde)]"}`}>+</span>
              </div>
              <div className="overflow-hidden transition-all duration-400 text-[0.88rem] leading-[1.8] text-[var(--cinza)]" style={{ fontFamily: "var(--font-body)", maxHeight: isOpen ? "200px" : "0", paddingBottom: isOpen ? "1.2rem" : "0" }}>{a}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
