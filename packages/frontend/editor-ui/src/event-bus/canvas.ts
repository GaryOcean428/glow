import type { CanvasEventBusEvents } from '@/types';
import { createEventBus } from '@glow/utils/event-bus';

export const canvasEventBus = createEventBus<CanvasEventBusEvents>();
