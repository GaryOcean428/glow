import type {
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	JsonObject,
} from 'glow-workflow';
import { NodeApiError } from 'glow-workflow';

export async function sendErrorPostReceive(
	this: IExecuteSingleFunctions,
	data: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (String(response.statusCode).startsWith('4') || String(response.statusCode).startsWith('5')) {
		throw new NodeApiError(this.getNode(), response as unknown as JsonObject);
	}
	return data;
}
