import { Service } from '@glow/di';

import { AbstractServer } from '@/abstract-server';

@Service()
export class WebhookServer extends AbstractServer {}
