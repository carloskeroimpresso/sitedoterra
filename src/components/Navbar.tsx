import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const navLinks = [
  { label: "Especialista IA", href: "#ia" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "História", href: "#historia" },
  { label: "Agendar", href: "#agendamento" },
  { label: "Produtos", href: "#produtos" },
  { label: "Dúvidas", href: "#faq" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { settings } = useSiteSettings();

  const logoUrl = scrolled ? (settings.logo_url || null) : (settings.logo_dark_url || settings.logo_url || null);
  const siteName = settings.site_name || "Ana Beatriz";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-[70px] px-8 transition-all duration-400"
      style={{
        background: scrolled ? "rgba(247, 242, 234, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(196, 150, 58, 0.15)" : "none",
      }}
    >
      <a href="#hero" className="no-underline">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 max-w-[160px] object-contain" />
        ) : (
          <span
            className="text-[1.3rem] font-medium tracking-[0.05em] transition-colors duration-300"
            style={{ fontFamily: "var(--font-heading)", color: scrolled ? "var(--verde)" : "var(--branco)" }}
          >
            {siteName}
          </span>
        )}
      </a>

      <ul className="hidden lg:flex gap-8 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="relative text-[0.78rem] font-normal tracking-[0.12em] uppercase no-underline transition-colors duration-300 group"
              style={{ fontFamily: "var(--font-body)", color: scrolled ? "var(--cinza)" : "rgba(255,255,255,0.8)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = scrolled ? "var(--verde)" : "rgba(255,255,255,1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = scrolled ? "var(--cinza)" : "rgba(255,255,255,0.8)"; }}
            >
              {link.label}
              <span className="absolute bottom-[-3px] left-0 right-0 h-px bg-[var(--ouro)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden lg:block">
        <a
          href={user ? "/admin" : "/login"}
          className="text-[0.72rem] font-medium tracking-[0.1em] uppercase border rounded-[2px] px-[1.1rem] py-[0.45rem] no-underline transition-all duration-300"
          style={{ fontFamily: "var(--font-body)", color: "var(--ouro)", borderColor: "rgba(196, 150, 58, 0.5)", background: "rgba(196, 150, 58, 0.05)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ouro)"; e.currentTarget.style.color = "var(--branco)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(196, 150, 58, 0.05)"; e.currentTarget.style.color = "var(--ouro)"; }}
        >
          {user ? "Painel ↗" : "Admin ↗"}
        </a>
      </div>

      <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1" aria-label="Menu">
        {mobileOpen ? (
          <X size={22} style={{ color: scrolled ? "var(--verde)" : "white" }} />
        ) : (
          <>
            <span className="block w-[22px] h-[1.5px] transition-all" style={{ background: scrolled ? "var(--verde)" : "white" }} />
            <span className="block w-[22px] h-[1.5px] transition-all" style={{ background: scrolled ? "var(--verde)" : "white" }} />
            <span className="block w-[22px] h-[1.5px] transition-all" style={{ background: scrolled ? "var(--verde)" : "white" }} />
          </>
        )}
      </button>

      {mobileOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-[var(--creme)] border-b border-[rgba(196,150,58,0.15)] p-6 lg:hidden animate-fade-in">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-normal tracking-[0.1em] uppercase no-underline transition-colors" style={{ fontFamily: "var(--font-body)", color: "var(--cinza)" }}>
              {link.label}
            </a>
          ))}
          <div className="mt-3">
            <a href={user ? "/admin" : "/login"} className="text-[0.72rem] font-medium tracking-[0.1em] uppercase border rounded-[2px] px-[1.1rem] py-[0.45rem] no-underline inline-block" style={{ fontFamily: "var(--font-body)", color: "var(--ouro)", borderColor: "rgba(196, 150, 58, 0.5)", background: "rgba(196, 150, 58, 0.05)" }}>
              {user ? "Painel ↗" : "Admin ↗"}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
