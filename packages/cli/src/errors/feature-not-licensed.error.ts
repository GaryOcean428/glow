import type { LICENSE_FEATURES } from '@glow/constants';
import { UserError } from 'glow-workflow';

export class FeatureNotLicensedError extends UserError {
	constructor(feature: (typeof LICENSE_FEATURES)[keyof typeof LICENSE_FEATURES]) {
		super(
			`Your license does not allow for ${feature}. To enable ${feature}, please upgrade to a license that supports this feature.`,
			{ level: 'warning' },
		);
	}
}
