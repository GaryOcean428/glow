import type { IWorkflowBase, JsonValue } from 'glow-workflow';

export interface AbstractEventPayload {
	[key: string]: JsonValue | IWorkflowBase | undefined;
}
