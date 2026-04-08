import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings, profile } = useSiteSettings();
  const siteName = profile.full_name || settings.site_name || "Ana Beatriz";
  const whatsapp = profile.whatsapp || settings.whatsapp_number || "5511999999999";
  const footerText = settings.footer_text || `© 2026 ${siteName} | Feito com ♥ pela TopConsultores`;
  const extraContacts = profile.extra_contacts || [];

  return (
    <footer className="px-[8%] pt-[60px] pb-[30px]" style={{ background: "var(--preto)" }}>
      <div className="flex justify-between items-start mb-12 flex-wrap gap-8 border-b border-[rgba(255,255,255,0.07)] pb-12">
        <div>
          <span className="block text-[1.5rem] text-[var(--branco)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{siteName}</span>
          <p className="text-[0.82rem] text-[rgba(255,255,255,0.35)] max-w-[220px] leading-[1.7]" style={{ fontFamily: "var(--font-body)" }}>
            {profile.bio || "Consultora doTERRA ajudando famílias a descobrirem o poder dos óleos essenciais puros."}
          </p>
          {extraContacts.length > 0 && (
            <div className="mt-4 space-y-1">
              {extraContacts.map((c: any, i: number) => (
                <div key={i} className="text-[0.75rem] text-[rgba(255,255,255,0.4)]" style={{ fontFamily: "var(--font-body)" }}>
                  {c.name}: {c.value}
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3 mt-6">
            {[
              { title: "WhatsApp", href: `https://wa.me/${whatsapp}`, path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z M12 0C5.373 0 0 5.373 0 12c0 2.133.558 4.135 1.535 5.875L0 24l6.29-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.847 0-3.575-.5-5.065-1.373l-.363-.214-3.737.892.936-3.635-.236-.374A9.957 9.957 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" },
              { title: "Instagram", href: settings.instagram_handle ? `https://instagram.com/${settings.instagram_handle.replace("@", "")}` : "#", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" },
            ].map((s) => (
              <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title} className="w-[38px] h-[38px] rounded-full bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(255,255,255,0.5)] no-underline transition-all hover:bg-[var(--verde)] hover:border-[var(--verde)] hover:text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[0.72rem] font-medium tracking-[0.15em] uppercase text-[rgba(255,255,255,0.35)] mb-4" style={{ fontFamily: "var(--font-body)" }}>Navegação</h4>
          <ul className="list-none flex flex-col gap-[0.6rem]">
            {[
              { label: "Especialista IA", href: "#ia" },
              { label: "Depoimentos", href: "#depoimentos" },
              { label: "Minha história", href: "#historia" },
              { label: "Agendamento", href: "#agendamento" },
              { label: "Produtos", href: "#produtos" },
              { label: "Dúvidas", href: "#faq" },
            ].map((l) => (
              <li key={l.label}><a href={l.href} className="text-[0.85rem] text-[rgba(255,255,255,0.5)] no-underline transition-colors hover:text-[var(--verde-menta)]" style={{ fontFamily: "var(--font-body)" }}>{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[0.72rem] font-medium tracking-[0.15em] uppercase text-[rgba(255,255,255,0.35)] mb-4" style={{ fontFamily: "var(--font-body)" }}>Contato</h4>
          <ul className="list-none flex flex-col gap-[0.6rem]">
            <li><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-[rgba(255,255,255,0.5)] no-underline transition-colors hover:text-[var(--verde-menta)]" style={{ fontFamily: "var(--font-body)" }}>WhatsApp</a></li>
            {settings.instagram_handle && (
              <li><a href={`https://instagram.com/${settings.instagram_handle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-[rgba(255,255,255,0.5)] no-underline transition-colors hover:text-[var(--verde-menta)]" style={{ fontFamily: "var(--font-body)" }}>{settings.instagram_handle}</a></li>
            )}
          </ul>
        </div>
        {settings.footer_links.length > 0 && (
          <div>
            <h4 className="text-[0.72rem] font-medium tracking-[0.15em] uppercase text-[rgba(255,255,255,0.35)] mb-4" style={{ fontFamily: "var(--font-body)" }}>Links</h4>
            <ul className="list-none flex flex-col gap-[0.6rem]">
              {settings.footer_links.map((l: any, i: number) => (
                <li key={i}><a href={l.href} target={l.blank ? "_blank" : undefined} rel={l.blank ? "noopener noreferrer" : undefined} className="text-[0.85rem] text-[rgba(255,255,255,0.5)] no-underline transition-colors hover:text-[var(--verde-menta)]" style={{ fontFamily: "var(--font-body)" }}>{l.label}</a></li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-[0.78rem] text-[rgba(255,255,255,0.25)]" style={{ fontFamily: "var(--font-body)" }} dangerouslySetInnerHTML={{ __html: footerText.replace("TopConsultores", '<a href="#" class="text-[var(--verde-menta)] no-underline hover:text-[var(--verde-claro)]">TopConsultores</a>') }} />
        <p className="text-[0.78rem] text-[rgba(255,255,255,0.25)]" style={{ fontFamily: "var(--font-body)" }}>Consultora Independente doTERRA — as opiniões expressas são pessoais e não representam a doTERRA International.</p>
      </div>
    </footer>
  );
};

export default Footer;
