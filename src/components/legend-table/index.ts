import { Tag } from "@blueprintjs/core";
import hyper from "@macrostrat/hyper";
import styles from "./main.module.sass";
import { ColorCell } from "@macrostrat/data-sheet2";
import { LithologyTag } from "~/components";

const h = hyper.styled(styles);

export function LongTextViewer({ value, onChange }) {
  return h("div.long-text", value);
}

export function IntervalCell({ value, children, ...rest }) {
  return h(ColorCell, { value: value?.color, ...rest }, value?.name);
}

export function lithologyRenderer(value) {
  return h("span.liths", [
    addJoiner(value?.map((d) => h(LithologyTag, { data: d }))),
  ]);
}

export function ExpandedLithologies({ value, onChange }) {
  console.log(value);
  if (value == null) return h("div.basis-panel", "No lithologies");
  return h("div.basis-panel", [
    h("table", [
      h("thead", h("tr", [h("th", "Lithology"), h("th", "Source")])),
      h(
        "tbody",
        value.map((d) => {
          return h("tr", { key: d.id }, [
            h("td", h(LithologyTag, { data: d })),
            h(
              "td.basis-col",
              d.basis_col?.map((d) => {
                return h(Tag, { minimal: true, key: d }, [
                  h("span.tag-header", "Column"),
                  " ",
                  h("code", d),
                ]);
              })
            ),
          ]);
        })
      ),
    ]),
  ]);
}

function addJoiner(arr) {
  return arr?.reduce((acc, curr) => [acc, " ", curr]);
}
