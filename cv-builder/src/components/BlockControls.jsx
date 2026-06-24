import { useIsThumbnail } from "../templates/ThumbnailContext";

/**
 * Hover-revealed delete button on a block, and an "+ Add" button below the list.
 * In thumbnail mode (gallery cards) we omit the inner <button>s so we don't
 * nest a button inside the card's outer <button> wrapper.
 */
export function BlockWrap({ children, onDelete, className = "" }) {
  const isThumbnail = useIsThumbnail();
  return (
    <div className={`relative group ${className}`}>
      {children}
      {!isThumbnail && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="no-export absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition shadow"
          title="Delete this block"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function AddBlockButton({ onClick, label = "+ Add block" }) {
  const isThumbnail = useIsThumbnail();
  if (isThumbnail) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="no-export text-xs text-blue-600 hover:underline mb-2"
    >
      {label}
    </button>
  );
}

/* Factories for new empty blocks */
export const factories = {
  experience: () => ({
    title: "Job Title",
    company: "Company Name",
    date: "MM/YYYY - MM/YYYY",
    location: "City, Country",
    bullets: ["Describe your responsibility or achievement here."],
  }),
  education: () => ({
    degree: "Degree",
    school: "School / University",
    date: "MM/YYYY - MM/YYYY",
    location: "City, Country",
  }),
  achievement: () => ({
    title: "Achievement Title",
    text: "Brief description of the achievement and its impact.",
  }),
  course: () => ({
    title: "Course Title",
    text: "Short description of what the course covered.",
  }),
  language: () => ({ name: "Language", level: "Level" }),
  reference: () => ({ name: "Reference Name", role: "Role / Company", phone: "+44 20 0000 0000", email: "name@example.com" }),
};
