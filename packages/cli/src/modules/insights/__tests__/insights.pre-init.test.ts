import type { InstanceType } from '@glow/constants';
import { mock } from 'jest-mock-extended';
import type { InstanceSettings } from 'glow-core';

import type { ModulePreInitContext } from '@/modules/modules.config';

import { shouldLoadModule } from '../insights.pre-init';

describe('InsightsModulePreInit', () => {
	it('should return false if instance type is worker', () => {
		const ctx: ModulePreInitContext = {
			instance: mock<InstanceSettings>({ instanceType: 'worker' }),
		};
		expect(shouldLoadModule(ctx)).toBe(false);
	});

	it.each<InstanceType>(['main', 'webhook'])(
		'should return true if instance type is "%s"',
		(instanceType) => {
			const ctx: ModulePreInitContext = {
				instance: mock<InstanceSettings>({ instanceType }),
			};
			expect(shouldLoadModule(ctx)).toBe(true);
		},
	);
});
