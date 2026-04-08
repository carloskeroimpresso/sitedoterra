import { useParams, Navigate } from "react-router-dom";
import { useSiteSettingsByUsername } from "@/hooks/useSiteSettings";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VitrineCTABanner from "@/components/VitrineCTABanner";
import AISpecialistSection from "@/components/AISpecialistSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import StorySection from "@/components/StorySection";
import VideoSection from "@/components/VideoSection";
import ScheduleSection from "@/components/ScheduleSection";
import InstagramSection from "@/components/InstagramSection";
import ProductsSection from "@/components/ProductsSection";
import FAQSection from "@/components/FAQSection";
import PlanosSection from "@/components/PlanosSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { createContext, useContext } from "react";

// Context para passar userId do consultor para todos os componentes filhos
export const ConsultantContext = createContext<{ userId: string | null }>({ userId: null });
export const useConsultantContext = () => useContext(ConsultantContext);

const ConsultantSite = () => {
  const { username } = useParams<{ username: string }>();
  useScrollReveal();

  const { isLoading, notFound, isSuspended, isSectionVisible, userId } =
    useSiteSettingsByUsername(username || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--creme)" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  if (isSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--creme)" }}>
        <div className="text-center max-w-sm space-y-4">
          <div className="text-4xl">🚫</div>
          <h1 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
            Site Temporariamente Indisponível
          </h1>
          <p className="text-sm" style={{ color: "var(--cinza)" }}>
            Este site está temporariamente fora do ar. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConsultantContext.Provider value={{ userId }}>
      <div className="min-h-screen">
        <Navbar />
        {isSectionVisible("hero") && <HeroSection />}
        {isSectionVisible("vitrine") && <VitrineCTABanner />}
        {isSectionVisible("ia") && <AISpecialistSection />}
        {isSectionVisible("depoimentos") && <TestimonialsSection />}
        {isSectionVisible("historia") && <StorySection />}
        {isSectionVisible("video") && <VideoSection />}
        {isSectionVisible("agendamento") && <ScheduleSection />}
        {isSectionVisible("instagram") && <InstagramSection />}
        {isSectionVisible("produtos") && <ProductsSection />}
        {isSectionVisible("faq") && <FAQSection />}
        {isSectionVisible("planos") && <PlanosSection />}
        <Footer />
        <WhatsAppButton />
      </div>
    </ConsultantContext.Provider>
  );
};

export default ConsultantSite;
