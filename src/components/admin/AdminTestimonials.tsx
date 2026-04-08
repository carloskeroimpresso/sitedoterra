import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { uploadFile } from "@/lib/storage";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Image } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  location: string;
  initials: string;
  company: string;
  role_title: string;
  photo_url: string | null;
  featured: boolean;
  sort_order: number;
}

const AdminTestimonials = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase.from("testimonials").select("*").eq("user_id", user.id).order("sort_order");
    if (data) setItems(data.map((t: any) => ({
      ...t,
      company: t.company || "",
      role_title: t.role_title || "",
      location: t.location || "",
      initials: t.initials || "",
    })));
  };

  useEffect(() => { fetch(); }, [user]);

  const handlePhotoUpload = async (file: File) => {
    if (!user || !editing) return;
    const path = `${user.id}/testimonial-${Date.now()}.${file.name.split(".").pop()}`;
    const { url, error } = await uploadFile("site-assets", path, file);
    if (error) { toast.error(error); return; }
    setEditing({ ...editing, photo_url: url });
    toast.success("Foto enviada!");
  };

  const handleSave = async () => {
    if (!editing || !user) return;
    setLoading(true);
    const payload: any = {
      user_id: user.id,
      name: editing.name,
      text: editing.text,
      location: editing.location,
      initials: editing.initials,
      company: editing.company || null,
      role_title: editing.role_title || null,
      photo_url: editing.photo_url,
      featured: editing.featured,
      sort_order: editing.sort_order,
    };

    if (editing.id.startsWith("new-")) {
      await supabase.from("testimonials").insert(payload);
    } else {
      await supabase.from("testimonials").update(payload).eq("id", editing.id);
    }
    toast.success("Salvo!");
    setEditing(null);
    setLoading(false);
    fetch();
    queryClient.invalidateQueries({ queryKey: ["testimonials_public"] });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    toast.success("Removido!");
    fetch();
    queryClient.invalidateQueries({ queryKey: ["testimonials_public"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>Depoimentos</h2>
        <Button size="sm" onClick={() => setEditing({ id: `new-${Date.now()}`, name: "", text: "", location: "", initials: "", company: "", role_title: "", photo_url: null, featured: false, sort_order: items.length })}>
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
      </div>

      {editing && (
        <div className="space-y-3 p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Nome" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <Input placeholder="Iniciais (ex: MF)" value={editing.initials} onChange={(e) => setEditing({ ...editing, initials: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Empresa" value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
            <Input placeholder="Cargo" value={editing.role_title} onChange={(e) => setEditing({ ...editing, role_title: e.target.value })} />
          </div>
          <Input placeholder="Localização" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
          <Textarea placeholder="Depoimento" value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} />

          {/* Photo */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full border flex items-center justify-center bg-muted/30 overflow-hidden">
              {editing.photo_url ? <img src={editing.photo_url} alt="" className="h-full w-full object-cover" /> : <Image className="h-5 w-5 text-muted-foreground" />}
            </div>
            <Button size="sm" variant="outline" onClick={() => photoRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1" /> Foto
            </Button>
            {editing.photo_url && <Button size="sm" variant="ghost" onClick={() => setEditing({ ...editing, photo_url: null })}><Trash2 className="h-4 w-4" /></Button>}
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]); e.target.value = ""; }} />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />
            <span className="text-sm">Destaque</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ background: "var(--branco)" }}>
            {t.photo_url ? <img src={t.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : null}
            <div className="flex-1">
              <div className="text-sm font-medium">{t.name} {t.featured && <span className="text-xs text-primary">★ Destaque</span>}</div>
              <div className="text-xs text-muted-foreground">{[t.role_title, t.company, t.location].filter(Boolean).join(" · ")}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setEditing(t)}>Editar</Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum depoimento</p>}
      </div>
    </div>
  );
};

export default AdminTestimonials;
