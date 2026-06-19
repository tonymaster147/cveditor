import { createContext, useContext } from "react";

// Templates rendered as thumbnails on the homepage should NOT emit semantic
// headings (h1/h2/h3) — otherwise the gallery page has ~12 H1s, which is bad
// for accessibility tools and SEO. Editable + section helpers consult this
// context and silently downgrade their tag to <div> when isThumbnail is true.
const ThumbnailContext = createContext(false);

export function ThumbnailProvider({ children }) {
  return (
    <ThumbnailContext.Provider value={true}>{children}</ThumbnailContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useIsThumbnail() {
  return useContext(ThumbnailContext);
}

// Downgrade a heading tag string when inside a thumbnail.
// eslint-disable-next-line react-refresh/only-export-components
export function semanticTag(tag, isThumbnail) {
  if (!isThumbnail) return tag;
  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
    return "div";
  }
  return tag;
}
