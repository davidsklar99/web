import SectionEditor from "@macrostrat-web/section-editor-demo";
import { PatternProvider } from "~/_providers.client";
import h from "@macrostrat/hyper";

export function Page() {
  return h(PatternProvider, h(SectionEditor));
}
