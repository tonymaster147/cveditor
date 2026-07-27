import UnifiedResumeBase from "./UnifiedResumeBase";

// Richmond — forest green palette. Grounded, environmental, considered.
const PALETTE = {
  ink: "#1b3a2b",
  body: "#2b4a3b",
  band: "#eceef2",
  accent: "#3f6b4f",
  rule: "#c4c9d0",
};

export default function RichmondTemplate(props) {
  return <UnifiedResumeBase {...props} palette={PALETTE} />;
}
