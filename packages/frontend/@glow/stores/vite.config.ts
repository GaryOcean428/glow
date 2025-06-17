import { defineConfig, mergeConfig } from 'vite';
import { vitestConfig } from '@glow/vitest-config/frontend';

export default mergeConfig(defineConfig({}), vitestConfig);
