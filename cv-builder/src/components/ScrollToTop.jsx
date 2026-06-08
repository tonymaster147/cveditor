import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router preserves scroll position across navigation by default.
// This resets it to top whenever the path changes, so opening a template
// from the bottom of the Gallery doesn't land you mid-page on the Editor.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
