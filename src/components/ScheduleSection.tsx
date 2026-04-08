import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

const ScheduleSection = () => {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [booking, setBooking] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const { data: slots = [] } = useQuery({
    queryKey: ["schedule_slots_public", format(monthStart, "yyyy-MM")],
    queryFn: async () => {
      const { data } = await supabase
        .from("schedule_slots")
        .select("*")
        .gte("slot_date", format(monthStart, "yyyy-MM-dd"))
        .lte("slot_date", format(monthEnd, "yyyy-MM-dd"))
        .order("slot_date")
        .order("slot_time");
      return data || [];
    },
  });

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = getDay(monthStart);

  const datesWithSlots = useMemo(() => {
    const map = new Map<string, { available: number; booked: number }>();
    slots.forEach((s: any) => {
      const key = s.slot_date;
      const prev = map.get(key) || { available: 0, booked: 0 };
      if (s.status === "available") prev.available++;
      else prev.booked++;
      map.set(key, prev);
    });
    return map;
  }, [slots]);

  const selectedDateSlots = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return slots.filter((s: any) => s.slot_date === key);
  }, [slots, selectedDate]);

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSlotId) throw new Error("Selecione um horário");
      if (!clientName.trim()) throw new Error("Informe seu nome");
      if (!clientPhone.trim()) throw new Error("Informe seu telefone");

      const slot = slots.find((s: any) => s.id === selectedSlotId);
      if (!slot) throw new Error("Horário não encontrado");

      // Update slot status to booked
      const { error: slotError } = await supabase
        .from("schedule_slots")
        .update({ status: "booked" as any })
        .eq("id", selectedSlotId);
      if (slotError) throw slotError;

      // Create appointment
      const { error: apptError } = await supabase.from("appointments").insert({
        user_id: (slot as any).user_id,
        slot_id: selectedSlotId,
        client_name: clientName.trim(),
        client_phone: clientPhone.trim(),
        status: "pending",
      });
      if (apptError) throw apptError;
    },
    onSuccess: () => {
      toast.success("Agendamento realizado! Entraremos em contato para confirmar.");
      setSelectedSlotId(null);
      setClientName("");
      setClientPhone("");
      setBooking(false);
      queryClient.invalidateQueries({ queryKey: ["schedule_slots_public"] });
    },
    onError: (err: any) => toast.error(err.message || "Erro ao agendar"),
  });

  return (
    <section id="agendamento" className="py-[100px] px-[8%]" style={{ background: "var(--branco)", scrollMarginTop: "70px" }}>
      <div className="mb-12 reveal">
        <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-text">Agenda da consultora</span></div>
        <h2 className="section-title">Agende sua<br /><em>consulta gratuita</em></h2>
        <p className="section-sub">Escolha o melhor dia e horário para sua consulta personalizada.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[5rem] items-start">
        {/* Calendar */}
        <div className="reveal rounded-[16px] overflow-hidden border border-[rgba(29,92,58,0.06)]" style={{ background: "var(--creme)", boxShadow: "0 20px 60px rgba(29,92,58,0.08)" }}>
          <div className="bg-[var(--verde)] p-6 flex items-center justify-between">
            <span className="text-[1.2rem] text-[var(--branco)] font-normal capitalize" style={{ fontFamily: "var(--font-heading)" }}>
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.12)] border-none cursor-pointer text-white text-[1rem] flex items-center justify-center hover:bg-[rgba(255,255,255,0.25)] transition-colors">‹</button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.12)] border-none cursor-pointer text-white text-[1rem] flex items-center justify-center hover:bg-[rgba(255,255,255,0.25)] transition-colors">›</button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 mb-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                <span key={d} className="text-center text-[0.65rem] font-medium text-[var(--cinza-claro)] tracking-[0.1em] uppercase py-[0.3rem]" style={{ fontFamily: "var(--font-body)" }}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e${i}`} className="aspect-square" />)}
              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const info = datesWithSlots.get(key);
                const hasAvailable = info && info.available > 0;
                const hasBooked = info && info.booked > 0 && !hasAvailable;
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isPast = isBefore(day, new Date()) && !isToday(day);

                return (
                  <div
                    key={key}
                    onClick={() => !isPast && hasAvailable && setSelectedDate(day)}
                    className={`aspect-square flex items-center justify-center rounded-full text-[0.82rem] transition-all duration-200 
                      ${isPast ? "text-[var(--cinza-claro)] opacity-40 cursor-default" : "cursor-pointer"}
                      ${isSelected ? "!bg-[var(--verde)] !text-[var(--branco)]" : ""}
                      ${hasAvailable && !isSelected && !isPast ? "bg-[rgba(45,122,79,0.1)] text-[var(--verde)] font-medium hover:bg-[var(--verde)] hover:text-[var(--branco)]" : ""}
                      ${hasBooked ? "bg-[rgba(0,0,0,0.05)] text-[var(--cinza-claro)] cursor-not-allowed line-through" : ""}
                      ${isToday(day) && !isSelected ? "border-2 border-[var(--ouro)] text-[var(--ouro)] font-medium" : ""}
                      ${!hasAvailable && !hasBooked && !isToday(day) && !isPast ? "text-[var(--preto)]" : ""}
                    `}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-[1.2rem] px-6 py-4 border-t border-[rgba(0,0,0,0.06)] flex-wrap">
            <div className="flex items-center gap-[6px] text-[0.72rem] text-[var(--cinza)]" style={{ fontFamily: "var(--font-body)" }}><div className="w-[10px] h-[10px] rounded-full bg-[rgba(45,122,79,0.1)] border border-[rgba(45,122,79,0.3)]" />Disponível</div>
            <div className="flex items-center gap-[6px] text-[0.72rem] text-[var(--cinza)]" style={{ fontFamily: "var(--font-body)" }}><div className="w-[10px] h-[10px] rounded-full bg-[rgba(0,0,0,0.08)]" />Ocupado</div>
            <div className="flex items-center gap-[6px] text-[0.72rem] text-[var(--cinza)]" style={{ fontFamily: "var(--font-body)" }}><div className="w-[10px] h-[10px] rounded-full border-2 border-[var(--ouro)]" />Hoje</div>
          </div>
        </div>

        {/* Slots + Booking Form */}
        <div className="reveal" style={{ transitionDelay: "0.2s" }}>
          {selectedDate ? (
            <div>
              <p className="text-[0.8rem] font-medium text-[var(--cinza)] uppercase tracking-[0.1em] mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Horários — {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {selectedDateSlots.map((s: any) => {
                  const isAvailable = s.status === "available";
                  const isSelected = selectedSlotId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => isAvailable && setSelectedSlotId(s.id)}
                      className={`py-[0.6rem] rounded-[8px] text-center text-[0.8rem] font-medium transition-all duration-200
                        ${!isAvailable ? "bg-[rgba(0,0,0,0.04)] text-[var(--cinza-claro)] border-transparent cursor-not-allowed line-through" : "bg-[rgba(45,122,79,0.06)] text-[var(--verde)] border border-[rgba(29,92,58,0.15)] hover:bg-[var(--verde)] hover:text-white hover:border-[var(--verde)] cursor-pointer"}
                        ${isSelected ? "!bg-[var(--verde)] !text-white !border-[var(--verde)]" : ""}
                      `}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {s.slot_time?.substring(0, 5)}
                    </div>
                  );
                })}
              </div>
              {selectedDateSlots.filter((s: any) => s.status === "available").length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Todos os horários estão ocupados neste dia.</p>
              )}

              {selectedSlotId && !booking && (
                <div className="mt-6">
                  <Button onClick={() => setBooking(true)} className="w-full" style={{ background: "var(--verde)" }}>
                    Agendar este horário
                  </Button>
                </div>
              )}

              {booking && (
                <div className="mt-6 p-6 bg-[var(--creme)] rounded-[12px] border border-[rgba(29,92,58,0.1)] space-y-3">
                  <p className="text-[0.85rem] font-medium text-[var(--verde)]" style={{ fontFamily: "var(--font-heading)" }}>Confirme seus dados</p>
                  <Input placeholder="Seu nome" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                  <Input placeholder="Seu telefone / WhatsApp" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                  <div className="flex gap-2">
                    <Button onClick={() => bookMutation.mutate()} disabled={bookMutation.isPending} className="flex-1" style={{ background: "var(--verde)" }}>
                      {bookMutation.isPending ? "Agendando..." : "Confirmar agendamento"}
                    </Button>
                    <Button variant="ghost" onClick={() => setBooking(false)}>Cancelar</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] flex-col gap-3 border-2 border-dashed border-[rgba(29,92,58,0.15)] rounded-[12px]">
              <span className="text-[2rem]">📅</span>
              <p className="text-[0.85rem] text-[var(--cinza-claro)] text-center" style={{ fontFamily: "var(--font-body)" }}>Selecione um dia disponível<br />no calendário</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
