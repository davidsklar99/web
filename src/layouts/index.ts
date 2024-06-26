import hyper from "@macrostrat/hyper";
import styles from "./main.module.sass";
import { Spinner } from "@blueprintjs/core";
import { usePageTransitionStore } from "~/renderer/transitions";
import classNames from "classnames";
import { PageBreadcrumbs } from "~/renderer";

const h = hyper.styled(styles);

export function BasePage({ children, className, fitViewport = false }) {
  const inPageTransition = usePageTransitionStore(
    (state) => state.inPageTransition
  );
  if (inPageTransition) {
    return h("div.page-transition", [h(Spinner)]);
  }

  return h(
    "div",
    {
      className: classNames(className, { "fit-viewport": fitViewport }),
    },
    children
  );
}

export function FullscreenPage({ children, className, ...rest }) {
  return h(
    BasePage,
    {
      className: classNames("fullscreen-page", className),
      fitViewport: true,
      ...rest,
    },
    children
  );
}

export function ContentPage({ children, className, ...rest }) {
  return h(
    BasePage,
    { className: classNames("content-page", className), ...rest },
    children
  );
}

export function DocumentationPage({ children, className, ...rest }) {
  return h(
    CenteredContentPage,
    { className: classNames("documentation-page", className), ...rest },
    h([h(PageBreadcrumbs), children])
  );
}

export function CenteredContentPage({ children, className }) {
  return h(
    ContentPage,
    { className: classNames("centered", className) },
    children
  );
}
