export { render as onRenderHtml };
// See https://vike.dev/data-fetching

import h from "@macrostrat/hyper";
import ReactDOMServer from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vike/server";
import { PageShell } from "../renderer/page-shell";
import type { PageContextServer } from "../renderer/types";
import { buildPageMeta } from "~/_utils/page-meta";

async function render(pageContext: PageContextServer) {
  const { Page, pageProps, config, user, environment } = pageContext;
  // This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
  let pageHtml = "";
  if (Page != null) {
    pageHtml = ReactDOMServer.renderToString(
      h(PageShell, { pageContext, user }, h(Page, pageProps))
    );
  }

  const { clientRouting, isolateStyles = false } = config;

  if (isolateStyles && clientRouting) {
    throw new Error(
      "Isolating styles is not allowed when using client routing"
    );
  }

  /** Get runtime environment synthesized by server. This is a substitute for using
   * compile-time environment variables in the client. The environment is
   * injected into vite as a global variable.
   *
   * We also set `process.env.NODE_ENV` to "production" to allow Cesium to work properly.
   */
  const envScript = `<script>
    window.env = ${JSON.stringify(environment)};
    window.process = {env: {NODE_ENV: "production"}};
  </script>`;

  // This doesn't work in production
  // if (!isolateStyles || clientRouting) {
  //   await import("@blueprintjs/core/lib/css/blueprint.css");
  //   await import("~/styles/_theme.styl");
  //   await import("~/styles/core.sass");
  //   await import("~/styles/padding.css");
  // }

  // See https://vike.dev/head
  let { scripts = [] } = pageContext.exports;

  const scriptTags = scripts
    .map((src) => `<script src="${src}"></script>`)
    .join("\n");

  const { title, description } = buildPageMeta(pageContext);

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Language" content="en" />
        <meta name="mobile-wep-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Source+Sans+Pro"
          rel="stylesheet"
        />
        ${dangerouslySkipEscape(scriptTags)}
        ${dangerouslySkipEscape(envScript)}
        <meta name="description" content="${description}" />
        <title>${title}</title>
      </head>
      <body onload="document.body.style.visibility='visible'">
        <!-- Workaround for Firefox flash of unstyled content -->
        <script>document.body.style.visibility='hidden';</script>
        <div id="app-container">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    },
  };
}
