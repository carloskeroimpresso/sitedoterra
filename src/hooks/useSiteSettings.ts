import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface SiteSettings {
  id: string;
  user_id: string;
  site_name: string | null;
  whatsapp_number: string | null;
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  sections_config: Record<string, boolean>;
  footer_text: string | null;
  footer_links: Array<{ label: string; href: string; blank?: boolean }>;
  instagram_handle: string | null;
  video_url: string | null;
  consultant_photo_url: string | null;
}

export interface ConsultantProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  bio: string | null;
  role_text: string | null;
  extra_contacts: Array<{ name: string; value: string; type: string }>;
}

// Busca site_settings por user_id direto (para painel admin)
export function useSiteSettings(userId?: string) {
  const queryKey = userId
    ? ["site_settings_by_user", userId]
    : ["site_settings_public"];

  const { data: rawSettings, isLoading: settingsLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      return data;
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  const { data: rawProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["consultant_profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      return data;
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  const settings: SiteSettings | null = rawSettings
    ? {
        id: rawSettings.id,
        user_id: rawSettings.user_id,
        site_name: rawSettings.site_name ?? "Consultora doTERRA",
        whatsapp_number: rawSettings.whatsapp_number ?? "",
        logo_url: rawSettings.logo_url ?? null,
        logo_dark_url: rawSettings.logo_dark_url ?? null,
        favicon_url: rawSettings.favicon_url ?? null,
        primary_color: rawSettings.primary_color ?? null,
        secondary_color: rawSettings.secondary_color ?? null,
        accent_color: rawSettings.accent_color ?? null,
        sections_config: (rawSettings.sections_config as Record<string, boolean>) ?? {},
        footer_text: rawSettings.footer_text ?? null,
        footer_links: (rawSettings.footer_links as any[]) ?? [],
        instagram_handle: rawSettings.instagram_handle ?? null,
        video_url: rawSettings.video_url ?? null,
        consultant_photo_url: rawSettings.consultant_photo_url ?? null,
      }
    : null;

  const profile: ConsultantProfile | null = rawProfile
    ? {
        id: rawProfile.id,
        full_name: rawProfile.full_name ?? null,
        phone: rawProfile.phone ?? null,
        whatsapp: rawProfile.whatsapp ?? null,
        avatar_url: rawProfile.avatar_url ?? null,
        bio: rawProfile.bio ?? null,
        role_text: rawProfile.role_text ?? "Consultora doTERRA",
        extra_contacts: (rawProfile.extra_contacts as any[]) ?? [],
      }
    : null;

  return {
    settings,
    profile,
    isLoading: settingsLoading || profileLoading,
  };
}

// Busca por username — para o site público da consultora
export function useSiteSettingsByUsername(username: string) {
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile_by_username", username],
    queryFn: async () => {
      if (!username) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("role", "consultant")
        .maybeSingle();
      return data ?? null;
    },
    enabled: !!username,
    staleTime: 60_000,
    retry: 1,
  });

  const userId = profileData?.id ?? null;

  const { data: rawSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["site_settings_by_username", username, userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      return data ?? null;
    },
    // Só busca settings depois que temos o userId (ou confirmamos que profile não existe)
    enabled: !profileLoading && !!userId,
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (!rawSettings) return;
    const root = document.documentElement;
    if (rawSettings.primary_color) root.style.setProperty("--verde", rawSettings.primary_color);
    if (rawSettings.secondary_color) root.style.setProperty("--ouro", rawSettings.secondary_color);
    if (rawSettings.accent_color) root.style.setProperty("--verde-menta", rawSettings.accent_color);
    return () => {
      root.style.removeProperty("--verde");
      root.style.removeProperty("--ouro");
      root.style.removeProperty("--verde-menta");
    };
  }, [rawSettings?.primary_color, rawSettings?.secondary_color, rawSettings?.accent_color]);

  useEffect(() => {
    if (!rawSettings?.favicon_url) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = rawSettings.favicon_url;
  }, [rawSettings?.favicon_url]);

  const consultantProfile: ConsultantProfile | null = profileData
    ? {
        id: profileData.id,
        full_name: profileData.full_name ?? null,
        phone: profileData.phone ?? null,
        whatsapp: profileData.whatsapp ?? null,
        avatar_url: profileData.avatar_url ?? null,
        bio: profileData.bio ?? null,
        role_text: profileData.role_text ?? "Consultora doTERRA",
        extra_contacts: (profileData.extra_contacts as any[]) ?? [],
      }
    : null;

  const siteSettings: SiteSettings | null = rawSettings
    ? {
        id: rawSettings.id,
        user_id: rawSettings.user_id,
        site_name: rawSettings.site_name ?? "Consultora doTERRA",
        whatsapp_number: rawSettings.whatsapp_number ?? "",
        logo_url: rawSettings.logo_url ?? null,
        logo_dark_url: rawSettings.logo_dark_url ?? null,
        favicon_url: rawSettings.favicon_url ?? null,
        primary_color: rawSettings.primary_color ?? null,
        secondary_color: rawSettings.secondary_color ?? null,
        accent_color: rawSettings.accent_color ?? null,
        sections_config: (rawSettings.sections_config as Record<string, boolean>) ?? {},
        footer_text: rawSettings.footer_text ?? null,
        footer_links: (rawSettings.footer_links as any[]) ?? [],
        instagram_handle: rawSettings.instagram_handle ?? null,
        video_url: rawSettings.video_url ?? null,
        consultant_photo_url: rawSettings.consultant_photo_url ?? null,
      }
    : null;

  const isSectionVisible = (section: string) => {
    if (!siteSettings?.sections_config || Object.keys(siteSettings.sections_config).length === 0) return true;
    return siteSettings.sections_config[section] !== false;
  };

  // notFound: só verdadeiro quando a busca por profile terminou E não achou nada
  const notFound = !profileLoading && profileData === null;
  const isSuspended = profileData?.status === "suspended";

  // isLoading: enquanto busca profile OU (encontrou profile mas ainda busca settings)
  const isLoading = profileLoading || (!!userId && settingsLoading);

  return {
    settings: siteSettings,
    profile: consultantProfile,
    isSectionVisible,
    isLoading,
    notFound,
    isSuspended,
    userId,
  };
}
