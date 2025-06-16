![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# glow - Secure Workflow Automation for Technical Teams

glow is a workflow automation platform that gives technical teams the flexibility of code with the speed of no-code. With 400+ integrations, native AI capabilities, and a fair-code license, glow lets you build powerful automations while maintaining full control over your data and deployments.

![glow.io - Screenshot](https://raw.githubusercontent.com/GaryOcean428/glow/master/assets/glow-screenshot-readme.png)

## Key Capabilities

- **Code When You Need It**: Write JavaScript/Python, add npm packages, or use the visual interface
- **AI-Native Platform**: Build AI agent workflows based on LangChain with your own data and models
- **Full Control**: Self-host with our fair-code license or use our [cloud offering](https://app.glow.cloud/login)
- **Enterprise-Ready**: Advanced permissions, SSO, and air-gapped deployments
- **Active Community**: 400+ integrations and 900+ ready-to-use [templates](https://glow.io/workflows)

## Quick Start

Try glow instantly with [npx](https://docs.glow.io/hosting/installation/npm/) (requires [Node.js](https://nodejs.org/en/)):

```
npx glow
```

Or deploy with [Docker](https://docs.glow.io/hosting/installation/docker/):

```
docker volume create glow_data
docker run -it --rm --name glow -p 5678:5678 -v glow_data:/home/node/.glow docker.glow.io/glowio/glow
```

Access the editor at http://localhost:5678

## Resources

- 📚 [Documentation](https://docs.glow.io)
- 🔧 [400+ Integrations](https://glow.io/integrations)
- 💡 [Example Workflows](https://glow.io/workflows)
- 🤖 [AI & LangChain Guide](https://docs.glow.io/langchain/)
- 👥 [Community Forum](https://community.glow.io)
- 📖 [Community Tutorials](https://community.glow.io/c/tutorials/28)

## Support

Need help? Our community forum is the place to get support and connect with other users:
[community.glow.io](https://community.glow.io)

## License

glow is [fair-code](https://faircode.io) distributed under the [Sustainable Use License](https://github.com/GaryOcean428/glow/blob/master/LICENSE.md) and [glow Enterprise License](https://github.com/GaryOcean428/glow/blob/master/LICENSE_EE.md).

- **Source Available**: Always visible source code
- **Self-Hostable**: Deploy anywhere
- **Extensible**: Add your own nodes and functionality

[Enterprise licenses](mailto:license@n8n.io) available for additional features and support.

Additional information about the license model can be found in the [docs](https://docs.n8n.io/reference/license/).

## Contributing

Found a bug 🐛 or have a feature idea ✨? Check our [Contributing Guide](https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md) to get started.

## Join the Team

Want to shape the future of automation? Check out our [job posts](https://n8n.io/careers) and join our team!

## What does n8n mean?

**Short answer:** It means "nodemation" and is pronounced as n-eight-n.

**Long answer:** "I get that question quite often (more often than I expected) so I decided it is probably best to answer it here. While looking for a good name for the project with a free domain I realized very quickly that all the good ones I could think of were already taken. So, in the end, I chose nodemation. 'node-' in the sense that it uses a Node-View and that it uses Node.js and '-mation' for 'automation' which is what the project is supposed to help with. However, I did not like how long the name was and I could not imagine writing something that long every time in the CLI. That is when I then ended up on 'n8n'." - **Jan Oberhauser, Founder and CEO, n8n.io**
