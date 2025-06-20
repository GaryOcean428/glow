import { Container } from '@glow/di';
import { UnexpectedError } from 'glow-workflow';

import { ModulesConfig } from '../modules.config';

describe('ModulesConfig', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		process.env = {};
		Container.reset();
	});

	it('should initialize with insights modules if no environment variable is set', () => {
		const config = Container.get(ModulesConfig);
		expect(config.modules).toEqual(['insights', 'external-secrets.ee']);
	});

	it('should parse valid module names from environment variable', () => {
		process.env.GLOW_ENABLED_MODULES = 'insights';
		const config = Container.get(ModulesConfig);
		expect(config.modules).toEqual(['insights', 'external-secrets.ee']);
	});

	it('should disable valid module names from environment variable', () => {
		process.env.GLOW_DISABLED_MODULES = 'insights';
		const config = Container.get(ModulesConfig);
		expect(config.modules).toEqual(['external-secrets.ee']);
	});

	it('should throw UnexpectedError for invalid module names', () => {
		process.env.GLOW_ENABLED_MODULES = 'invalidModule';
		expect(() => Container.get(ModulesConfig)).toThrow(UnexpectedError);
	});

	it('should throw UnexpectedError if any module is both enabled and disabled', () => {
		process.env.GLOW_ENABLED_MODULES = 'insights';
		process.env.GLOW_DISABLED_MODULES = 'insights';
		const config = Container.get(ModulesConfig);
		expect(() => config.modules).toThrow(UnexpectedError);
	});

	it('should throw UnexpectedError if any enabled module name is invalid', () => {
		process.env.GLOW_ENABLED_MODULES = 'insights,invalidModule';
		expect(() => Container.get(ModulesConfig)).toThrow(UnexpectedError);
	});

	it('should throw UnexpectedError if any disabled module name is invalid', () => {
		process.env.GLOW_DISABLED_MODULES = 'insights,invalidModule';
		expect(() => Container.get(ModulesConfig)).toThrow(UnexpectedError);
	});
});
