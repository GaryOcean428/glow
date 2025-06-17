import { LicenseConfig } from '../configs/license.config';

describe('LicenseConfig', () => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(() => {
		originalEnv = { ...process.env };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('should enable all features when GLOW_FEATURE_FLAG_ALL is set to true', () => {
		process.env.GLOW_FEATURE_FLAG_ALL = 'true';
		
		const config = new LicenseConfig();
		
		expect(config.enableAllFeatures).toBe(true);
	});

	it('should not enable all features by default', () => {
		delete process.env.GLOW_FEATURE_FLAG_ALL;
		
		const config = new LicenseConfig();
		
		expect(config.enableAllFeatures).toBe(false);
	});

	it('should load activation key from environment', () => {
		process.env.GLOW_LICENSE_ACTIVATION_KEY = 'test-activation-key';
		
		const config = new LicenseConfig();
		
		expect(config.activationKey).toBe('test-activation-key');
	});

	it('should load certificate from environment', () => {
		process.env.GLOW_LICENSE_CERT = 'test-certificate';
		
		const config = new LicenseConfig();
		
		expect(config.cert).toBe('test-certificate');
	});

	it('should use default values when environment variables are not set', () => {
		delete process.env.GLOW_LICENSE_ACTIVATION_KEY;
		delete process.env.GLOW_LICENSE_CERT;
		delete process.env.GLOW_FEATURE_FLAG_ALL;
		
		const config = new LicenseConfig();
		
		expect(config.activationKey).toBe('');
		expect(config.cert).toBe('');
		expect(config.enableAllFeatures).toBe(false);
		expect(config.serverUrl).toBe('https://license.n8n.io/v1');
	});
});