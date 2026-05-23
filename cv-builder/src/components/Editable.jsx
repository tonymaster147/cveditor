import { useRef, useEffect } from "react";

/**
 * Contenteditable wrapper. Uncontrolled DOM, updates parent on blur to avoid caret jumps.
 */
export default function Editable({
  value,
  onChange,
  as: Tag = "span",
  multiline = false,
  className = "",
  placeholder = "",
  style,
}) {
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
