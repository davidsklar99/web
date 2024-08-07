import { DarkModeProvider } from "@macrostrat/ui-components";
import { ReactNode } from "react";

import { AuthProvider } from "~/_providers/auth";
import { usePageContext } from "vike-react/usePageContext";

import "~/styles/blueprint-core";
import "~/styles/_theme.styl";
import "~/styles/core.sass";
import "~/styles/padding.css";
//
import h from "./layout.module.sass";

export default function Layout({ children }: { children: ReactNode }) {
  const pageContext = usePageContext();
  const { exports = {}, config, user } = pageContext;
  const supportsDarkMode = true;
  const pageStyle = exports?.pageStyle ?? "fullscreen";

  return h(
    AuthProvider,
    { user }, // Prefer detailed user if available
    h(
      supportsDarkMode ? DarkModeProvider : NoOpDarkModeProvider,
      { followSystem: true },
      h("div.app-shell", { className: pageStyle + "-page" }, children)
    )
  );
}

function NoOpDarkModeProvider(props) {
  return props.children;
}
