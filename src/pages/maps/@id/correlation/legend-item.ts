import hyper from "@macrostrat/hyper";
import { LegendItem } from "./types";
import { LithologyTag } from "~/components";
import styles from "./main.module.sass";
import classNames from "classnames";

const h = hyper.styled(styles);

export function LegendItemInformation({
  legendItem,
}: {
  legendItem: LegendItem;
}) {
  return h("div.legend-panel-outer", [
    h("div.legend-info-panel", [
      h("header", [h("h3", legendItem.name), h("code", legendItem.legend_id)]),
      h("div.data", [
        h(DataField, {
          label: "Stratigraphic names",
          value: legendItem.strat_name,
        }),
        h(DataField, { label: "Age", value: legendItem.age }),
        h(DataField, {
          label: "Description",
          value: legendItem.descrip,
          inline: false,
        }),
        h(DataField, { label: "Comments", value: legendItem.comments }),
        h(DataField, { label: "Lithology", value: legendItem.lith }),
        h(LithologyList, { lithologies: legendItem.liths }),
        h(DataField, {
          label: "Linked intervals",
          value: `${legendItem.b_interval.b_age} - ${legendItem.t_interval.t_age}`,
        }),
        h(DataField, {
          label: "Best age",
          value: `${legendItem.best_age_bottom} - ${legendItem.best_age_top}`,
        }),
        h(DataField, { label: "Unit IDs", value: legendItem.unit_ids }),
        h(DataField, { label: "Concept IDs", value: legendItem.concept_ids }),
      ]),
    ]),
  ]);
}

function DataField({
  label,
  value,
  inline = true,
  showIfEmpty = false,
  className,
  children,
  unit,
}: {
  label: string;
  value?: any;
  inline?: boolean;
  showIfEmpty?: boolean;
  className?: string;
  children?: any;
  unit?: string;
}) {
  let val = value ?? children;

  if (!showIfEmpty && (val == null || val === "")) {
    return null;
  }

  return h("div.data-field", { className: classNames(className, { inline }) }, [
    h("span.label", label),
    h("span.value", val),
    h.if(unit != null)("span.unit", unit),
  ]);
}

function LithologyList({ lithologies }) {
  return h(
    DataField,
    { label: "Lithologies" },
    lithologies.map((lith) => {
      return h(LithologyTag, { data: lith });
    })
  );
}
