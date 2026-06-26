import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll to top on forward navigations (PUSH / REPLACE) so opening a template
// from the bottom of the Gallery lands you at the top of the Editor.
// On POP (browser back/forward) we deliberately do nothing: components are
// free to restore their own saved scroll position from sessionStorage.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === "POP") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, navType]);
  return null;
}
