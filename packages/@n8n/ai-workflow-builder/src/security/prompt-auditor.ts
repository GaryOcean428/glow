import { Logger } from '@n8n/backend-common';

export class PromptAuditor {
	private readonly logger: Logger;

	constructor() {
		this.logger = new Logger('PromptAuditor');
	}

	/**
	 * Audit a prompt for potential security issues and sanitize it
	 */
	auditAndSanitizePrompt(prompt: string): { sanitized: string; warnings: string[] } {
		const warnings: string[] = [];
		let sanitized = prompt;

		// Check for potential injection attempts
		const injectionPatterns = [
			/ignore\s+previous\s+instructions/i,
			/forget\s+all\s+previous\s+instructions/i,
			/system\s*:?\s*you\s+are\s+now/i,
			/\[\/INST\]/i,
			/<\s*\/?\s*system\s*>/i,
			/```\s*system/i,
			/assistant\s*:?\s*I\s+will\s+ignore/i,
		];

		for (const pattern of injectionPatterns) {
			if (pattern.test(prompt)) {
				warnings.push(`Potential prompt injection detected: ${pattern.source}`);
				// Replace suspicious patterns with harmless text
				sanitized = sanitized.replace(pattern, '[REMOVED_SUSPICIOUS_CONTENT]');
			}
		}

		// Check for excessive length (potential DOS)
		if (prompt.length > 10000) {
			warnings.push('Prompt exceeds maximum recommended length');
			sanitized = sanitized.substring(0, 10000) + '...[TRUNCATED]';
		}

		// Check for potential attempts to access system information
		const systemPatterns = [
			/process\s*\.\s*env/i,
			/\/etc\/passwd/i,
			/\.\.\/\.\.\//,
			/file\s*:\/\//i,
			/http[s]?:\/\/localhost/i,
		];

		for (const pattern of systemPatterns) {
			if (pattern.test(prompt)) {
				warnings.push(`Potential system access attempt detected: ${pattern.source}`);
				sanitized = sanitized.replace(pattern, '[REMOVED_SYSTEM_ACCESS]');
			}
		}

		// Log warnings for monitoring
		if (warnings.length > 0) {
			this.logger.warn('Prompt security audit found issues', { 
				warnings, 
				originalLength: prompt.length,
				sanitizedLength: sanitized.length 
			});
		}

		return { sanitized, warnings };
	}

	/**
	 * Validate that generated workflow JSON doesn't contain suspicious content
	 */
	auditWorkflowJson(workflowJson: object): { isSecure: boolean; warnings: string[] } {
		const warnings: string[] = [];
		const jsonString = JSON.stringify(workflowJson);

		// Check for potential code execution attempts
		const dangerousPatterns = [
			/eval\s*\(/i,
			/Function\s*\(/i,
			/require\s*\(/i,
			/import\s*\(/i,
			/process\s*\./i,
			/global\s*\./i,
			/__proto__/i,
			/constructor\s*\./i,
		];

		for (const pattern of dangerousPatterns) {
			if (pattern.test(jsonString)) {
				warnings.push(`Potentially dangerous code pattern detected: ${pattern.source}`);
			}
		}

		// Check for suspicious URLs
		const urlPattern = /https?:\/\/[^\s"']+/gi;
		const urls = jsonString.match(urlPattern) || [];
		
		for (const url of urls) {
			// Check for localhost or internal network addresses
			if (/localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\./i.test(url)) {
				warnings.push(`Suspicious internal URL detected: ${url}`);
			}
		}

		const isSecure = warnings.length === 0;

		if (!isSecure) {
			this.logger.warn('Workflow JSON security audit found issues', { warnings });
		}

		return { isSecure, warnings };
	}
}