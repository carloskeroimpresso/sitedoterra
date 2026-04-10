import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile } from "@/lib/storage";
import { toast } from "sonner";
import { Upload, Trash2, Image, RotateCcw, Plus, X } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero (Topo)",
  vitrine: "Banner Vitrine",
  ia: "Especialista IA",
  depoimentos: "Depoimentos",
  historia: "Minha História",
  video: "Vídeo",
  agendamento: "Agendamento",
  instagram: "Instagram",
  produtos: "Produtos",
  faq: "FAQ",
  planos: "Planos",
};

const DEFAULT_COLORS = {
  primary: "#1D5C3A",
  secondary: "#C4963A",
  accent: "#A8D5B5",
};

interface FooterLink {
  label: string;
  href: string;
  blank: boolean;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("Ana Beatriz");
  const [whatsapp, setWhatsapp] = useState("5511999999999");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [consultantPhotoUrl, setConsultantPhotoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_COLORS.primary);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_COLORS.secondary);
  const [accentColor, setAccentColor] = useState(DEFAULT_COLORS.accent);
  const [sectionsConfig, setSectionsConfig] = useState<Record<string, boolean>>({});
  const [footerText, setFooterText] = useState("");
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const logoRef = useRef<HTMLInputElement>(null);
  const logoDarkRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("site_settings").select("*").eq("user_id", user.id).maybeSingle().then(({ data }: any) => {
      if (data) {
        setSettingsId(data.id);
        setSiteName(data.site_name || "");
        setWhatsapp(data.whatsapp_number || "");
        setLogoUrl(data.logo_url);
        setLogoDarkUrl(data.logo_dark_url);
        setFaviconUrl(data.favicon_url);
        setConsultantPhotoUrl(data.consultant_photo_url);
        setPrimaryColor(data.primary_color || DEFAULT_COLORS.primary);
        setSecondaryColor(data.secondary_color || DEFAULT_COLORS.secondary);
        setAccentColor(data.accent_color || DEFAULT_COLORS.accent);
        setSectionsConfig(data.sections_config || {});
        setFooterText(data.footer_text || "");
        setFooterLinks(data.footer_links || []);
        setInstagramHandle(data.instagram_handle || "");
        setVideoUrl(data.video_url || "");
      }
    });
  }, [user]);

  const handleUpload = async (file: File, type: string) => {
    if (!user) return null;
    const path = `${user.id}/${type}-${Date.now()}.${file.name.split(".").pop()}`;
    const { url, error } = await uploadFile("site-assets", path, file);
    if (error) { toast.error(error); return null; }
    toast.success("Imagem enviada!");
    return url;
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const payload: any = {
      user_id: user.id,
      site_name: siteName,
      whatsapp_number: whatsapp,
      logo_url: logoUrl,
      logo_dark_url: logoDarkUrl,
      favicon_url: faviconUrl,
      consultant_photo_url: consultantPhotoUrl,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      sections_config: sectionsConfig,
      footer_text: footerText,
      footer_links: footerLinks,
      instagram_handle: instagramHandle,
      video_url: videoUrl,
    };

    if (settingsId) {
      const { error } = await supabase.from("site_settings").update(payload).eq("id", settingsId);
      if (error) toast.error(error.message);
      else toast.success("Configurações salvas!");
    } else {
      const { data, error } = await supabase.from("site_settings").insert(payload).select().single();
      if (error) toast.error(error.message);
      else { setSettingsId(data.id); toast.success("Configurações criadas!"); }
    }
    queryClient.invalidateQueries({ queryKey: ["site_settings_by_user", user.id] });
    queryClient.invalidateQueries({ queryKey: ["site_settings_by_username"] });
    setLoading(false);
  };

  const toggleSection = (key: string) => {
    setSectionsConfig(prev => ({ ...prev, [key]: prev[key] === false ? true : false }));
  };

  const addFooterLink = () => setFooterLinks([...footerLinks, { label: "", href: "", blank: false }]);
  const removeFooterLink = (i: number) => setFooterLinks(footerLinks.filter((_, idx) => idx !== i));
  const updateFooterLink = (i: number, field: keyof FooterLink, value: any) => {
    const updated = [...footerLinks];
    (updated[i] as any)[field] = value;
    setFooterLinks(updated);
  };

  const ImageUploadBlock = ({ label, url, setUrl, inputRef, type, size = "h-16 w-32" }: any) => (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <div className="flex items-center gap-4">
        <div className={`${size} rounded-md border flex items-center justify-center bg-muted/30 overflow-hidden`}>
          {url ? <img src={url} alt={label} className="h-full w-full object-contain" /> : <Image className="h-6 w-6 text-muted-foreground" />}
        </div>
        <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-1" /> Upload
        </Button>
        {url && <Button size="sm" variant="ghost" onClick={() => setUrl(null)}><Trash2 className="h-4 w-4" /></Button>}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const uploadedUrl = await handleUpload(file, type);
          if (uploadedUrl) setUrl(uploadedUrl);
          e.target.value = "";
        }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>Configurações do Site</h2>

      {/* Basic Info */}
      <div className="space-y-4 p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Nome do site</label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">WhatsApp (com DDI)</label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="5511999999999" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Instagram</label>
            <Input value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} placeholder="@seuperfil" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Link do vídeo (YouTube/Vimeo)</label>
            <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4 p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cores do Site</h3>
          <Button size="sm" variant="ghost" onClick={() => { setPrimaryColor(DEFAULT_COLORS.primary); setSecondaryColor(DEFAULT_COLORS.secondary); setAccentColor(DEFAULT_COLORS.accent); }}>
            <RotateCcw className="h-3 w-3 mr-1" /> Restaurar padrão
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Cor primária", value: primaryColor, set: setPrimaryColor },
            { label: "Cor secundária", value: secondaryColor, set: setSecondaryColor },
            { label: "Cor destaque", value: accentColor, set: setAccentColor },
          ].map((c) => (
            <div key={c.label}>
              <label className="text-sm font-medium mb-1 block">{c.label}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={c.value} onChange={(e) => c.set(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                <Input value={c.value} onChange={(e) => c.set(e.target.value)} className="flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4 p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Imagens</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadBlock label="Logo (fundo claro)" url={logoUrl} setUrl={setLogoUrl} inputRef={logoRef} type="logo" />
          <ImageUploadBlock label="Logo (fundo escuro)" url={logoDarkUrl} setUrl={setLogoDarkUrl} inputRef={logoDarkRef} type="logo-dark" />
          <ImageUploadBlock label="Favicon" url={faviconUrl} setUrl={setFaviconUrl} inputRef={faviconRef} type="favicon" size="h-12 w-12" />
          <ImageUploadBlock label="Foto da consultora (Hero)" url={consultantPhotoUrl} setUrl={setConsultantPhotoUrl} inputRef={photoRef} type="photo" size="h-20 w-20" />
        </div>
      </div>

      {/* Sections Toggle */}
      <div className="space-y-4 p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seções do Site</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SECTION_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-2 rounded border">
              <span className="text-sm">{label}</span>
              <Switch checked={sectionsConfig[key] !== false} onCheckedChange={() => toggleSection(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4 p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Rodapé</h3>
        <div>
          <label className="text-sm font-medium mb-1 block">Texto do rodapé</label>
          <Textarea value={footerText} onChange={(e) => setFooterText(e.target.value)} placeholder="© 2026 Nome | Feito com ♥ pela TopConsultores" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Links do rodapé</label>
            <Button size="sm" variant="outline" onClick={addFooterLink}><Plus className="h-3 w-3 mr-1" /> Adicionar</Button>
          </div>
          {footerLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <Input placeholder="Rótulo" value={link.label} onChange={(e) => updateFooterLink(i, "label", e.target.value)} className="w-28" />
              <Input placeholder="URL" value={link.href} onChange={(e) => updateFooterLink(i, "href", e.target.value)} className="flex-1" />
              <div className="flex items-center gap-1">
                <Switch checked={link.blank} onCheckedChange={(v) => updateFooterLink(i, "blank", v)} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">Nova aba</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => removeFooterLink(i)}><X className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading} className="w-full">
        {loading ? "Salvando..." : "Salvar todas as configurações"}
      </Button>
    </div>
  );
};

export default AdminSettings;
