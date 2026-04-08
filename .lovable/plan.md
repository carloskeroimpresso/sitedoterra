

# Plano: Corrigir Bugs + Admin Consultor Completo

## Problemas identificados (via network requests)

Os dados DO Supabase ESTAO retornando corretamente (2 produtos, 1 depoimento, 3 FAQ). O problema real e que varios componentes sao **hardcoded** e nao leem do banco:
- `HeroSection`: nome "Ana Beatriz" e foto hardcoded
- `Footer`: nome, WhatsApp, links hardcoded
- `WhatsAppButton`: link hardcoded `5511999999999`
- `ScheduleSection`: 100% hardcoded (nao usa Supabase)
- Cores do site nao sao configuraveis
- Logo escuro nao existe

## Fase 1: Migration SQL

Adicionar colunas faltantes:

| Tabela | Novas colunas |
|---|---|
| `products` | `promo_price text`, `external_link text`, `has_price bool default true` |
| `testimonials` | `company text`, `role_title text`, `photo_url text` |
| `site_settings` | `primary_color text`, `secondary_color text`, `accent_color text`, `logo_dark_url text`, `sections_config jsonb default '{}'`, `footer_text text`, `footer_links jsonb default '[]'`, `instagram_handle text`, `video_url text`, `consultant_photo_url text` |
| `profiles` | `whatsapp text`, `extra_contacts jsonb default '[]'` |

Storage RLS: adicionar policy para upload publico no bucket `site-assets`.

## Fase 2: Corrigir componentes publicos (bugs)

1. **HeroSection** — ler `profiles` e `site_settings` para nome, foto da consultora, cargo
2. **Footer** — ler `site_settings` para footer_text, footer_links, whatsapp, nome; permitir `target="_blank"`
3. **WhatsAppButton** — ler `site_settings.whatsapp_number` dinamicamente
4. **ScheduleSection** — reescrever para buscar `schedule_slots` do Supabase, com calendario dinamico (mes atual, navegacao), formulario de agendamento (nome + telefone) que cria `appointment`
5. **ProductsSection** — mostrar preco promocional com % de desconto; link externo; sem preco se `has_price=false`
6. **TestimonialsSection** — mostrar empresa, cargo, foto
7. **Index.tsx** — respeitar `sections_config` para ativar/desativar secoes
8. **CSS vars** — aplicar cores customizadas do `site_settings` via CSS custom properties no root

## Fase 3: Admin Consultor melhorado

### 3.1 Configuracoes do Site (`AdminSettings`)
- **3 cores principais** com color picker (primaria, secundaria, destaque)
- **Ativar/desativar secoes** via toggles (hero, depoimentos, FAQ, agenda, etc.)
- **Logo fundo claro** + **Logo fundo escuro** (2 uploads, sistema alterna automaticamente)
- **Foto da consultora** (upload para hero)
- **Link de video** na home
- **Instagram**: campo @usuario
- **Footer**: texto editavel, links com opcao `_blank`
- **Botao "Restaurar padrao"** em cada grupo

### 3.2 Produtos (`AdminProducts`)
- Renomear "Badge" para "Categoria"
- Upload de imagem do produto (Supabase Storage)
- Campo link externo (opcional)
- Toggle "Tem preco?" — se sim, campo preco + preco promocional + % desconto automatico
- Ordenacao: botoes subir/descer

### 3.3 Depoimentos (`AdminTestimonials`)
- Adicionar campos: empresa, cargo, foto (upload)
- Corrigir exibicao no site

### 3.4 Agenda (`AdminSchedule`)
- Definir disponibilidade padrao: dias da semana + horarios
- Ao agendar: nome e telefone do cliente
- Bloqueio automatico apos agendamento

### 3.5 Perfil (`AdminProfile`)
- Adicionar campo WhatsApp (reflete nos botoes do site)
- Multiplos contatos (nome + telefone/email) exibidos no rodape

## Fase 4: Hook centralizado `useSiteSettings`

Migrar de localStorage para Supabase query. Retorna: cores, logo claro/escuro, nome, whatsapp, sections_config, footer, etc. Usado por Navbar, Hero, Footer, WhatsApp, Index.

## Ordem de implementacao

1. Migration SQL (novas colunas)
2. `useSiteSettings` hook reescrito (Supabase)
3. Corrigir HeroSection, Footer, WhatsAppButton, ScheduleSection
4. Atualizar ProductsSection e TestimonialsSection
5. Index.tsx com toggle de secoes
6. AdminSettings completo (cores, secoes, logos, footer)
7. AdminProducts com imagem, promo, link, reordenacao
8. AdminTestimonials com empresa/cargo/foto
9. AdminSchedule com disponibilidade padrao
10. AdminProfile com WhatsApp e contatos extras

## Detalhes tecnicos

- Color pickers usarao `<input type="color">` com preview
- Cores customizadas serao injetadas como CSS vars no `<html>` via useEffect
- `sections_config` sera um JSONB tipo `{ "hero": true, "testimonials": false, ... }`
- Desconto calculado: `Math.round((1 - promoPrice/price) * 100)`
- Drag/reorder sera via botoes (setas) atualizando `sort_order`
- Todos os uploads vao para o bucket `site-assets` ja existente

