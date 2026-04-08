# 🚀 Setup do Sistema Multi-Tenant

## Visão Geral

O sistema possui dois níveis de administração:

- **Admin Mestre** (`/master`) — Controla toda a plataforma
- **Admin Consultor** (`/admin`) — Painel individual de cada consultora

---

## 1. Executar as Migrações no Supabase

Acesse o painel do Supabase → SQL Editor e execute os arquivos de migração na ordem:

```
supabase/migrations/20260404114005_...sql   (tabelas base)
supabase/migrations/20260404114127_...sql
supabase/migrations/20260405011249_...sql
supabase/migrations/20260406003706_...sql
supabase/migrations/20260407120326_...sql
supabase/migrations/20260407120354_...sql
supabase/migrations/20260407122645_...sql
supabase/migrations/20260408000000_master_admin_system.sql  ← NOVO
```

---

## 2. Criar o Primeiro Admin Mestre

Após criar uma conta normalmente pelo `/login`, execute no SQL Editor do Supabase:

```sql
UPDATE public.profiles
SET role = 'master'
WHERE email = 'seuemail@dominio.com';
```

O Admin Mestre será redirecionado automaticamente para `/master` ao fazer login.

---

## 3. Como Funciona o Sistema

### Admin Mestre (`/master`)
- **Métricas** — Visão geral de todos os consultores
- **Consultores** — Listar, suspender, ativar, excluir consultores
- **Planos** — Criar e gerenciar planos de assinatura
- **Integrações** — Configurar Stripe e Mercado Pago

### Admin Consultor (`/admin`)
- Todas as configurações do site (cores, imagens, seções)
- Produtos, Depoimentos, FAQ, Agendamentos
- Perfil da consultora
- **Domínio** — Configurar username e domínio próprio

### Sites Públicos
Cada consultora tem seu site em:
```
https://seusite.com/{username}
```

---

## 4. Configurar Domínio Próprio para Consultoras

Para suportar domínios próprios (ex: `meusite.com.br`), você precisará:

1. Configurar o servidor/CDN para aceitar múltiplos domínios
2. A consultora registra o domínio na aba "Domínio" do painel
3. A consultora aponta o CNAME do domínio para seu servidor

**Com Vercel/Netlify:**
- Adicionar o domínio no painel da plataforma
- A consultora configura o DNS

---

## 5. Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page da plataforma |
| `/login` | Login/Cadastro |
| `/admin` | Painel do Consultor |
| `/master` | Painel do Admin Mestre |
| `/:username` | Site público de cada consultora |

---

## 6. Integrações de Pagamento

Configure as chaves no painel Master → Integrações:

### Stripe
- **Public Key**: `pk_live_...` (visível no frontend)
- **Secret Key**: `sk_live_...` (nunca exposta no frontend)

### Mercado Pago
- **Public Key**: `APP_USR-...`
- **Access Token**: `APP_USR-...`

> ⚠️ As chaves são armazenadas na tabela `platform_settings` protegida por RLS — apenas o master tem acesso.

---

## 7. Arquivos Modificados/Criados

```
src/
  App.tsx                              ← Atualizado (novas rotas)
  contexts/AuthContext.tsx             ← Atualizado (role, isMaster, etc)
  hooks/useSiteSettings.ts             ← Atualizado (multi-tenant)
  pages/
    Admin.tsx                          ← Atualizado (aba Domínio)
    Login.tsx                          ← Atualizado (username, redirect master)
    MasterAdmin.tsx                    ← NOVO
    ConsultantSite.tsx                 ← NOVO
  components/
    ProtectedRoute.tsx                 ← Atualizado (role guard)
    master/
      MasterConsultants.tsx            ← NOVO
      MasterPlans.tsx                  ← NOVO
      MasterIntegrations.tsx           ← NOVO
      MasterMetrics.tsx                ← NOVO
    admin/
      AdminDomain.tsx                  ← NOVO

supabase/migrations/
  20260408000000_master_admin_system.sql  ← NOVO
```
