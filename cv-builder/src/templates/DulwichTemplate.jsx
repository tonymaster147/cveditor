import UnifiedResumeBase from "./UnifiedResumeBase";

// Dulwich — warm sepia palette. Refined, classic, editorial.
const PALETTE = {
  ink: "#33302b",
  body: "#4a4237",
  band: "#f3f1ec",
  accent: "#8a6a3d",
  rule: "#d8d3c4",
};

export default function DulwichTemplate(props) {
  return <UnifiedResumeBase {...props} palette={PALETTE} />;
}
