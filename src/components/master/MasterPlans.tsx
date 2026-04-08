import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

const emptyPlan = (): Omit<Plan, "id"> => ({
  name: "",
  description: "",
  price_monthly: 0,
  price_yearly: null,
  features: [],
  is_active: true,
  sort_order: 0,
});

const MasterPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(emptyPlan());
  const [featuresText, setFeaturesText] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("plans").select("*").order("sort_order");
    setPlans((data as Plan[]) || []);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (p: Plan) => {
    setEditing(p);
    setDraft({ ...p });
    setFeaturesText(p.features.join("\n"));
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setDraft(emptyPlan());
    setFeaturesText("");
  };

  const cancel = () => { setEditing(null); setAdding(false); };

  const save = async () => {
    setLoading(true);
    const features = featuresText.split("\n").map(s => s.trim()).filter(Boolean);
    const payload = { ...draft, features };

    if (adding) {
      const { error } = await supabase.from("plans").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Plano criado!"); cancel(); load(); }
    } else if (editing) {
      const { error } = await supabase.from("plans").update(payload).eq("id", editing.id);
      if (error) toast.error(error.message);
      else { toast.success("Plano atualizado!"); cancel(); load(); }
    }
    setLoading(false);
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Apagar este plano?")) return;
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Plano removido."); load(); }
  };

  const toggleActive = async (p: Plan) => {
    await supabase.from("plans").update({ is_active: !p.is_active }).eq("id", p.id);
    load();
  };

  const Form = () => (
    <div className="p-4 rounded-lg border bg-white space-y-4">
      <h3 className="font-medium text-sm">{adding ? "Novo Plano" : "Editar Plano"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium mb-1 block">Nome do plano</label>
          <Input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Ex: Pro" />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Ordem</label>
          <Input type="number" value={draft.sort_order} onChange={e => setDraft(d => ({ ...d, sort_order: +e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Preço mensal (R$)</label>
          <Input type="number" step="0.01" value={draft.price_monthly} onChange={e => setDraft(d => ({ ...d, price_monthly: +e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Preço anual (R$)</label>
          <Input type="number" step="0.01" value={draft.price_yearly ?? ""} onChange={e => setDraft(d => ({ ...d, price_yearly: e.target.value ? +e.target.value : null }))} placeholder="Opcional" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium mb-1 block">Descrição</label>
          <Input value={draft.description ?? ""} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium mb-1 block">Funcionalidades (uma por linha)</label>
          <Textarea rows={5} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder="Site personalizado&#10;Domínio próprio&#10;..." />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={draft.is_active} onCheckedChange={v => setDraft(d => ({ ...d, is_active: v }))} />
          <span className="text-sm">Plano ativo</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={save} disabled={loading} size="sm">
          <Check className="h-4 w-4 mr-1" /> {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button onClick={cancel} size="sm" variant="outline">
          <X className="h-4 w-4 mr-1" /> Cancelar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
          Planos e Assinaturas
        </h2>
        <Button size="sm" onClick={startAdd}>
          <Plus className="h-4 w-4 mr-1" /> Novo Plano
        </Button>
      </div>

      {adding && <Form />}

      <div className="space-y-3">
        {plans.map(p => (
          <div key={p.id}>
            {editing?.id === p.id ? (
              <Form />
            ) : (
              <div className="p-4 rounded-lg border bg-white flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{p.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    R$ {p.price_monthly.toFixed(2)}/mês
                    {p.price_yearly ? ` · R$ ${p.price_yearly.toFixed(2)}/ano` : ""}
                  </div>
                  {p.features.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {p.features.slice(0, 3).join(" · ")}{p.features.length > 3 ? ` +${p.features.length - 3}` : ""}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} />
                  <Button size="sm" variant="ghost" onClick={() => startEdit(p)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deletePlan(p.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterPlans;
