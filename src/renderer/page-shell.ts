import hyper from "@macrostrat/hyper";
import { DarkModeProvider } from "@macrostrat/ui-components";
import React from "react";
import { PageContextProvider } from "./page-context";
import { PageContext, PageStyle } from "./types";

import "~/styles/blueprint-core";
import "../styles/_theme.styl";
import "../styles/core.sass";
import "../styles/padding.css";

import styles from "./page-shell.module.sass";

const h = hyper.styled(styles);

export function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
  supportsDarkMode?: boolean;
}) {
  const { exports } = pageContext;
  const supportsDarkMode = exports?.supportsDarkMode || true;
  const pageStyle = exports?.pageStyle || "fullscreen";

  return h(
    PageContextProvider,
    { pageContext },
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
