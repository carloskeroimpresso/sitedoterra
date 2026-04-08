import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    // Observe initially and re-observe on DOM changes
    const observeAll = () => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((r) => observer.observe(r));
    };

    observeAll();
    
    // Re-observe after short delays to catch dynamically rendered elements
    const t1 = setTimeout(observeAll, 500);
    const t2 = setTimeout(observeAll, 1500);

    // Also watch for DOM changes (new elements added by React Query etc.)
    const mutation = new MutationObserver(() => observeAll());
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
}
