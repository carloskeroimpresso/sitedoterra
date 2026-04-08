import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Package, BarChart2, Settings, Shield } from "lucide-react";
import MasterConsultants from "@/components/master/MasterConsultants";
import MasterPlans from "@/components/master/MasterPlans";
import MasterIntegrations from "@/components/master/MasterIntegrations";
import MasterMetrics from "@/components/master/MasterMetrics";

const tabs = [
  { id: "metrics", label: "Métricas", icon: BarChart2 },
  { id: "consultants", label: "Consultores", icon: Users },
  { id: "plans", label: "Planos", icon: Package },
  { id: "integrations", label: "Integrações", icon: Settings },
] as const;

type TabId = (typeof tabs)[number]["id"];

const MasterAdmin = () => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("metrics");

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const renderContent = () => {
    switch (activeTab) {
      case "metrics": return <MasterMetrics />;
      case "consultants": return <MasterConsultants />;
      case "plans": return <MasterPlans />;
      case "integrations": return <MasterIntegrations />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--creme)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ background: "var(--branco)", borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" style={{ color: "var(--verde)" }} />
          <span className="text-lg font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
            Admin Mestre
          </span>
        </div>
        <span className="text-xs text-muted-foreground hidden md:block">{profile?.email}</span>
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer"
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
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto border-b px-2 py-2 gap-1 w-full" style={{ background: "var(--branco)", borderColor: "rgba(0,0,0,0.06)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border-none cursor-pointer"
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
        <div className="flex-1 p-6 md:p-8 max-w-5xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MasterAdmin;
