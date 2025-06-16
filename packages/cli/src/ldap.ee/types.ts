import type { LdapConfig } from '@glow/constants';
import type { RunningMode } from '@glow/db';

import type { AuthenticatedRequest } from '@/requests';

export declare namespace LdapConfiguration {
	type Update = AuthenticatedRequest<{}, {}, LdapConfig, {}>;
	type Sync = AuthenticatedRequest<{}, {}, { type: RunningMode }, {}>;
	type GetSync = AuthenticatedRequest<{}, {}, {}, { page?: string; perPage?: string }>;
}
