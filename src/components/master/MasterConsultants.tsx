import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, UserCheck, UserX, Trash2, ExternalLink, RefreshCw } from "lucide-react";

interface Consultant {
  id: string;
  full_name: string | null;
  email: string | null;
  username: string | null;
  status: string;
  role: string;
  subscription_status: string | null;
  subscription_expires_at: string | null;
  custom_domain: string | null;
  created_at: string;
  plan_id: string | null;
}

const statusColor: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  suspended: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const subColor: Record<string, string> = {
  trial: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  expired: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
};

const MasterConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filtered, setFiltered] = useState<Consultant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "consultant")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else {
      setConsultants((data as Consultant[]) || []);
      setFiltered((data as Consultant[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(consultants.filter(c =>
      (c.full_name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.username || "").toLowerCase().includes(q)
    ));
  }, [search, consultants]);

  const toggleStatus = async (c: Consultant) => {
    const newStatus = c.status === "active" ? "suspended" : "active";
    const { error } = await supabase.from("profiles").update({ status: newStatus }).eq("id", c.id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Consultor ${newStatus === "active" ? "ativado" : "suspenso"}!`);
      load();
    }
  };

  const deleteConsultant = async (id: string) => {
    if (!confirm("Tem certeza? Esta ação é irreversível e apagará todos os dados do consultor.")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Consultor removido."); load(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
          Consultores Cadastrados
        </h2>
        <Button size="sm" variant="outline" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-1" /> Atualizar
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nome, e-mail ou username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhum consultor encontrado.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="p-4 rounded-lg border bg-white flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{c.full_name || "Sem nome"}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status] || "bg-gray-100"}`}>
                    {c.status}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${subColor[c.subscription_status || "trial"] || "bg-gray-100"}`}>
                    {c.subscription_status || "trial"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                  <span>{c.email}</span>
                  {c.username && (
                    <span className="font-mono">/{c.username}</span>
                  )}
                  {c.custom_domain && (
                    <span className="text-blue-600">{c.custom_domain}</span>
                  )}
                  <span>Desde {new Date(c.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {c.username && (
                  <a href={`/${c.username}`} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleStatus(c)}
                  className={c.status === "active" ? "text-red-600 border-red-200 hover:bg-red-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}
                >
                  {c.status === "active" ? <UserX className="h-4 w-4 mr-1" /> : <UserCheck className="h-4 w-4 mr-1" />}
                  {c.status === "active" ? "Suspender" : "Ativar"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteConsultant(c.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {filtered.length} consultor(es) encontrado(s) de {consultants.length} total
      </div>
    </div>
  );
};

export default MasterConsultants;
