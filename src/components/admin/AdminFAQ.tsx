import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

const AdminFAQ = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<FAQItem[]>([]);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("faq_items").select("*").eq("user_id", user.id).order("sort_order");
    if (data) setItems(data as FAQItem[]);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const handleSave = async () => {
    if (!editing || !user) return;
    setLoading(true);
    const payload = { ...editing, user_id: user.id };
    delete (payload as any).id;
    if (editing.id.startsWith("new-")) {
      await supabase.from("faq_items").insert(payload);
    } else {
      await supabase.from("faq_items").update(payload).eq("id", editing.id);
    }
    toast.success("Salvo!");
    setEditing(null);
    setLoading(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("faq_items").delete().eq("id", id);
    toast.success("Removido!");
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>Perguntas Frequentes</h2>
        <Button size="sm" onClick={() => setEditing({ id: `new-${Date.now()}`, question: "", answer: "", sort_order: items.length })}><Plus className="h-4 w-4 mr-1" /> Nova</Button>
      </div>

      {editing && (
        <div className="space-y-3 p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
          <Input placeholder="Pergunta" value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} />
          <Textarea placeholder="Resposta" value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} />
          <Input placeholder="Ordem" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ background: "var(--branco)" }}>
            <div className="flex-1">
              <div className="text-sm font-medium">{item.question}</div>
              <div className="text-xs text-muted-foreground truncate max-w-md">{item.answer}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setEditing(item)}>Editar</Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhuma pergunta</p>}
      </div>
    </div>
  );
};

export default AdminFAQ;
