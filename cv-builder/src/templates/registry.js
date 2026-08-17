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
import WestminsterTemplate from "./WestminsterTemplate";
import BristolTemplate from "./BristolTemplate";
import EdinburghTemplate from "./EdinburghTemplate";
import WindsorTemplate from "./WindsorTemplate";
import YorkTemplate from "./YorkTemplate";
import MayfairTemplate from "./MayfairTemplate";
import ManchesterTemplate from "./ManchesterTemplate";
import BathTemplate from "./BathTemplate";
import BrightonTemplate from "./BrightonTemplate";
import ChelseaTemplate from "./ChelseaTemplate";
import KensingtonTemplate from "./KensingtonTemplate";
import SohoTemplate from "./SohoTemplate";
import BelgraviaTemplate from "./BelgraviaTemplate";
import MaryleboneTemplate from "./MaryleboneTemplate";
import HampsteadTemplate from "./HampsteadTemplate";
import ChesterTemplate from "./ChesterTemplate";
import SalisburyTemplate from "./SalisburyTemplate";
import AscotTemplate from "./AscotTemplate";
import IslingtonTemplate from "./IslingtonTemplate";
import DulwichTemplate from "./DulwichTemplate";
import RichmondTemplate from "./RichmondTemplate";
import NottingTemplate from "./NottingTemplate";
import FulhamTemplate from "./FulhamTemplate";
import ChiswickTemplate from "./ChiswickTemplate";
import HighgateTemplate from "./HighgateTemplate";
import CamdenTemplate from "./CamdenTemplate";
import RegentTemplate from "./RegentTemplate";
import BarbicanTemplate from "./BarbicanTemplate";
import PimlicoTemplate from "./PimlicoTemplate";
import KewTemplate from "./KewTemplate";
import ClaphamTemplate from "./ClaphamTemplate";
import BatterseaTemplate from "./BatterseaTemplate";
import HamptonTemplate from "./HamptonTemplate";
import EalingTemplate from "./EalingTemplate";
import PeckhamTemplate from "./PeckhamTemplate";
import HackneyTemplate from "./HackneyTemplate";

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
  { id: "pastel-studio", name: "Pastel Studio", tagline: "Soft pastel sidebar, full-width header, designer feel.", defaultAccent: "#c2685a", component: PastelStudioTemplate },
  { id: "monogram-serif", name: "Monogram Serif", tagline: "Refined serif header, sidebar layout, includes references.", defaultAccent: "#5b5048", component: MonogramSerifTemplate },
  { id: "centered-pro", name: "Centered Pro", tagline: "Clean centered name, contact strip, single column.", defaultAccent: "#0f8a8d", component: CenteredProTemplate },
  { id: "cambridge", name: "Cambridge", tagline: "Clinical/professional, refined single column.", defaultAccent: "#2b63c4", component: CambridgeTemplate },
  { id: "greenwich", name: "Greenwich", tagline: "Polished single column with soft bar headings.", defaultAccent: "#1a1a1a", component: GreenwichTemplate },
  { id: "shoreditch", name: "Shoreditch", tagline: "Bold designer split with copper accents.", defaultAccent: "#b07d4e", component: ShoreditchTemplate },
  { id: "westminster", name: "Westminster", tagline: "Formal navy + gold, two-column authority.", defaultAccent: "#0f1f4b", component: WestminsterTemplate },
  { id: "bristol", name: "Bristol", tagline: "Orange-accent single column, boxed contact.", defaultAccent: "#ea4b25", component: BristolTemplate },
  { id: "edinburgh", name: "Edinburgh", tagline: "Blue block header, elegant rule headings.", defaultAccent: "#1a52c4", component: EdinburghTemplate },
  { id: "windsor", name: "Windsor", tagline: "Prestigious brown block header, classic two-column.", defaultAccent: "#8b4c10", component: WindsorTemplate },
  { id: "york", name: "York", tagline: "Cream background, Cormorant serif, timeline dots.", defaultAccent: "#7a4a21", component: YorkTemplate },
  { id: "mayfair", name: "Mayfair", tagline: "Playfair name, red-orange accents, executive feel.", defaultAccent: "#e8481c", component: MayfairTemplate },
  { id: "manchester", name: "Manchester", tagline: "Navy header, corporate accounting resume.", defaultAccent: "#123047", component: ManchesterTemplate },
  { id: "bath", name: "Bath", tagline: "Cream sidebar, rule-bordered contact bar.", defaultAccent: "#2b2b2b", component: BathTemplate },
  { id: "brighton", name: "Brighton", tagline: "Vibrant gradient header, Playfair name.", defaultAccent: "#a24bd6", component: BrightonTemplate },
  { id: "chelsea", name: "Chelsea", tagline: "Cyan header, timeline dots, blue footer.", defaultAccent: "#25a8e0", component: ChelseaTemplate },
  { id: "kensington", name: "Kensington", tagline: "Wide-spaced name, dusty purple sidebar.", defaultAccent: "#6b6f9e", component: KensingtonTemplate },
  { id: "soho", name: "Soho", tagline: "Stacked name, dark sidebar with cyan icons.", defaultAccent: "#25a8e0", component: SohoTemplate },
  { id: "belgravia", name: "Belgravia", tagline: "Minimal two-column, gold surname, rule-divided bands.", defaultAccent: "#c8a02e", component: BelgraviaTemplate },
  { id: "marylebone", name: "Marylebone", tagline: "Blue-highlight name, icon contacts, dark footer bar.", defaultAccent: "#1c2b3a", component: MaryleboneTemplate },
  { id: "hampstead", name: "Hampstead", tagline: "Espresso sidebar, skill bars, tan timeline.", defaultAccent: "#3d2b20", component: HampsteadTemplate },
  { id: "chester", name: "Chester", tagline: "Classic navy + serif, bordered header card.", defaultAccent: "#2f5c8f", component: ChesterTemplate },
  { id: "salisbury", name: "Salisbury", tagline: "Minimal beige, dark icon pills, timeline dates.", defaultAccent: "#2b2b2b", component: SalisburyTemplate },
  { id: "ascot", name: "Ascot", tagline: "Bold consultant, lavender panel, chip badges.", defaultAccent: "#2a2a3f", component: AscotTemplate },
  { id: "islington", name: "Islington", tagline: "Barlow navy executive, band header, section markers.", defaultAccent: "#2b7ba3", component: IslingtonTemplate },
  { id: "dulwich", name: "Dulwich", tagline: "Oswald teal on cream, bordered overlapping sidebar.", defaultAccent: "#3a7ca5", component: DulwichTemplate },
  { id: "richmond", name: "Richmond", tagline: "Oswald monochrome, double border, dark contact spill.", defaultAccent: "#1c1c1c", component: RichmondTemplate },
  { id: "notting", name: "Notting", tagline: "Warm beige Playfair header, dark icon contacts, skill bars.", defaultAccent: "#1a1a1a", component: NottingTemplate },
  { id: "fulham", name: "Fulham", tagline: "Mint accent bar, callout brief, green-dot timeline.", defaultAccent: "#2f9e5f", component: FulhamTemplate },
  { id: "chiswick", name: "Chiswick", tagline: "Minimal monochrome, split name, bordered role box.", defaultAccent: "#222222", component: ChiswickTemplate },
  { id: "highgate", name: "Highgate", tagline: "Grey chevron bars for role and dates, timeline experience.", defaultAccent: "#59595b", component: HighgateTemplate },
  { id: "camden", name: "Camden", tagline: "Grey header, dark-circle icons, timeline with rating bars.", defaultAccent: "#1c1c1c", component: CamdenTemplate },
  { id: "regent", name: "Regent", tagline: "Bold navy top block with yellow accents, split name.", defaultAccent: "#0b1533", component: RegentTemplate },
  { id: "barbican", name: "Barbican", tagline: "Navy header with cream-gold name, sidebar + timeline main.", defaultAccent: "#1a4d7a", component: BarbicanTemplate },
  { id: "pimlico", name: "Pimlico", tagline: "Minimal Jost, centered name, rule-divided label rows.", defaultAccent: "#111111", component: PimlicoTemplate },
  { id: "kew", name: "Kew", tagline: "Cream editorial with circle header and double top rules.", defaultAccent: "#111111", component: KewTemplate },
  { id: "clapham", name: "Clapham", tagline: "Navy top-stripe, pill-tag skills, corporate sidebar.", defaultAccent: "#3b6fe3", component: ClaphamTemplate },
  { id: "battersea", name: "Battersea", tagline: "Pale blue with soft circles, navy pill headings.", defaultAccent: "#2471a4", component: BatterseaTemplate },
  { id: "hampton", name: "Hampton", tagline: "Warm cream + tan, tracked Lora serif in burnt orange.", defaultAccent: "#b26e1c", component: HamptonTemplate },
  { id: "ealing", name: "Ealing", tagline: "Cream page with soft-beige circles, navy Montserrat rules.", defaultAccent: "#2f4d6e", component: EalingTemplate },
  { id: "peckham", name: "Peckham", tagline: "Bordered-card look with red dots, Playfair pill titles.", defaultAccent: "#d5104f", component: PeckhamTemplate },
  { id: "hackney", name: "Hackney", tagline: "Bold stacked Archivo name, rotated dates, blue skill bars.", defaultAccent: "#2360c0", component: HackneyTemplate },
];
