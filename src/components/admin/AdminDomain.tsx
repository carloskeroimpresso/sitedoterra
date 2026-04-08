import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Globe, Copy, ExternalLink, Info } from "lucide-react";

const AdminDomain = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setCustomDomain(profile.custom_domain || "");
    }
  }, [profile]);

  const siteUrl = `${window.location.origin}/${username}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    toast.success("URL copiada!");
  };

  const saveUsername = async () => {
    if (!user) return;
    const clean = username.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!clean) { toast.error("Username inválido."); return; }
    setUsernameLoading(true);
    const { error } = await supabase.from("profiles").update({ username: clean }).eq("id", user.id);
    if (error) toast.error(error.message.includes("unique") ? "Este username já está em uso." : error.message);
    else { toast.success("Username atualizado!"); await refreshProfile(); setUsername(clean); }
    setUsernameLoading(false);
  };

  const saveDomain = async () => {
    if (!user) return;
    setLoading(true);
    const domain = customDomain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    const { error } = await supabase.from("profiles").update({ custom_domain: domain || null }).eq("id", user.id);
    if (error) toast.error(error.message.includes("unique") ? "Este domínio já está vinculado a outro consultor." : error.message);
    else { toast.success("Domínio salvo!"); await refreshProfile(); }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
        Domínio e URL do Site
      </h2>

      {/* URL do Site */}
      <div className="space-y-4 p-4 rounded-lg border bg-white">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">URL do seu site</h3>
        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/30 border">
          <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-mono flex-1 truncate">{siteUrl}</span>
          <Button size="sm" variant="ghost" onClick={copyUrl}><Copy className="h-4 w-4" /></Button>
          <a href={siteUrl} target="_blank" rel="noreferrer">
            <Button size="sm" variant="ghost"><ExternalLink className="h-4 w-4" /></Button>
          </a>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Username (slug da URL)</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">/</span>
              <Input
                className="pl-6"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="sua-url"
              />
            </div>
            <Button onClick={saveUsername} disabled={usernameLoading} size="sm">
              {usernameLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Apenas letras minúsculas, números e hífens. Ex: <code>ana-beatriz</code>
          </p>
        </div>
      </div>

      {/* Domínio Próprio */}
      <div className="space-y-4 p-4 rounded-lg border bg-white">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Domínio Próprio</h3>

        <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 border border-blue-100">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            Para usar seu domínio próprio, configure um registro CNAME no seu painel de DNS apontando para <code className="font-mono">cname.suaplataforma.com</code> e então insira o domínio abaixo.
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Seu domínio</label>
          <Input
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="meusite.com.br"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Digite apenas o domínio, sem http:// ou www. Ex: <code>meusite.com.br</code>
          </p>
        </div>

        <Button onClick={saveDomain} disabled={loading}>
          {loading ? "Salvando..." : "Vincular Domínio"}
        </Button>

        {profile?.custom_domain && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-emerald-50 border border-emerald-100">
            <Globe className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-emerald-700">Domínio vinculado: <strong>{profile.custom_domain}</strong></span>
          </div>
        )}
      </div>

      {/* Subscription info */}
      <div className="space-y-4 p-4 rounded-lg border bg-white">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sua Assinatura</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block">Status</span>
            <span className={`font-medium capitalize ${
              profile?.subscription_status === "active" ? "text-emerald-600" :
              profile?.subscription_status === "expired" ? "text-red-600" :
              "text-yellow-600"
            }`}>
              {profile?.subscription_status === "active" ? "Ativa" :
               profile?.subscription_status === "expired" ? "Expirada" :
               profile?.subscription_status === "cancelled" ? "Cancelada" : "Trial"}
            </span>
          </div>
          {profile?.subscription_expires_at && (
            <div>
              <span className="text-muted-foreground block">Válida até</span>
              <span className="font-medium">{new Date(profile.subscription_expires_at).toLocaleDateString("pt-BR")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDomain;
