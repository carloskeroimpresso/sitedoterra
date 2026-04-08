import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Save, CreditCard, DollarSign } from "lucide-react";

interface PlatformSettings {
  id: string;
  stripe_public_key: string | null;
  stripe_secret_key: string | null;
  mp_access_token: string | null;
  mp_public_key: string | null;
  platform_name: string | null;
  support_email: string | null;
}

const MasterIntegrations = () => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showMpToken, setShowMpToken] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("platform_settings").select("*").limit(1).maybeSingle();
    setSettings(data as PlatformSettings | null);
  };

  useEffect(() => { load(); }, []);

  const update = (field: keyof PlatformSettings, value: string) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const save = async () => {
    if (!settings) return;
    setLoading(true);
    const { error } = await supabase
      .from("platform_settings")
      .update({
        stripe_public_key: settings.stripe_public_key,
        stripe_secret_key: settings.stripe_secret_key,
        mp_access_token: settings.mp_access_token,
        mp_public_key: settings.mp_public_key,
        platform_name: settings.platform_name,
        support_email: settings.support_email,
      })
      .eq("id", settings.id);
    if (error) toast.error(error.message);
    else toast.success("Configurações salvas!");
    setLoading(false);
  };

  if (!settings) return <div className="text-center py-12 text-muted-foreground">Carregando...</div>;

  const SecretInput = ({ label, value, onChange, show, setShow, placeholder }: any) => (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
        Integrações da Plataforma
      </h2>

      {/* Geral */}
      <div className="p-4 rounded-lg border bg-white space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Configurações Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Nome da plataforma</label>
            <Input value={settings.platform_name || ""} onChange={(e) => update("platform_name", e.target.value)} placeholder="TopConsultores" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">E-mail de suporte</label>
            <Input type="email" value={settings.support_email || ""} onChange={(e) => update("support_email", e.target.value)} placeholder="suporte@seudominio.com" />
          </div>
        </div>
      </div>

      {/* Stripe */}
      <div className="p-4 rounded-lg border bg-white space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stripe</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Public Key</label>
            <Input
              value={settings.stripe_public_key || ""}
              onChange={(e) => update("stripe_public_key", e.target.value)}
              placeholder="pk_live_..."
            />
          </div>
          <SecretInput
            label="Secret Key"
            value={settings.stripe_secret_key}
            onChange={(v: string) => update("stripe_secret_key", v)}
            show={showStripeSecret}
            setShow={setShowStripeSecret}
            placeholder="sk_live_..."
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Obtenha suas chaves em <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="underline text-indigo-600">dashboard.stripe.com/apikeys</a>
        </p>
      </div>

      {/* Mercado Pago */}
      <div className="p-4 rounded-lg border bg-white space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-sky-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mercado Pago</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Public Key</label>
            <Input
              value={settings.mp_public_key || ""}
              onChange={(e) => update("mp_public_key", e.target.value)}
              placeholder="APP_USR-..."
            />
          </div>
          <SecretInput
            label="Access Token"
            value={settings.mp_access_token}
            onChange={(v: string) => update("mp_access_token", v)}
            show={showMpToken}
            setShow={setShowMpToken}
            placeholder="APP_USR-..."
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Obtenha suas credenciais em <a href="https://www.mercadopago.com.br/developers/panel" target="_blank" rel="noreferrer" className="underline text-sky-600">mercadopago.com.br/developers/panel</a>
        </p>
      </div>

      <Button onClick={save} disabled={loading} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {loading ? "Salvando..." : "Salvar Integrações"}
      </Button>
    </div>
  );
};

export default MasterIntegrations;
