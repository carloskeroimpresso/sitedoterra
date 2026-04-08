import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMaster?: boolean;
}

const ProtectedRoute = ({ children, requireMaster = false }: ProtectedRouteProps) => {
  const { user, profile, loading, isMaster, isSuspended } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--creme)" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (isSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--creme)" }}>
        <div className="text-center max-w-sm space-y-4">
          <div className="text-4xl">🔒</div>
          <h1 className="text-xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
            Conta Suspensa
          </h1>
          <p className="text-sm" style={{ color: "var(--cinza)" }}>
            Sua conta foi suspensa. Entre em contato com o suporte para mais informações.
          </p>
          <button
            onClick={async () => { const { supabase } = await import("@/integrations/supabase/client"); await supabase.auth.signOut(); window.location.href = "/"; }}
            className="text-xs underline"
            style={{ color: "var(--verde)" }}
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  // Rota master: apenas master pode acessar
  if (requireMaster && !isMaster) {
    return <Navigate to="/admin" replace />;
  }

  // Se master tentar acessar /admin de consultor, redireciona para /master
  if (!requireMaster && isMaster && profile) {
    return <Navigate to="/master" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
