import { Container } from '@glow/di';
import type { SSHTunnelFunctions } from 'glow-workflow';

import { SSHClientsManager } from '../../ssh-clients-manager';

export const getSSHTunnelFunctions = (): SSHTunnelFunctions => {
	const sshClientsManager = Container.get(SSHClientsManager);
	return {
		getSSHClient: async (credentials) => await sshClientsManager.getClient(credentials),
	};
};
