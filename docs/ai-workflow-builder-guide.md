# n8n AI Workflow Builder Guide

This guide provides examples and best practices for using n8n's AI workflow builder with LLM integration and enterprise features.

## Environment Configuration

### Enabling All Enterprise Features
Set the following environment variable to enable all enterprise features by default (useful for development/testing):

```bash
N8N_FEATURE_FLAG_ALL=true
```

### AI LLM Configuration
Configure AI integration with one or both of these options:

#### Option 1: Direct API Keys
```bash
# OpenAI API Key (for simple tasks and fallback)
N8N_AI_OPENAI_API_KEY=sk-your-openai-api-key-here

# Anthropic API Key (for complex workflow generation)
N8N_AI_ANTHROPIC_KEY=sk-ant-your-anthropic-api-key-here
```

#### Option 2: AI Assistant Proxy (Enterprise)
```bash
# Use n8n's AI Assistant service
N8N_AI_ASSISTANT_BASE_URL=https://your-ai-assistant-proxy.com
```

### License Configuration
```bash
# License activation key
N8N_LICENSE_ACTIVATION_KEY=your-activation-key

# Or use certificate directly
N8N_LICENSE_CERT=your-license-certificate

# License server (optional, defaults to n8n's server)
N8N_LICENSE_SERVER_URL=https://license.n8n.io/v1
```

## Security Best Practices

### API Key Management
- **Never hardcode API keys** in configuration files or code
- Use environment variables or secure secret management systems
- Rotate API keys regularly
- Monitor API usage for unusual patterns

### LLM Prompt Security
The AI workflow builder includes built-in security auditing:

```typescript
// Automatic prompt sanitization detects and removes:
- Prompt injection attempts ("ignore previous instructions")
- System access attempts (file paths, localhost URLs)
- Excessive length prompts (DoS prevention)
- Suspicious code patterns in generated workflows
```

### Workflow Validation
Generated workflows are automatically audited for:
- Dangerous code execution patterns
- Suspicious URLs (localhost, internal networks)
- Potential security vulnerabilities

## Usage Examples

### Basic Workflow Generation
```typescript
// Example prompts that work well:
const examples = [
  "Create a workflow that sends a Slack message when a new row is added to Google Sheets",
  "I want to automatically save Gmail attachments to Dropbox", 
  "Build a workflow that posts new Twitter mentions to a Discord channel",
  "When I get a new lead in my CRM, add them to my email marketing list"
];
```

### Advanced Configuration
```javascript
// Custom node integration with AI
const customWorkflowBuilder = {
  // Use AI to generate workflow steps
  prompt: "Connect Salesforce to Mailchimp for lead synchronization",
  
  // AI will automatically:
  // 1. Validate the prompt for workflow intent
  // 2. Break down into logical steps
  // 3. Select appropriate n8n nodes
  // 4. Generate node configurations
  // 5. Create connections between nodes
  // 6. Audit for security issues
};
```

### Enterprise Features Integration
```typescript
// With N8N_FEATURE_FLAG_ALL=true, you get access to:
const enterpriseFeatures = [
  'Advanced permissions',
  'LDAP/SAML authentication', 
  'Source control integration',
  'External secrets management',
  'Workflow history',
  'Advanced execution filters',
  'Binary data S3 storage',
  'Multiple main instances',
  'Variables management',
  'Worker view',
  'Project roles',
  'Custom npm registry',
  'Folders organization',
  'Insights dashboard'
];
```

## API Integration Examples

### Custom Node with LLM
```typescript
// Example: Create a custom node that uses AI for data transformation
export class AiTransformNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'AI Transform',
    name: 'aiTransform',
    group: ['ai'],
    // ... node configuration
  };

  async execute(this: IExecuteFunctions) {
    // Get AI service and transform data based on natural language instructions
    const instruction = this.getNodeParameter('instruction', 0) as string;
    const inputData = this.getInputData();
    
    // Use n8n's AI workflow builder service for transformation
    // (Security auditing is handled automatically)
    
    return [this.helpers.returnJsonArray(transformedData)];
  }
}
```

### UI Extension for Plain Language Workflows
```vue
<!-- Example Vue component for AI workflow creation -->
<template>
  <div class="ai-workflow-builder">
    <input 
      v-model="userPrompt" 
      placeholder="Describe your workflow in plain language..."
      @keyup.enter="generateWorkflow"
    />
    <button @click="generateWorkflow">Generate Workflow</button>
    
    <!-- Security warnings display -->
    <div v-if="securityWarnings.length" class="security-warnings">
      <h4>Security Notice:</h4>
      <ul>
        <li v-for="warning in securityWarnings" :key="warning">
          {{ warning }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userPrompt: '',
      securityWarnings: []
    };
  },
  methods: {
    async generateWorkflow() {
      try {
        const workflowBuilder = useAiWorkflowBuilder();
        const stream = workflowBuilder.chat({ question: this.userPrompt });
        
        for await (const chunk of stream) {
          // Handle security warnings
          const securityMessage = chunk.messages.find(m => m.type === 'security-warning');
          if (securityMessage) {
            this.securityWarnings = securityMessage.warnings;
          }
          
          // Handle workflow generation
          const workflowMessage = chunk.messages.find(m => m.type === 'workflow-generated');
          if (workflowMessage) {
            this.loadWorkflowToCanvas(JSON.parse(workflowMessage.codeSnippet));
          }
        }
      } catch (error) {
        this.handleError(error);
      }
    }
  }
};
</script>
```

## Troubleshooting

### Common Issues

1. **"No AI API keys configured"**
   - Set `N8N_AI_OPENAI_API_KEY` or `N8N_AI_ANTHROPIC_KEY`
   - Or configure `N8N_AI_ASSISTANT_BASE_URL` for proxy access

2. **"Invalid API key format"**
   - OpenAI keys should start with `sk-`
   - Anthropic keys should start with `sk-ant-`

3. **License activation failures**
   - Verify `N8N_LICENSE_ACTIVATION_KEY` is correct
   - Check network connectivity to license server
   - Ensure license hasn't expired or exceeded usage limits

4. **Security warnings in prompts**
   - Review and modify prompts to remove suspicious content
   - Avoid system-level requests or injection attempts
   - Keep prompts focused on workflow automation tasks

### Performance Tips

1. **API Key Selection**
   - Use both OpenAI and Anthropic keys for optimal performance
   - OpenAI for simple/fast tasks, Anthropic for complex reasoning

2. **Prompt Optimization**  
   - Be specific about the services you want to connect
   - Mention the trigger and actions clearly
   - Provide context about data flow requirements

3. **Resource Management**
   - Monitor API usage and costs
   - Set up rate limiting if needed
   - Use caching for repeated workflow patterns

## Support

For additional help:
- Review the [n8n AI Integrations documentation](https://docs.n8n.io/integrations/builtin/ai/)
- Check the [Enterprise Setup guide](https://docs.n8n.io/enterprise/installation/)
- Explore [Custom Node creation](https://docs.n8n.io/integrations/creating-nodes/)