import type { TransferWorkflowBodyDto } from '@glow/api-types';
import type { IShareWorkflowsPayload, IWorkflowsShareResponse } from '@/Interface';
import type { IRestApiContext } from '@glow/rest-api-client';
import { makeRestApiRequest } from '@glow/rest-api-client';
import type { IDataObject } from 'glow-workflow';

export async function setWorkflowSharedWith(
	context: IRestApiContext,
	id: string,
	data: IShareWorkflowsPayload,
): Promise<IWorkflowsShareResponse> {
	return await makeRestApiRequest(
		context,
		'PUT',
		`/workflows/${id}/share`,
		data as unknown as IDataObject,
	);
}

export async function moveWorkflowToProject(
	context: IRestApiContext,
	id: string,
	body: TransferWorkflowBodyDto,
): Promise<void> {
	return await makeRestApiRequest(context, 'PUT', `/workflows/${id}/transfer`, body);
}

export async function moveFolderToProject(
	context: IRestApiContext,
	projectId: string,
	folderId: string,
	destinationProjectId: string,
	destinationParentFolderId?: string,
	shareCredentials?: string[],
): Promise<void> {
	return await makeRestApiRequest(
		context,
		'PUT',
		`/projects/${projectId}/folders/${folderId}/transfer`,
		{
			destinationProjectId,
			destinationParentFolderId: destinationParentFolderId ?? '0',
			shareCredentials,
		},
	);
}
