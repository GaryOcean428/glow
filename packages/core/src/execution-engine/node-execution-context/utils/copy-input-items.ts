import type { INodeExecutionData, IDataObject } from 'glow-workflow';
import { deepCopy } from 'glow-workflow';

/**
 * Returns a copy of the items which only contains the json data and
 * of that only the defined properties
 */
export function copyInputItems(items: INodeExecutionData[], properties: string[]): IDataObject[] {
	return items.map((item) => {
		const newItem: IDataObject = {};
		for (const property of properties) {
			if (item.json[property] === undefined) {
				newItem[property] = null;
			} else {
				newItem[property] = deepCopy(item.json[property]);
			}
		}
		return newItem;
	});
}
