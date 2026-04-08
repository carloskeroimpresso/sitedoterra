import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Package, MessageSquare, HelpCircle, Calendar, User, Globe } from "lucide-react";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminFAQ from "@/components/admin/AdminFAQ";
import AdminSchedule from "@/components/admin/AdminSchedule";
import AdminProfile from "@/components/admin/AdminProfile";
import AdminDomain from "@/components/admin/AdminDomain";

const tabs = [
  { id: "settings", label: "Configurações", icon: Settings },
  { id: "products", label: "Produtos", icon: Package },
  { id: "testimonials", label: "Depoimentos", icon: MessageSquare },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "schedule", label: "Agenda", icon: Calendar },
  { id: "profile", label: "Perfil", icon: User },
  { id: "domain", label: "Domínio", icon: Globe },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Admin = () => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("settings");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "settings": return <AdminSettings />;
      case "products": return <AdminProducts />;
      case "testimonials": return <AdminTestimonials />;
      case "faq": return <AdminFAQ />;
      case "schedule": return <AdminSchedule />;
      case "profile": return <AdminProfile />;
      case "domain": return <AdminDomain />;
    }
  };

  const siteUrl = profile?.username ? `/${profile.username}` : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--creme)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ background: "var(--branco)", borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3">
          <a href="/" className="text-lg font-medium no-underline" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
            ← Site
          </a>
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-2 py-1 rounded-full border no-underline hidden md:inline-flex items-center gap-1"
              style={{ color: "var(--cinza)", borderColor: "rgba(0,0,0,0.12)" }}
            >
              <Globe className="h-3 w-3" />
              {window.location.host}{siteUrl}
            </a>
          )}
        </div>
        <h1 className="text-sm font-medium tracking-widest uppercase" style={{ fontFamily: "var(--font-body)", color: "var(--cinza)" }}>
          Painel Admin
        </h1>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-1" /> Sair
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 min-h-[calc(100vh-57px)] border-r p-4 hidden md:block" style={{ background: "var(--branco)", borderColor: "rgba(0,0,0,0.06)" }}>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer`}
                style={{
                  fontFamily: "var(--font-body)",
                  background: activeTab === tab.id ? "var(--verde)" : "transparent",
                  color: activeTab === tab.id ? "var(--branco)" : "var(--cinza)",
                }}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Subscription badge */}
          <div className="mt-6 p-3 rounded-lg border text-center" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-1 ${
              profile?.subscription_status === "active" ? "bg-emerald-100 text-emerald-700" :
              profile?.subscription_status === "expired" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {profile?.subscription_status === "active" ? "✓ Assinatura Ativa" :
               profile?.subscription_status === "expired" ? "Assinatura Expirada" : "Trial"}
            </div>
            {profile?.username && (
              <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
                /{profile.username}
              </div>
            )}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto border-b px-2 py-2 gap-1 w-full" style={{ background: "var(--branco)", borderColor: "rgba(0,0,0,0.06)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border-none cursor-pointer`}
              style={{
                background: activeTab === tab.id ? "var(--verde)" : "transparent",
                color: activeTab === tab.id ? "var(--branco)" : "var(--cinza)",
              }}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 max-w-4xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
