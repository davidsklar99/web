import hyper from "@macrostrat/hyper";
import { Alignment } from "@blueprintjs/core";
import styles from "./docs.module.styl";
import { useInView } from "react-intersection-observer";
import { HashLink } from "react-router-hash-link";
import { routerBasename } from "../Settings";
import classNames from "classnames";

const h = hyper.styled(styles);

const urlBase = "https://macrostrat-media.s3.amazonaws.com/maps/docs/";

function DocsMediaFile({ href, lazy = true, className }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  let src = null;
  if (inView || !lazy) {
    src = joinURL(urlBase, href);
  }
  if (href.endsWith(".mp4")) {
    return h("video", {
      ref,
      autoPlay: true,
      loop: true,
      playsInline: true,
      muted: true,
      type: "video/mp4",
      src,
      className,
    });
  }
  return h("img", {
    ref,
    src,
    className,
  });
}

export function DocsMedia({
  children,
  width,
  alignment = Alignment.RIGHT,
  ...rest
}) {
  const className = classNames(alignment, {
    captioned: children != null,
  });
  return h("figure.documentation-figure", { style: { width }, className }, [
    h(DocsMediaFile, rest),
    h.if(children != null)("figcaption.caption", children),
  ]);
}

export function DocsVideo({ slug, lazy = true, className }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  let src = null;
  if (inView || !lazy) {
    src = `https://macrostrat-media.s3.amazonaws.com/maps/docs/${slug}.mp4`;
  }

  return h("video.documentation-video-standalone", {
    ref,
    autoPlay: true,
    loop: true,
    playsInline: true,
    muted: true,
    type: "video/mp4",
    src,
    className,
  });
}

function joinURL(...args) {
  let newURL = args[0];
  for (let i = 1; i < args.length; i++) {
    newURL = newURL.replace(/\/$/, "") + "/" + args[i].replace(/^\//, "");
  }
  return newURL;
}

export function InternalLink({ to, children }) {
  // We'd use a link component, but it doesn't properly navigate to the hash state
  return h(
    "a.internal-link",
    {
      href: joinURL(routerBasename, to),
    },
    children
  );
}

export function NewSwatch({ children, version = 0 }) {
  return h(
    HashLink,
    {
      to: routerBasename + `changelog#version-${version}`,
      className: "new-swatch",
    },
    children
  );
}

export function Version({ spec, date }) {
  return h("h2.version", { id: `version-${spec}` }, [
    h("span.version-name", ["Version ", h("code", spec)]),
    h("span.date", date),
  ]);
}
