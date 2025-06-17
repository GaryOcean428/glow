import type {
	AiAskRequestDto,
	AiApplySuggestionRequestDto,
	AiChatRequestDto,
} from '@glow/api-types';
import type { GlobalConfig } from '@glow/config';
import { AiAssistantClient, type AiAssistantSDK } from '@n8n_io/ai-assistant-sdk';
import { mock } from 'jest-mock-extended';
import type { IUser } from 'glow-workflow';

import { GLOW_VERSION } from '@/constants';
import type { License } from '@/license';

import { AiService } from '../ai.service';

jest.mock('@n8n_io/ai-assistant-sdk', () => ({
	AiAssistantClient: jest.fn(),
}));

describe('AiService', () => {
	let aiService: AiService;

	const baseUrl = 'https://ai-assistant-url.com';
	const user = mock<IUser>({ id: 'user123' });
	const client = mock<AiAssistantClient>();
	const license = mock<License>();
	const globalConfig = mock<GlobalConfig>({
		logging: { level: 'info' },
		aiAssistant: { baseUrl },
	});

	beforeEach(() => {
		jest.clearAllMocks();
		(AiAssistantClient as jest.Mock).mockImplementation(() => client);
		aiService = new AiService(license, globalConfig);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('init', () => {
		it('should not initialize client if AI assistant is not enabled', async () => {
			license.isAiAssistantEnabled.mockReturnValue(false);

			await aiService.init();

			expect(AiAssistantClient).not.toHaveBeenCalled();
		});

		it('should initialize client when AI assistant is enabled', async () => {
			license.isAiAssistantEnabled.mockReturnValue(true);
			license.loadCertStr.mockResolvedValue('mock-license-cert');
			license.getConsumerId.mockReturnValue('mock-consumer-id');

			await aiService.init();

			expect(AiAssistantClient).toHaveBeenCalledWith({
				licenseCert: 'mock-license-cert',
				consumerId: 'mock-consumer-id',
				n8nVersion: GLOW_VERSION,
				baseUrl,
				logLevel: 'info',
			});
		});

		it('should not initialize client when baseUrl is empty', async () => {
			// Create a service instance with empty baseUrl
			const emptyBaseUrlConfig = mock<GlobalConfig>({
				logging: { level: 'info' },
				aiAssistant: { baseUrl: '' },
			});
			const serviceWithEmptyUrl = new AiService(license, emptyBaseUrlConfig);

			license.isAiAssistantEnabled.mockReturnValue(true);
			license.loadCertStr.mockResolvedValue('mock-license-cert');
			license.getConsumerId.mockReturnValue('mock-consumer-id');

			await serviceWithEmptyUrl.init();

			expect(AiAssistantClient).not.toHaveBeenCalled();
		});

		it('should not initialize client when baseUrl is invalid', async () => {
			// Create a service instance with invalid baseUrl
			const invalidBaseUrlConfig = mock<GlobalConfig>({
				logging: { level: 'info' },
				aiAssistant: { baseUrl: 'invalid-url' },
			});
			const serviceWithInvalidUrl = new AiService(license, invalidBaseUrlConfig);

			license.isAiAssistantEnabled.mockReturnValue(true);
			license.loadCertStr.mockResolvedValue('mock-license-cert');
			license.getConsumerId.mockReturnValue('mock-consumer-id');

			await serviceWithInvalidUrl.init();

			expect(AiAssistantClient).not.toHaveBeenCalled();
		});
	});

	describe('chat', () => {
		const payload = mock<AiChatRequestDto>();

		it('should call client chat method after initialization', async () => {
			license.isAiAssistantEnabled.mockReturnValue(true);
			const clientResponse = mock<Response>();
			client.chat.mockResolvedValue(clientResponse);

			const result = await aiService.chat(payload, user);

			expect(client.chat).toHaveBeenCalledWith(payload, { id: user.id });
			expect(result).toEqual(clientResponse);
		});

		it('should throw descriptive error when AI assistant is not enabled', async () => {
			license.isAiAssistantEnabled.mockReturnValue(false);

			await expect(aiService.chat(payload, user)).rejects.toThrow(
				'AI Assistant is not enabled. Please check your license configuration.',
			);
		});

		it('should throw descriptive error when baseUrl is empty', async () => {
			const emptyBaseUrlConfig = mock<GlobalConfig>({
				logging: { level: 'info' },
				aiAssistant: { baseUrl: '' },
			});
			const serviceWithEmptyUrl = new AiService(license, emptyBaseUrlConfig);

			license.isAiAssistantEnabled.mockReturnValue(true);

			await expect(serviceWithEmptyUrl.chat(payload, user)).rejects.toThrow(
				'AI Assistant is not configured. Please set the GLOW_AI_ASSISTANT_BASE_URL environment variable.',
			);
		});

		it('should throw descriptive error when baseUrl is invalid', async () => {
			const invalidBaseUrlConfig = mock<GlobalConfig>({
				logging: { level: 'info' },
				aiAssistant: { baseUrl: 'invalid-url' },
			});
			const serviceWithInvalidUrl = new AiService(license, invalidBaseUrlConfig);

			license.isAiAssistantEnabled.mockReturnValue(true);

			await expect(serviceWithInvalidUrl.chat(payload, user)).rejects.toThrow(
				'AI Assistant base URL is invalid: "invalid-url". Please provide a valid HTTP or HTTPS URL.',
			);
		});
	});

	describe('applySuggestion', () => {
		const payload = mock<AiApplySuggestionRequestDto>();

		it('should call client applySuggestion', async () => {
			license.isAiAssistantEnabled.mockReturnValue(true);
			const clientResponse = mock<AiAssistantSDK.ApplySuggestionResponse>();
			client.applySuggestion.mockResolvedValue(clientResponse);

			const result = await aiService.applySuggestion(payload, user);

			expect(client.applySuggestion).toHaveBeenCalledWith(payload, { id: user.id });
			expect(result).toEqual(clientResponse);
		});

		it('should throw descriptive error when AI assistant is not enabled', async () => {
			license.isAiAssistantEnabled.mockReturnValue(false);

			await expect(aiService.applySuggestion(payload, user)).rejects.toThrow(
				'AI Assistant is not enabled. Please check your license configuration.',
			);
		});
	});

	describe('askAi', () => {
		const payload = mock<AiAskRequestDto>();

		it('should call client askAi method after initialization', async () => {
			license.isAiAssistantEnabled.mockReturnValue(true);
			const clientResponse = mock<AiAssistantSDK.AskAiResponsePayload>();
			client.askAi.mockResolvedValue(clientResponse);

			const result = await aiService.askAi(payload, user);

			expect(client.askAi).toHaveBeenCalledWith(payload, { id: user.id });
			expect(result).toEqual(clientResponse);
		});

		it('should throw descriptive error when AI assistant is not enabled', async () => {
			license.isAiAssistantEnabled.mockReturnValue(false);

			await expect(aiService.askAi(payload, user)).rejects.toThrow(
				'AI Assistant is not enabled. Please check your license configuration.',
			);
		});
	});

	describe('URL validation', () => {
		it('should validate valid HTTP URLs', async () => {
			const httpConfig = mock<GlobalConfig>({
				logging: { level: 'info' },
				aiAssistant: { baseUrl: 'http://example.com' },
			});
			const serviceWithHttpUrl = new AiService(license, httpConfig);

			license.isAiAssistantEnabled.mockReturnValue(true);
			license.loadCertStr.mockResolvedValue('mock-license-cert');
			license.getConsumerId.mockReturnValue('mock-consumer-id');

			await serviceWithHttpUrl.init();

			expect(AiAssistantClient).toHaveBeenCalledWith({
				licenseCert: 'mock-license-cert',
				consumerId: 'mock-consumer-id',
				n8nVersion: GLOW_VERSION,
				baseUrl: 'http://example.com',
				logLevel: 'info',
			});
		});

		it('should validate valid HTTPS URLs', async () => {
			const httpsConfig = mock<GlobalConfig>({
				logging: { level: 'info' },
				aiAssistant: { baseUrl: 'https://example.com' },
			});
			const serviceWithHttpsUrl = new AiService(license, httpsConfig);

			license.isAiAssistantEnabled.mockReturnValue(true);
			license.loadCertStr.mockResolvedValue('mock-license-cert');
			license.getConsumerId.mockReturnValue('mock-consumer-id');

			await serviceWithHttpsUrl.init();

			expect(AiAssistantClient).toHaveBeenCalledWith({
				licenseCert: 'mock-license-cert',
				consumerId: 'mock-consumer-id',
				n8nVersion: GLOW_VERSION,
				baseUrl: 'https://example.com',
				logLevel: 'info',
			});
		});

		it('should reject URLs with unsupported protocols', async () => {
			const ftpConfig = mock<GlobalConfig>({
				logging: { level: 'info' },
				aiAssistant: { baseUrl: 'ftp://example.com' },
			});
			const serviceWithFtpUrl = new AiService(license, ftpConfig);

			license.isAiAssistantEnabled.mockReturnValue(true);
			license.loadCertStr.mockResolvedValue('mock-license-cert');
			license.getConsumerId.mockReturnValue('mock-consumer-id');

			await serviceWithFtpUrl.init();

			expect(AiAssistantClient).not.toHaveBeenCalled();
		});
	});
});
