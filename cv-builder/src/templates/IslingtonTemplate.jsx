import UnifiedResumeBase from "./UnifiedResumeBase";

// Islington — teal-slate palette, the "default" of the unified system.
// Corporate, cool, contemporary.
const PALETTE = {
  ink: "#12303c",
  body: "#24414d",
  band: "#e9f0f1",
  accent: "#2b7ba3",
  rule: "#b9cbd0",
};

export default function IslingtonTemplate(props) {
  return <UnifiedResumeBase {...props} palette={PALETTE} />;
}
