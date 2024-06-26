import hyper from "@macrostrat/hyper";
import { LegendItem, IntervalShort } from "./types";
import { LithologyTag } from "~/components";
import styles from "./main.module.sass";
import classNames from "classnames";
import { mergeAgeRanges } from "./prepare-data";

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
        h(IntervalField, {
          intervals: [legendItem.b_interval, legendItem.t_interval],
        }),
        h(DataField, {
          label: "Best age",
          value: `${legendItem.best_age_bottom} - ${legendItem.best_age_top}`,
          unit: "Ma",
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
  label?: string;
  value?: any;
  inline?: boolean;
  showIfEmpty?: boolean;
  className?: string;
  children?: any;
  unit?: string;
}) {
  if (!showIfEmpty && (value == null || value === "") && children == null) {
    return null;
  }

  return h("div.data-field", { className: classNames(className, { inline }) }, [
    h("div.label", label),
    h("div.data-container", [
      h.if(value != null)(Value, { value, unit }),
      children,
    ]),
  ]);
}

function IntervalField({ intervals }: { intervals: IntervalShort[] }) {
  const unique = uniqueIntervals(...intervals);
  const ageRange = mergeAgeRanges(unique.map((d) => [d.b_age, d.t_age]));
  return h([
    h(
      DataField,
      {
        label: "Intervals",
      },
      [
        unique.map((interval) => {
          return h(Interval, {
            key: interval.id,
            interval,
            showAgeRange: true,
          });
        }),
        h(Value, { unit: "Ma", value: `${ageRange[0]} - ${ageRange[1]}` }),
      ]
    ),
  ]);
}

function Value({
  value,
  unit,
  children,
}: {
  value?: any;
  unit?: string;
  children?: any;
}) {
  const val = value ?? children;
  return h("span.value-container", [
    h("span.value", val),
    h.if(unit != null)([" ", h("span.unit", unit)]),
  ]);
}

function Interval({
  interval,
  showAgeRange = false,
}: {
  interval: IntervalShort;
  showAgeRange?: boolean;
}) {
  return h(LithologyTag, {
    data: interval,
  });
}

function uniqueIntervals(
  ...intervals: (IntervalShort | undefined)[]
): IntervalShort[] {
  const unique = new Map<number, IntervalShort>();
  for (const interval of intervals) {
    if (interval == null) continue;
    unique.set(interval.id, interval);
  }
  return Array.from(unique.values()).sort((a, b) => b.b_age - a.b_age);
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
