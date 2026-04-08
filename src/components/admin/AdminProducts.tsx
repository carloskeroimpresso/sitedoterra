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
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, Image } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  promo_price: string;
  category: string;
  image_url: string | null;
  external_link: string;
  has_price: boolean;
  sort_order: number;
}

const AdminProducts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase.from("products").select("*").eq("user_id", user.id).order("sort_order");
    if (data) setProducts(data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      price: p.price || "R$ 0,00",
      promo_price: p.promo_price || "",
      category: p.category || "",
      image_url: p.image_url,
      external_link: p.external_link || "",
      has_price: p.has_price !== false,
      sort_order: p.sort_order,
    })));
  };

  useEffect(() => { fetchProducts(); }, [user]);

  const handleSave = async () => {
    if (!editing || !user) return;
    setLoading(true);
    const payload: any = {
      user_id: user.id,
      name: editing.name,
      description: editing.description,
      price: editing.price,
      promo_price: editing.promo_price || null,
      category: editing.category,
      image_url: editing.image_url,
      external_link: editing.external_link || null,
      has_price: editing.has_price,
      sort_order: editing.sort_order,
    };

    if (editing.id.startsWith("new-")) {
      const { error } = await supabase.from("products").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("Produto criado!");
    } else {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) toast.error(error.message);
      else toast.success("Produto atualizado!");
    }
    setEditing(null);
    setLoading(false);
    fetchProducts();
    queryClient.invalidateQueries({ queryKey: ["products_public"] });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast.success("Produto removido!");
    fetchProducts();
    queryClient.invalidateQueries({ queryKey: ["products_public"] });
  };

  const handleImageUpload = async (file: File) => {
    if (!user || !editing) return;
    const path = `${user.id}/product-${Date.now()}.${file.name.split(".").pop()}`;
    const { url, error } = await uploadFile("site-assets", path, file);
    if (error) { toast.error(error); return; }
    setEditing({ ...editing, image_url: url });
    toast.success("Imagem enviada!");
  };

  const moveProduct = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= products.length) return;
    const a = products[index];
    const b = products[swapIndex];
    await Promise.all([
      supabase.from("products").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("products").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchProducts();
  };

  const addNew = () => {
    setEditing({
      id: `new-${Date.now()}`,
      name: "",
      description: "",
      price: "R$ 0,00",
      promo_price: "",
      category: "",
      image_url: null,
      external_link: "",
      has_price: true,
      sort_order: products.length,
    });
  };

  const discount = editing?.has_price && editing?.promo_price && editing?.price
    ? (() => {
        const p = parseFloat(editing.price.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
        const pp = parseFloat(editing.promo_price.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
        return p > 0 && pp > 0 && pp < p ? Math.round((1 - pp / p) * 100) : 0;
      })()
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>Produtos</h2>
        <Button size="sm" onClick={addNew}><Plus className="h-4 w-4 mr-1" /> Novo</Button>
      </div>

      {editing && (
        <div className="space-y-3 p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
          <Input placeholder="Título" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <Textarea placeholder="Descrição" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <Input placeholder="Categoria" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />

          <div className="flex items-center gap-2 py-1">
            <Switch checked={editing.has_price} onCheckedChange={(v) => setEditing({ ...editing, has_price: v })} />
            <span className="text-sm">Exibir preço</span>
          </div>

          {editing.has_price && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1">Preço</label>
                <Input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Preço promocional {discount > 0 && <span className="text-red-500">(-{discount}%)</span>}</label>
                <Input value={editing.promo_price} onChange={(e) => setEditing({ ...editing, promo_price: e.target.value })} placeholder="Opcional" />
              </div>
            </div>
          )}

          <Input placeholder="Link externo (opcional)" value={editing.external_link} onChange={(e) => setEditing({ ...editing, external_link: e.target.value })} />

          {/* Image upload */}
          <div>
            <label className="text-sm font-medium mb-2 block">Imagem do produto</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-muted/30 overflow-hidden">
                {editing.image_url ? <img src={editing.image_url} alt="" className="h-full w-full object-cover" /> : <Image className="h-6 w-6 text-muted-foreground" />}
              </div>
              <Button size="sm" variant="outline" onClick={() => imageRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Upload
              </Button>
              {editing.image_url && <Button size="sm" variant="ghost" onClick={() => setEditing({ ...editing, image_url: null })}><Trash2 className="h-4 w-4" /></Button>}
              <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); e.target.value = ""; }} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {products.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ background: "var(--branco)" }}>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveProduct(idx, "up")} disabled={idx === 0} className="p-0.5 rounded hover:bg-muted disabled:opacity-20"><ChevronUp className="h-3 w-3" /></button>
              <button onClick={() => moveProduct(idx, "down")} disabled={idx === products.length - 1} className="p-0.5 rounded hover:bg-muted disabled:opacity-20"><ChevronDown className="h-3 w-3" /></button>
            </div>
            {p.image_url ? <img src={p.image_url} alt="" className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-muted/30 flex items-center justify-center"><Image className="h-4 w-4 text-muted-foreground" /></div>}
            <div className="flex-1">
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.has_price ? p.price : "Sem preço"} · {p.category}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>Editar</Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {products.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum produto cadastrado</p>}
      </div>
    </div>
  );
};

export default AdminProducts;
