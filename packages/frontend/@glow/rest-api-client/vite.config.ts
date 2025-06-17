import { defineConfig, mergeConfig } from 'vite';
import { createVitestConfig } from '@glow/vitest-config/frontend';

export default mergeConfig(defineConfig({}), createVitestConfig({ setupFiles: [] }));
