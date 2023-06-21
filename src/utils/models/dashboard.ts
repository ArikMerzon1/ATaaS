export interface DashboardCubeFilter {
  type?: ChartType;
  area?: string | null;
  measures?: string[];
  dimensions?: string[];
  segments?: string;
  timeDimension?: string;
  pivotConfig?: PivotConfig;
  limit?: number;
  orderMembers?: TOrderMember[];
}

export type PivotConfig = {
  /**
   * Dimensions to put on **x** or **rows** axis.
   */
  x?: string[];
  /**
   * Dimensions to put on **y** or **columns** axis.
   */
  y?: string[];
  /**
   * If `true` missing dates on the time dimensions will be filled with `0` for all measures.Note: the `fillMissingDates` option set to `true` will override any **order** applied to the query
   */
  fillMissingDates?: boolean | null;
  /**
   * Give each series a prefix alias. Should have one entry for each query:measure. See [chartPivot](#result-set-chart-pivot)
   */
  aliasSeries?: string[];
};

export interface Measure {
  aggType?: string;
  cumulative?: boolean;
  cumulativeTotal?: false;
  drillMembers?: [];
  drillMembersGrouped?: Record<string, unknown>;
  isVisible?: boolean;
  name: string;
  shortTitle?: string;
  title?: string;
  type?: string;
}

export interface Segment {
  isVisible?: boolean;
  name?: string;
  shortTitle?: string;
  title?: string;
}

export interface TimeDimension {
  isVisible?: boolean;
  name: string;
  shortTitle?: string;
  suggestFilterValues?: boolean;
  title: string;
  type?: string;
  granularity?: string;
  dimension?: string;
  dateRange?: string | [string, string];
}

export type TOrderMember = {
  id: string;
  title: string;
  order: QueryOrder | "none";
};

export type QueryOrder = "asc" | "desc";

export type ChartType = "line" | "bar" | "table" | "area" | "number" | "pie";
