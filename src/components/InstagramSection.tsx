const instaItems = [
  { emoji: "🌿", bg: "linear-gradient(135deg, #d4e8d4 0%, #a8d5b5 100%)" },
  { emoji: "🍋", bg: "linear-gradient(135deg, #f5e6d0 0%, #e8c87a 100%)" },
  { emoji: "🌸", bg: "linear-gradient(135deg, #c8e6d4 0%, #1D5C3A 100%)" },
  { emoji: "🧴", bg: "linear-gradient(135deg, #fbe8d0 0%, #C4963A 100%)" },
  { emoji: "🌱", bg: "linear-gradient(135deg, #e0f2e8 0%, #4A9E6B 100%)" },
];

const InstagramSection = () => {
  return (
    <section id="instagram" className="py-[100px] px-[8%]" style={{ background: "var(--creme)" }}>
      <div className="flex items-end justify-between mb-12 flex-wrap gap-8">
        <div className="reveal">
          <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-text">Acompanhe no Instagram</span></div>
          <h2 className="section-title">Dicas, rotinas e<br /><em>momentos reais</em></h2>
        </div>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="reveal text-[0.82rem] font-medium text-[var(--verde)] no-underline border-b border-[var(--verde)] pb-[2px] transition-colors hover:text-[var(--verde-claro)] hover:border-[var(--verde-claro)]" style={{ fontFamily: "var(--font-body)" }}>@anabeatriz.doterra ↗</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {instaItems.map((item, i) => (
          <div key={i} className={`reveal aspect-square rounded-[10px] overflow-hidden relative cursor-pointer group ${i >= 3 ? "hidden lg:block" : ""}`} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="w-full h-full flex items-center justify-center text-[2.5rem] transition-transform duration-400 group-hover:scale-[1.06]" style={{ background: item.bg }}>{item.emoji}</div>
            <div className="absolute inset-0 bg-[rgba(29,92,58,0.6)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg viewBox="0 0 24 24" className="w-7 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" /></svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;
