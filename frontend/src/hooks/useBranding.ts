import { useEffect } from "react";

export const useBranding = (settings: any, siteName: string) => {
  useEffect(() => {
    if (!settings) return;

    // 1. Changer le titre du navigateur
    document.title = settings.browser_title || siteName || "Alpha Construction";

    // 2. Changer le Favicon
    if (settings.favicon_url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings, siteName]);
};
