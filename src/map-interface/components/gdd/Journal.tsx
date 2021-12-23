import React from "react";
import Article from "./Article";
import { Divider } from "@blueprintjs/core";
import h from "@macrostrat/hyper";

function Journal(props) {
  return h("div.journal", [
    h("div.journal-title", [
      h("h2.journal-title-text", [
        props.data.name,
        h("small.journal-source", [props.data.source]),
      ]),
    ]),
    h(Divider),
    props.data.articles.map((article, i) => {
      return h(Article, { key: i, data: article });
    }),
  ]);
}

export default Journal;