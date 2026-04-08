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

const defaultSettings: Omit<SiteSettings, "id" | "user_id"> = {
  site_name: "Consultora doTERRA",
  whatsapp_number: "5511999999999",
  logo_url: null,
  logo_dark_url: null,
  favicon_url: null,
  primary_color: null,
  secondary_color: null,
  accent_color: null,
  sections_config: {},
  footer_text: null,
  footer_links: [],
  instagram_handle: null,
  video_url: null,
  consultant_photo_url: null,
};

// Busca site_settings por user_id direto (para painel admin)
export function useSiteSettings(userId?: string) {
  const queryKey = userId
    ? ["site_settings_by_user", userId]
    : ["site_settings_public"];

  const { data: rawSettings, isLoading: settingsLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const q = supabase.from("site_settings").select("*");
      if (userId) {
        const { data } = await q.eq("user_id", userId).maybeSingle();
        return data as any;
      } else {
        const { data } = await q.limit(1).maybeSingle();
        return data as any;
      }
    },
    staleTime: 60_000,
  });

  const profileQueryKey = userId
    ? ["consultant_profile_by_user", userId]
    : ["consultant_profile_public"];

  const { data: rawProfile, isLoading: profileLoading } = useQuery({
    queryKey: profileQueryKey,
    queryFn: async () => {
      const q = supabase.from("profiles").select("*");
      if (userId) {
        const { data } = await q.eq("id", userId).maybeSingle();
        return data as any;
      } else {
        const { data } = await q.limit(1).maybeSingle();
        return data as any;
      }
    },
    staleTime: 60_000,
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
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = rawSettings.favicon_url;
  }, [rawSettings?.favicon_url]);

  const s: Omit<SiteSettings, "id" | "user_id"> = {
    site_name: rawSettings?.site_name ?? defaultSettings.site_name,
    whatsapp_number: rawSettings?.whatsapp_number ?? defaultSettings.whatsapp_number,
    logo_url: rawSettings?.logo_url ?? null,
    logo_dark_url: rawSettings?.logo_dark_url ?? null,
    favicon_url: rawSettings?.favicon_url ?? null,
    primary_color: rawSettings?.primary_color ?? null,
    secondary_color: rawSettings?.secondary_color ?? null,
    accent_color: rawSettings?.accent_color ?? null,
    sections_config: (rawSettings?.sections_config as Record<string, boolean>) ?? {},
    footer_text: rawSettings?.footer_text ?? null,
    footer_links: (rawSettings?.footer_links as any[]) ?? [],
    instagram_handle: rawSettings?.instagram_handle ?? null,
    video_url: rawSettings?.video_url ?? null,
    consultant_photo_url: rawSettings?.consultant_photo_url ?? null,
  };

  const p: Omit<ConsultantProfile, "id"> = {
    full_name: rawProfile?.full_name ?? null,
    phone: rawProfile?.phone ?? null,
    whatsapp: rawProfile?.whatsapp ?? null,
    avatar_url: rawProfile?.avatar_url ?? null,
    bio: rawProfile?.bio ?? null,
    role_text: rawProfile?.role_text ?? "Consultora doTERRA",
    extra_contacts: (rawProfile?.extra_contacts as any[]) ?? [],
  };

  const isSectionVisible = (section: string) => {
    if (!s.sections_config || Object.keys(s.sections_config).length === 0) return true;
    return s.sections_config[section] !== false;
  };

  return {
    settings: s,
    profile: p,
    ownerId: rawSettings?.user_id ?? null,
    isSectionVisible,
    isLoading: settingsLoading || profileLoading,
  };
}

// Hook para buscar site de um consultor pelo username
export function useSiteSettingsByUsername(username: string) {
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile_by_username", username],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("role", "consultant")
        .maybeSingle();
      return data as any;
    },
    enabled: !!username,
    staleTime: 60_000,
  });

  const userId = profileData?.id;

  const { data: rawSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["site_settings_by_username", username],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase.from("site_settings").select("*").eq("user_id", userId).maybeSingle();
      return data as any;
    },
    enabled: !!userId,
    staleTime: 60_000,
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
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = rawSettings.favicon_url;
  }, [rawSettings?.favicon_url]);

  const consultantProfile = profileData ? {
    id: profileData.id,
    full_name: profileData.full_name ?? null,
    phone: profileData.phone ?? null,
    whatsapp: profileData.whatsapp ?? null,
    avatar_url: profileData.avatar_url ?? null,
    bio: profileData.bio ?? null,
    role_text: profileData.role_text ?? "Consultora doTERRA",
    extra_contacts: (profileData.extra_contacts as any[]) ?? [],
  } : null;

  const siteSettings = rawSettings ? {
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
  } : null;

  const isSectionVisible = (section: string) => {
    if (!siteSettings?.sections_config || Object.keys(siteSettings.sections_config).length === 0) return true;
    return siteSettings.sections_config[section] !== false;
  };

  const notFound = !profileLoading && !profileData;
  const isSuspended = profileData?.status === "suspended";

  return {
    settings: siteSettings,
    profile: consultantProfile,
    isSectionVisible,
    isLoading: profileLoading || settingsLoading,
    notFound,
    isSuspended,
    userId,
  };
}
