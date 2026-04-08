import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const DEFAULT_TIMES = ["09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

const AdminSchedule = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [slots, setSlots] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Availability pattern
  const [availDays, setAvailDays] = useState<boolean[]>([false, true, true, true, true, true, false]);
  const [availTimes, setAvailTimes] = useState<string[]>(DEFAULT_TIMES);
  const [newAvailTime, setNewAvailTime] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const [slotsRes, apptRes] = await Promise.all([
      supabase.from("schedule_slots").select("*").eq("user_id", user.id).order("slot_date").order("slot_time"),
      supabase.from("appointments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (slotsRes.data) setSlots(slotsRes.data);
    if (apptRes.data) setAppointments(apptRes.data);
  };

  useEffect(() => { fetchData(); }, [user]);

  const addSlot = async () => {
    if (!user || !newDate || !newTime) return;
    const { error } = await supabase.from("schedule_slots").insert({ user_id: user.id, slot_date: newDate, slot_time: newTime, status: "available" });
    if (error) toast.error(error.message);
    else { toast.success("Horário adicionado!"); setNewDate(""); setNewTime(""); fetchData(); }
  };

  const deleteSlot = async (id: string) => {
    await supabase.from("schedule_slots").delete().eq("id", id);
    toast.success("Removido!");
    fetchData();
  };

  const generateSlots = async () => {
    if (!user) return;
    setGenerating(true);
    const today = new Date();
    const slotsToInsert: any[] = [];

    for (let i = 0; i < 30; i++) {
      const day = addDays(today, i);
      const dayOfWeek = day.getDay();
      if (!availDays[dayOfWeek]) continue;

      const dateStr = format(day, "yyyy-MM-dd");
      for (const time of availTimes) {
        slotsToInsert.push({ user_id: user.id, slot_date: dateStr, slot_time: time, status: "available" });
      }
    }

    if (slotsToInsert.length === 0) {
      toast.error("Nenhum horário para gerar");
      setGenerating(false);
      return;
    }

    const { error } = await supabase.from("schedule_slots").insert(slotsToInsert);
    if (error) toast.error(error.message);
    else toast.success(`${slotsToInsert.length} horários gerados para os próximos 30 dias!`);
    setGenerating(false);
    fetchData();
    queryClient.invalidateQueries({ queryKey: ["schedule_slots_public"] });
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status } as any).eq("id", id);
    toast.success("Status atualizado!");
    fetchData();
  };

  return (
    <div className="space-y-8">
      {/* Availability Pattern */}
      <div className="p-4 rounded-lg border" style={{ background: "var(--branco)" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Disponibilidade Padrão</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {WEEKDAYS.map((day, i) => (
            <div key={day} className="text-center">
              <div className="text-[0.65rem] font-medium text-muted-foreground mb-1">{day.slice(0, 3)}</div>
              <Switch checked={availDays[i]} onCheckedChange={(v) => { const d = [...availDays]; d[i] = v; setAvailDays(d); }} />
            </div>
          ))}
        </div>
        <div className="mb-3">
          <label className="text-xs font-medium block mb-1">Horários</label>
          <div className="flex flex-wrap gap-1">
            {availTimes.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                {t}
                <button onClick={() => setAvailTimes(availTimes.filter(x => x !== t))} className="text-muted-foreground hover:text-foreground">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input type="time" value={newAvailTime} onChange={(e) => setNewAvailTime(e.target.value)} className="w-32" />
            <Button size="sm" variant="outline" onClick={() => { if (newAvailTime && !availTimes.includes(newAvailTime)) { setAvailTimes([...availTimes, newAvailTime].sort()); setNewAvailTime(""); } }}>
              <Plus className="h-3 w-3 mr-1" /> Adicionar
            </Button>
          </div>
        </div>
        <Button onClick={generateSlots} disabled={generating}>
          {generating ? "Gerando..." : "Gerar horários (próx. 30 dias)"}
        </Button>
      </div>

      {/* Manual Slot */}
      <div>
        <h2 className="text-xl font-medium mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>Adicionar Horário Avulso</h2>
        <div className="flex gap-3 items-end mb-4">
          <div><label className="text-xs font-medium block mb-1">Data</label><Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} /></div>
          <div><label className="text-xs font-medium block mb-1">Horário</label><Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} /></div>
          <Button onClick={addSlot}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
        </div>

        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          {slots.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-2 rounded border text-sm" style={{ background: "var(--branco)" }}>
              <span className="font-medium">{s.slot_date}</span>
              <span>{s.slot_time?.substring(0, 5)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "available" ? "bg-green-100 text-green-700" : s.status === "booked" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                {s.status === "available" ? "Disponível" : s.status === "booked" ? "Reservado" : "Bloqueado"}
              </span>
              <div className="flex-1" />
              <Button size="sm" variant="ghost" onClick={() => deleteSlot(s.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}
          {slots.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum horário cadastrado</p>}
        </div>
      </div>

      {/* Appointments */}
      <div>
        <h2 className="text-xl font-medium mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>Agendamentos Recebidos</h2>
        <div className="space-y-2">
          {appointments.map((a) => (
            <div key={a.id} className="p-3 rounded-lg border" style={{ background: "var(--branco)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{a.client_name}</div>
                  <div className="text-xs text-muted-foreground">{a.client_phone} {a.client_email && `· ${a.client_email}`}</div>
                </div>
                <div className="flex gap-1 items-center">
                  {a.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(a.id, "confirmed")}>Confirmar</Button>
                      <Button size="sm" variant="ghost" onClick={() => updateAppointmentStatus(a.id, "cancelled")}>Cancelar</Button>
                    </>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${a.status === "confirmed" ? "bg-green-100 text-green-700" : a.status === "cancelled" ? "bg-red-100 text-red-600" : a.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {a.status === "pending" ? "Pendente" : a.status === "confirmed" ? "Confirmado" : a.status === "cancelled" ? "Cancelado" : "Concluído"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {appointments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum agendamento</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminSchedule;
