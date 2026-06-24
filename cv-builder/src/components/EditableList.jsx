import Editable from "./Editable";
import { useIsThumbnail } from "../templates/ThumbnailContext";

/**
 * Editable list of plain string items with add/remove controls hidden during export.
 * In thumbnail mode (gallery cards) we drop the inner <button> elements so we
 * don't nest a button inside the card's outer <button> wrapper.
 */
export default function EditableList({ items, onChange, className = "", itemClassName = "", bullet = "•" }) {
  const isThumbnail = useIsThumbnail();

  const update = (i, v) => {
    const next = items.slice();
    next[i] = v;
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, "New item"]);

  return (
    <ul className={className}>
      {items.map((it, i) => (
        <li key={i} className={`group flex gap-2 items-start ${itemClassName}`}>
          {bullet && <span className="shrink-0">{bullet}</span>}
          <Editable
            as="span"
            value={it}
            onChange={(v) => update(i, v)}
            multiline
            className="flex-1 outline-none"
          />
          {!isThumbnail && (
            <button
              onClick={() => remove(i)}
              className="no-export opacity-0 group-hover:opacity-100 text-red-500 text-xs px-1"
              title="Remove"
            >
              ✕
            </button>
          )}
        </li>
      ))}
      {!isThumbnail && (
        <li className="no-export">
          <button onClick={add} className="text-xs text-blue-600 hover:underline mt-1">
            + Add item
          </button>
        </li>
      )}
    </ul>
  );
}
