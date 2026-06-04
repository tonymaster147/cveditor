import { useRef, useState, useEffect } from "react";

/**
 * Photo frame with upload, pan (drag), and zoom (wheel or slider).
 *
 * `value` may be:
 *   - "" / falsy        → empty placeholder
 *   - data URL string   → backwards-compat: treated as { src, x:0, y:0, zoom:1 }
 *   - { src, x, y, zoom } where x/y are pixel offsets from centered, zoom is multiplier (1 = cover)
 *
 * onChange receives the same object shape (or "" when removed).
 */
export default function PhotoUpload({ value, onChange, size = 110, shape = "circle" }) {
  const inputRef = useRef(null);
  const frameRef = useRef(null);
  const dragState = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const photo = normalize(value);
  const hasPhoto = !!photo.src;
  const radius = shape === "circle" ? "50%" : "12px";

  const update = (patch) => onChange({ ...photo, ...patch });

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ src: reader.result, x: 0, y: 0, zoom: 1 });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Drag-to-pan: pixel-based offsets
  const onPointerDown = (e) => {
    if (!hasPhoto) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragState.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: photo.x,
      startY: photo.y,
    };
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    const s = dragState.current;
    if (!s) return;
    const dx = e.clientX - s.startClientX;
    const dy = e.clientY - s.startClientY;
    onChange({ ...photo, x: s.startX + dx, y: s.startY + dy });
  };

  const onPointerUp = (e) => {
    if (dragState.current) {
      dragState.current = null;
      setIsDragging(false);
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
  };

  const onWheel = (e) => {
    if (!hasPhoto) return;
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    update({ zoom: clamp(+(photo.zoom + delta).toFixed(2), 1, 4) });
  };

  return (
    <div
      className="relative inline-block group"
      style={{ width: size, height: size, zIndex: 5 }}
    >
      <div
        ref={frameRef}
        className="w-full h-full bg-gray-200 overflow-hidden border-2 border-white shadow relative"
        style={{
          borderRadius: radius,
          cursor: hasPhoto ? (isDragging ? "grabbing" : "grab") : "pointer",
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onClick={() => !hasPhoto && inputRef.current?.click()}
        title={hasPhoto ? "Drag to pan · scroll to zoom" : "Click to upload photo"}
      >
        {hasPhoto ? (
          <img
            src={photo.src}
            alt=""
            draggable={false}
            className="absolute top-1/2 left-1/2 pointer-events-none select-none max-w-none"
            style={{
              width: size,
              height: size,
              // "contain" shows the entire photo inside the circle (letterboxed),
              // so no part of the image is hidden. Users can still zoom in (slider/wheel)
              // and pan to crop tighter if they want a "cover"-style face shot.
              objectFit: "contain",
              transform: `translate(-50%, -50%) translate(${photo.x}px, ${photo.y}px) scale(${photo.zoom})`,
              transformOrigin: "center",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-gray-400" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      {hasPhoto && (
        <>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="no-export absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full shadow opacity-0 group-hover:opacity-100 transition z-10"
            title="Remove photo"
          >
            ✕
          </button>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="no-export absolute -top-1 -left-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full shadow opacity-0 group-hover:opacity-100 transition z-10"
            title="Replace photo"
          >
            ⟳
          </button>

          {/* Zoom slider */}
          <div
            className="no-export absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-full shadow px-2 py-1 opacity-0 group-hover:opacity-100 transition z-10"
            style={{ top: "calc(100% + 6px)" }}
            onPointerDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] text-gray-500">−</span>
            <input
              type="range"
              min="1"
              max="4"
              step="0.05"
              value={photo.zoom}
              onChange={(e) => update({ zoom: parseFloat(e.target.value) })}
              className="w-20 h-1 accent-blue-500 cursor-pointer"
            />
            <span className="text-[10px] text-gray-500">+</span>
          </div>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

function normalize(v) {
  if (!v) return { src: "", x: 0, y: 0, zoom: 1 };
  if (typeof v === "string") return { src: v, x: 0, y: 0, zoom: 1 };
  return {
    src: v.src || "",
    x: typeof v.x === "number" ? v.x : 0,
    y: typeof v.y === "number" ? v.y : 0,
    zoom: typeof v.zoom === "number" ? v.zoom : 1,
  };
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
