import { Logger } from '@glow/backend-common';
import { GlobalConfig } from '@glow/config';
import { WorkflowRepository } from '@glow/db';
import { Service } from '@glow/di';
import { ErrorReporter } from 'glow-core';
import type { IDataObject, Workflow } from 'glow-workflow';

import { isWorkflowIdValid } from '@/utils';

@Service()
export class WorkflowStaticDataService {
	constructor(
		private readonly globalConfig: GlobalConfig,
		private readonly logger: Logger,
		private readonly errorReporter: ErrorReporter,
		private readonly workflowRepository: WorkflowRepository,
	) {}

	/** Returns the static data of workflow */
	async getStaticDataById(workflowId: string) {
		const workflowData = await this.workflowRepository.findOne({
			select: ['staticData'],
			where: { id: workflowId },
		});
		return workflowData?.staticData ?? {};
	}

	/** Saves the static data if it changed */
	async saveStaticData(workflow: Workflow): Promise<void> {
		if (workflow.staticData.__dataChanged === true) {
			// Static data of workflow changed and so has to be saved
			if (isWorkflowIdValid(workflow.id)) {
				// Workflow is saved so update in database
				try {
					await this.saveStaticDataById(workflow.id, workflow.staticData);
					workflow.staticData.__dataChanged = false;
				} catch (error) {
					this.errorReporter.error(error);
					this.logger.error(
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						`There was a problem saving the workflow with id "${workflow.id}" to save changed Data: "${error.message}"`,
						{ workflowId: workflow.id },
					);
				}
			}
		}
	}

	/** Saves the given static data on workflow */
	async saveStaticDataById(workflowId: string, newStaticData: IDataObject): Promise<void> {
		const qb = this.workflowRepository.createQueryBuilder('workflow');
		await qb
			.update()
			.set({
				staticData: newStaticData,
				updatedAt: () => {
					if (['mysqldb', 'mariadb'].includes(this.globalConfig.database.type)) {
						return 'updatedAt';
					}
					return '"updatedAt"';
				},
			})
			.where('id = :id', { id: workflowId })
			.execute();
	}
}
