import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Login = () => {
  const { user, profile, signIn, signUp, resetPassword, isMaster } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  // Se já logado, redirecionar corretamente
  if (user && profile) {
    return <Navigate to={isMaster ? "/master" : "/admin"} replace />;
  }
  if (user && !profile) return null; // loading profile

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isForgot) {
      const { error } = await resetPassword(email);
      if (error) toast.error(error);
      else toast.success("E-mail de recuperação enviado! Verifique sua caixa.");
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) toast.error(error);
      else toast.success("Conta criada! Verifique seu e-mail para confirmar.");
    } else {
      const { error } = await signIn(email, password);
      if (error) toast.error(error);
      else navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--creme)" }}>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-heading)", color: "var(--verde)" }}>
            {isForgot ? "Recuperar senha" : isSignUp ? "Criar conta" : "Painel Admin"}
          </h1>
          <p className="text-sm mt-2" style={{ fontFamily: "var(--font-body)", color: "var(--cinza)" }}>
            {isForgot ? "Enviaremos um link de recuperação" : isSignUp ? "Cadastre-se como consultora" : "Acesse sua conta de consultora"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && !isForgot && (
            <>
              <Input
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <div>
                <Input
                  placeholder="Username (ex: ana-beatriz)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Seu site ficará em: <span className="font-mono">{window.location.host}/{username || "seu-username"}</span>
                </p>
              </div>
            </>
          )}
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isForgot && (
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde..." : isForgot ? "Enviar link" : isSignUp ? "Cadastrar" : "Entrar"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          {!isForgot && (
            <button
              onClick={() => setIsForgot(true)}
              className="text-xs underline bg-transparent border-none cursor-pointer"
              style={{ color: "var(--cinza)" }}
            >
              Esqueci minha senha
            </button>
          )}
          <div>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setIsForgot(false); }}
              className="text-xs bg-transparent border-none cursor-pointer"
              style={{ color: "var(--verde)", fontFamily: "var(--font-body)" }}
            >
              {isSignUp ? "Já tenho conta → Entrar" : "Não tenho conta → Cadastrar"}
            </button>
          </div>
          {isForgot && (
            <button
              onClick={() => setIsForgot(false)}
              className="text-xs bg-transparent border-none cursor-pointer"
              style={{ color: "var(--verde)" }}
            >
              ← Voltar ao login
            </button>
          )}
        </div>

        <div className="text-center">
          <a href="/" className="text-xs no-underline" style={{ color: "var(--cinza-claro)" }}>
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
