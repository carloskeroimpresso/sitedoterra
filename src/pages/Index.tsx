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
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  useScrollReveal();
  const { isSectionVisible } = useSiteSettings();

  return (
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
  );
};

export default Index;
