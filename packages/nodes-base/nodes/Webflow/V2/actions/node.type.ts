import type { AllEntities } from 'glow-workflow';

type NodeMap = {
	item: 'create' | 'deleteItem' | 'get' | 'getAll' | 'update';
};

export type WebflowType = AllEntities<NodeMap>;
