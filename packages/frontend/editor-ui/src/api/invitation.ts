import type { CurrentUserResponse, IInviteResponse, InvitableRoleName } from '@/Interface';
import type { IRestApiContext } from '@glow/rest-api-client';
import type { IDataObject } from 'glow-workflow';
import { makeRestApiRequest } from '@glow/rest-api-client';

type AcceptInvitationParams = {
	inviterId: string;
	inviteeId: string;
	firstName: string;
	lastName: string;
	password: string;
};

export async function inviteUsers(
	context: IRestApiContext,
	params: Array<{ email: string; role: InvitableRoleName }>,
) {
	return await makeRestApiRequest<IInviteResponse[]>(context, 'POST', '/invitations', params);
}

export async function acceptInvitation(context: IRestApiContext, params: AcceptInvitationParams) {
	const { inviteeId, ...props } = params;
	return await makeRestApiRequest<CurrentUserResponse>(
		context,
		'POST',
		`/invitations/${params.inviteeId}/accept`,
		props as unknown as IDataObject,
	);
}
