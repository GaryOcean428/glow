import type { InsightsByTime, InsightsSummaryType, InsightsDateRange } from '@glow/api-types';

export type ChartProps = {
	data: InsightsByTime[];
	type: InsightsSummaryType;
	granularity: InsightsDateRange['granularity'];
};
