import { Service } from '@glow/di';
import { DataSource, Repository } from '@glow/typeorm';

import { WorkflowTagMapping } from '../entities';

@Service()
export class WorkflowTagMappingRepository extends Repository<WorkflowTagMapping> {
	constructor(dataSource: DataSource) {
		super(WorkflowTagMapping, dataSource.manager);
	}

	async overwriteTaggings(workflowId: string, tagIds: string[]) {
		return await this.manager.transaction(async (tx) => {
			await tx.delete(WorkflowTagMapping, { workflowId });

			const taggings = tagIds.map((tagId) => this.create({ workflowId, tagId }));

			return await tx.insert(WorkflowTagMapping, taggings);
		});
	}
}
