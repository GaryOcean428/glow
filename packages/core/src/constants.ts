export const CUSTOM_EXTENSION_ENV = 'GLOW_CUSTOM_EXTENSIONS';
export const PLACEHOLDER_EMPTY_EXECUTION_ID = '__UNKNOWN__';
export const PLACEHOLDER_EMPTY_WORKFLOW_ID = '__EMPTY__';
export const HTTP_REQUEST_NODE_TYPE = 'n8n-nodes-base.httpRequest';
export const HTTP_REQUEST_AS_TOOL_NODE_TYPE = 'n8n-nodes-base.httpRequestTool';
export const HTTP_REQUEST_TOOL_NODE_TYPE = '@n8n/n8n-nodes-langchain.toolHttpRequest';

export const RESTRICT_FILE_ACCESS_TO = 'GLOW_RESTRICT_FILE_ACCESS_TO';
export const BLOCK_FILE_ACCESS_TO_GLOW_FILES = 'GLOW_BLOCK_FILE_ACCESS_TO_GLOW_FILES';
export const CONFIG_FILES = 'GLOW_CONFIG_FILES';
export const BINARY_DATA_STORAGE_PATH = 'GLOW_BINARY_DATA_STORAGE_PATH';
export const UM_EMAIL_TEMPLATES_INVITE = 'GLOW_UM_EMAIL_TEMPLATES_INVITE';
export const UM_EMAIL_TEMPLATES_PWRESET = 'GLOW_UM_EMAIL_TEMPLATES_PWRESET';

export const CREDENTIAL_ERRORS = {
	NO_DATA: 'No data is set on this credentials.',
	DECRYPTION_FAILED:
		'Credentials could not be decrypted. The likely reason is that a different "encryptionKey" was used to encrypt the data.',
	INVALID_JSON: 'Decrypted credentials data is not valid JSON.',
	INVALID_DATA: 'Credentials data is not in a valid format.',
};
