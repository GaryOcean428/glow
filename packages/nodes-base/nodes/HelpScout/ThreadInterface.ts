import type { IDataObject } from 'glow-workflow';

export interface IAttachment {
	fileName?: string;
	mimeType?: string;
	data?: string;
}

export interface IThread {
	createdAt?: string;
	customer?: IDataObject;
	imported?: boolean;
	text?: string;
	attachments?: IAttachment[];
}
