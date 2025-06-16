import type { SamlPreferences } from '@glow/api-types';

export type SamlLoginBinding = SamlPreferences['loginBinding'];
export type SamlAttributeMapping = NonNullable<SamlPreferences['mapping']>;
export type SamlUserAttributes = SamlAttributeMapping;
