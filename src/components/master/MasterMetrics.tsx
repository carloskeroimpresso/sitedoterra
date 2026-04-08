import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, UserX, CreditCard, TrendingUp, Globe } from "lucide-react";

interface Metrics {
  total: number;
  active: number;
  suspended: number;
  trial: number;
  paying: number;
  expired: number;
  withDomain: number;
}

const MasterMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, active: 0, suspended: 0, trial: 0, paying: 0, expired: 0, withDomain: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("profiles").select("status, subscription_status, custom_domain").eq("role", "consultant");
      if (data) {
        setMetrics({
          total: data.length,
          active: data.filter(d => d.status === "active").length,
          suspended: data.filter(d => d.status === "suspended").length,
          trial: data.filter(d => d.subscription_status === "trial" || !d.subscription_status).length,
          paying: data.filter(d => d.subscription_status === "active").length,
          expired: data.filter(d => d.subscription_status === "expired").length,
          withDomain: data.filter(d => d.custom_domain).length,
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: "Total de Consultores", value: metrics.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Consultores Ativos", value: metrics.active, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Suspensos", value: metrics.suspended, icon: UserX, color: "text-red-500", bg: "bg-red-50" },
    { label: "Em Trial", value: metrics.trial, icon: TrendingUp, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Assinatura Ativa", value: metrics.paying, icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Domínio Próprio", value: metrics.withDomain, icon: Globe, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
        Métricas da Plataforma
      </h2>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando métricas...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="p-4 rounded-lg border bg-white">
              <div className={`inline-flex p-2 rounded-lg ${c.bg} mb-3`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--verde)" }}>{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-lg border bg-white">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Visão Geral</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxa de conversão (trial → pago)</span>
            <span className="font-medium">
              {metrics.total > 0 ? ((metrics.paying / metrics.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxa de suspensão</span>
            <span className="font-medium">
              {metrics.total > 0 ? ((metrics.suspended / metrics.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Consultores com domínio próprio</span>
            <span className="font-medium">
              {metrics.total > 0 ? ((metrics.withDomain / metrics.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterMetrics;
