import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

interface ExtraContact {
  name: string;
  value: string;
  type: string;
}

const AdminProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNum, setWhatsappNum] = useState("");
  const [bio, setBio] = useState("");
  const [roleText, setRoleText] = useState("");
  const [extraContacts, setExtraContacts] = useState<ExtraContact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }: any) => {
      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setWhatsappNum(data.whatsapp || "");
        setBio(data.bio || "");
        setRoleText(data.role_text || "");
        setExtraContacts(data.extra_contacts || []);
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const payload: any = {
      full_name: fullName,
      phone,
      whatsapp: whatsappNum,
      bio,
      role_text: roleText,
      extra_contacts: extraContacts,
    };
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Perfil atualizado!");
      queryClient.invalidateQueries({ queryKey: ["consultant_profile_public"] });
    }
    setLoading(false);
  };

  const addContact = () => setExtraContacts([...extraContacts, { name: "", value: "", type: "phone" }]);
  const removeContact = (i: number) => setExtraContacts(extraContacts.filter((_, idx) => idx !== i));
  const updateContact = (i: number, field: keyof ExtraContact, val: string) => {
    const updated = [...extraContacts];
    updated[i][field] = val;
    setExtraContacts(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>Meu Perfil</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Nome completo</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Telefone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">WhatsApp (com DDI, reflete nos botões do site)</label>
          <Input value={whatsappNum} onChange={(e) => setWhatsappNum(e.target.value)} placeholder="5511999999999" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Cargo / Título</label>
          <Input value={roleText} onChange={(e) => setRoleText(e.target.value)} placeholder="Consultora doTERRA" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Bio</label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Fale um pouco sobre você..." />
        </div>

        {/* Extra contacts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Contatos extras (exibidos no rodapé)</label>
            <Button size="sm" variant="outline" onClick={addContact}><Plus className="h-3 w-3 mr-1" /> Adicionar</Button>
          </div>
          {extraContacts.map((c, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <Input placeholder="Rótulo (ex: E-mail)" value={c.name} onChange={(e) => updateContact(i, "name", e.target.value)} className="w-28" />
              <Input placeholder="Valor" value={c.value} onChange={(e) => updateContact(i, "value", e.target.value)} className="flex-1" />
              <Button size="sm" variant="ghost" onClick={() => removeContact(i)}><X className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar perfil"}
        </Button>
      </div>
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">E-mail: {user?.email}</p>
      </div>
    </div>
  );
};

export default AdminProfile;
