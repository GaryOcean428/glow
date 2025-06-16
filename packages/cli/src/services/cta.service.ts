import type { User } from '@glow/db';
import { WorkflowStatisticsRepository } from '@glow/db';
import { Service } from '@glow/di';

@Service()
export class CtaService {
	constructor(private readonly workflowStatisticsRepository: WorkflowStatisticsRepository) {}

	async getBecomeCreatorCta(userId: User['id']) {
		// There need to be at least 3 workflows with at least 5 executions
		const numWfsWithOver5ProdExecutions =
			await this.workflowStatisticsRepository.queryNumWorkflowsUserHasWithFiveOrMoreProdExecs(
				userId,
			);

		return numWfsWithOver5ProdExecutions >= 3;
	}
}
