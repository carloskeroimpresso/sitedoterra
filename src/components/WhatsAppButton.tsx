import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppButton = () => {
  const { settings, profile } = useSiteSettings();
  const whatsapp = profile.whatsapp || settings.whatsapp_number || "5511999999999";

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] text-[hsl(0,0%,100%)] shadow-lg hover:scale-110 transition-transform animate-float"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
};

export default WhatsAppButton;
