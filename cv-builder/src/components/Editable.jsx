import { useRef, useEffect } from "react";
import { useIsThumbnail, semanticTag } from "../templates/ThumbnailContext";

/**
 * Contenteditable wrapper. Uncontrolled DOM, updates parent on blur to avoid caret jumps.
 * When rendered inside a ThumbnailProvider, semantic heading tags (h1-h6) are
 * downgraded to <div> so the homepage gallery doesn't pollute the page outline.
 */
export default function Editable({
  value,
  onChange,
  as: requestedTag = "span",
  multiline = false,
  className = "",
  placeholder = "",
  style,
}) {
  const isThumbnail = useIsThumbnail();
  const Tag = semanticTag(requestedTag, isThumbnail);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value ?? "")) {
      ref.current.innerText = value ?? "";
    }
  }, [value]);

  const handleBlur = () => {
    const next = ref.current?.innerText ?? "";
    if (next !== value) onChange(next);
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
      style={style}
      data-placeholder={placeholder}
    />
  );
}
