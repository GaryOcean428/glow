import type { IDataObject } from 'glow-workflow';

export interface IEmail {
	from?: string;
	to?: string;
	cc?: string;
	bcc?: string;
	replyTo?: string;
	inReplyTo?: string;
	reference?: string;
	subject: string;
	body: string;
	htmlBody?: string;
	attachments?: IDataObject[];
}
