import type { TagEntity, WorkflowTagMapping } from '@glow/db';

export type ExportableTags = { tags: TagEntity[]; mappings: WorkflowTagMapping[] };
