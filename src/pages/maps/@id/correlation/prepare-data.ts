import { LegendItem, IntervalShort, CorrelationItem, AgeRange } from "./types";

export function buildCorrelationChartData(
  legendData: LegendItem[]
): CorrelationItem[] {
  /** Build the data for a correlation chart */
  if (legendData == null) {
    return [];
  }

  let data1 = legendData.map((d, i) => {
    return {
      details: d,
      id: d.legend_id,
      ageRange: mergeAgeRanges([
        getAgeRangeForInterval(d.b_interval),
        getAgeRangeForInterval(d.t_interval),
      ]),
      frequency: i,
      color: d.color,
    };
  });

  return data1.sort((a, b) => intervalComparison(a.ageRange, b.ageRange));
}

function getAgeRangeForInterval(interval: IntervalShort): AgeRange | null {
  /** Get the age range for an interval, building up an index as we go */
  return [interval.b_age, interval.t_age];
}

enum MergeMode {
  Inner,
  Outer,
}

export function mergeAgeRanges(
  ranges: AgeRange[],
  mergeMode: MergeMode = MergeMode.Outer
): AgeRange {
  /** Merge a set of age ranges to get the inner or outer bounds */
  let min = Infinity;
  let max = 0;
  // Negative ages are not handled

  if (mergeMode === MergeMode.Inner) {
    min = Math.min(...ranges.map((d) => d[0]));
    max = Math.max(...ranges.map((d) => d[1]));
  } else {
    min = Math.max(...ranges.map((d) => d[0]));
    max = Math.min(...ranges.map((d) => d[1]));
  }

  // Age ranges should start with the oldest (largest) age
  if (min < max) {
    return [max, min];
  }
  return [min, max];
}

function midpointAge(range: [number, number]) {
  return (range[0] + range[1]) / 2;
}

enum AgeRangeRelationship {
  Disjoint,
  Contains,
  Contained,
  Identical,
}

function convertToForwardOrdinal(a: AgeRange): AgeRange {
  /** Age ranges are naturally expressed as [b_age, t_age] where
   * b_age is the older age and t_age is the younger age. This function
   * converts the age range to [min, max] where min is the oldest age,
   * expressed as negative numbers. This assists with intuitive ordering
   * in certain cases.
   */
  return [-a[0], -a[1]];
}

function compareAgeRanges(a: AgeRange, b: AgeRange): AgeRangeRelationship {
  const a1 = convertToForwardOrdinal(a);
  const b1 = convertToForwardOrdinal(b);
  /** Compare two age ranges */
  if (a1[0] > b1[1] || a1[1] < b1[0]) {
    return AgeRangeRelationship.Disjoint;
  }
  if (a1[0] === b1[0] && a1[1] === b1[1]) {
    return AgeRangeRelationship.Identical;
  }
  if (a1[0] <= b1[0] && a1[1] >= b1[1]) {
    return AgeRangeRelationship.Contains;
  }
  if (a1[0] >= b1[0] && a1[1] <= b1[1]) {
    return AgeRangeRelationship.Contained;
  }
}

function intervalComparison(a: AgeRange, b: AgeRange) {
  // If age range fully overlaps with another, put the wider one first
  return midpointAge(b) - midpointAge(a);
}
