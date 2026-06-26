import ModernTemplate from "./ModernTemplate";
import StylishTemplate from "./StylishTemplate";
import DoubleColumnTemplate from "./DoubleColumnTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CreativeSplitTemplate from "./CreativeSplitTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import BoldHeaderTemplate from "./BoldHeaderTemplate";
import TimelineTemplate from "./TimelineTemplate";
import ElegantTemplate from "./ElegantTemplate";
import PhotoSidebarTemplate from "./PhotoSidebarTemplate";
import PhotoHeaderTemplate from "./PhotoHeaderTemplate";
import PastelStudioTemplate from "./PastelStudioTemplate";
import MonogramSerifTemplate from "./MonogramSerifTemplate";
import CenteredProTemplate from "./CenteredProTemplate";
import CambridgeTemplate from "./CambridgeTemplate";
import GreenwichTemplate from "./GreenwichTemplate";
import ShoreditchTemplate from "./ShoreditchTemplate";

export const TEMPLATES = [
  { id: "photo-sidebar", name: "Photo Sidebar", tagline: "Round photo on dark sidebar.", defaultAccent: "#10b981", component: PhotoSidebarTemplate, hasPhoto: true },
  { id: "photo-header", name: "Photo Header", tagline: "Photo next to name in the header.", defaultAccent: "#3b82f6", component: PhotoHeaderTemplate, hasPhoto: true },
  { id: "modern", name: "Modern", tagline: "Dark sidebar with accent highlights.", defaultAccent: "#10b981", component: ModernTemplate },
  { id: "stylish", name: "Stylish", tagline: "Clean header with two-column body.", defaultAccent: "#06b6d4", component: StylishTemplate },
  { id: "double", name: "Double Column", tagline: "Balanced main + side layout.", defaultAccent: "#3b82f6", component: DoubleColumnTemplate },
  { id: "classic", name: "Classic", tagline: "Traditional serif, recruiter-friendly.", defaultAccent: "#111827", component: ClassicTemplate },
  { id: "minimal", name: "Minimal", tagline: "Lots of whitespace, light typography.", defaultAccent: "#6366f1", component: MinimalTemplate },
  { id: "creative", name: "Creative Split", tagline: "Bold colored sidebar.", defaultAccent: "#ec4899", component: CreativeSplitTemplate },
  { id: "executive", name: "Executive Suite", tagline: "Dark commanding header.", defaultAccent: "#f59e0b", component: ExecutiveTemplate },
  { id: "bold", name: "Bold Header", tagline: "Full-width colored masthead.", defaultAccent: "#ef4444", component: BoldHeaderTemplate },
  { id: "timeline", name: "Timeline", tagline: "Visual experience timeline.", defaultAccent: "#8b5cf6", component: TimelineTemplate },
  { id: "elegant", name: "Elegant", tagline: "Centered serif, refined and formal.", defaultAccent: "#0ea5e9", component: ElegantTemplate },
  { id: "pastel-studio", name: "Pastel Studio", tagline: "Soft pastel sidebar with photo, designer feel.", defaultAccent: "#c2685a", component: PastelStudioTemplate, hasPhoto: true },
  { id: "monogram-serif", name: "Monogram Serif", tagline: "Initials in a circle, refined serif, includes references.", defaultAccent: "#6b6b6b", component: MonogramSerifTemplate, hasPhoto: true },
  { id: "centered-pro", name: "Centered Pro", tagline: "Clean centered name, contact strip, single column.", defaultAccent: "#0f8a8d", component: CenteredProTemplate },
  { id: "cambridge", name: "Cambridge", tagline: "Clinical/professional, refined single column.", defaultAccent: "#2b63c4", component: CambridgeTemplate },
  { id: "greenwich", name: "Greenwich", tagline: "Polished single column with soft bar headings.", defaultAccent: "#1a1a1a", component: GreenwichTemplate },
  { id: "shoreditch", name: "Shoreditch", tagline: "Bold designer split with copper accents.", defaultAccent: "#b07d4e", component: ShoreditchTemplate },
];
