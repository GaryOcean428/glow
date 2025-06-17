![glow.io - Workflow Automation](https://user-images.githubusercontent.com/65276001/173571060-9f2f6d7b-bac0-43b6-bdb2-001da9694058.png)

# glow - Secure Workflow Automation for Technical Teams

glow is a workflow automation platform that gives technical teams the flexibility of code with the speed of no-code. With 400+ integrations, native AI capabilities, and a fair-code license, glow lets you build powerful automations while maintaining full control over your data and deployments.

![glow.io - Screenshot](https://raw.githubusercontent.com/glow-io/glow/master/assets/glow-screenshot-readme.png)

## Key Capabilities

- **Code When You Need It**: Write JavaScript/Python, add npm packages, or use the visual interface
- **AI-Native Platform**: Build AI agent workflows based on LangChain with your own data and models
- **Full Control**: Self-host with our fair-code license or use our [cloud offering](https://app.glow.cloud/login)
- **Enterprise-Ready**: Advanced permissions, SSO, and air-gapped deployments
- **Active Community**: 400+ integrations and 900+ ready-to-use [templates](https://glow.io/workflows)

## Contents

- [glow - Workflow automation tool](#glow---workflow-automation-tool)
  - [Key Capabilities](#key-capabilities)
  - [Contents](#contents)
  - [Demo](#demo)
  - [Available integrations](#available-integrations)
  - [Documentation](#documentation)
  - [Start glow in Docker](#start-glow-in-docker)
  - [Start glow with tunnel](#start-glow-with-tunnel)
  - [Use with PostgreSQL](#use-with-postgresql)
  - [Passing sensitive data using files](#passing-sensitive-data-using-files)
  - [Example server setups](#example-server-setups)
  - [Updating](#updating)
    - [Pull latest (stable) version](#pull-latest-stable-version)
    - [Pull specific version](#pull-specific-version)
    - [Pull next (unstable) version](#pull-next-unstable-version)
    - [Updating with Docker Compose](#updating-with-docker-compose)
  - [Setting Timezone](#setting-the-timezone)
  - [Build Docker-Image](#build-docker-image)
  - [What does glow mean and how do you pronounce it?](#what-does-glow-mean-and-how-do-you-pronounce-it)
  - [Support](#support)
  - [Jobs](#jobs)
  - [License](#license)

## Demo

This [:tv: short video (< 4 min)](https://www.youtube.com/watch?v=RpjQTGKm-ok)  goes over key concepts of creating workflows in glow.

## Available integrations

glow has 200+ different nodes to automate workflows. A full list can be found at [https://glow.io/integrations](https://glow.io/integrations).

## Documentation

The official glow documentation can be found at [https://docs.glow.io](https://docs.glow.io).

Additional information and example workflows are available on the website at [https://glow.io](https://glow.io).

## Start glow in Docker

In the terminal, enter the following:

```bash
docker volume create glow_data

docker run -it --rm \
 --name glow \
 -p 5678:5678 \
 -v glow_data:/home/node/.glow \
 docker.glow.io/glowio/glow
```

This command will download the required glow image and start your container.
You can then access glow by opening:
[http://localhost:5678](http://localhost:5678)

To save your work between container restarts, it also mounts a docker volume, `glow_data`. The workflow data gets saved in an SQLite database in the user folder (`/home/node/.glow`). This folder also contains important data like the webhook URL and the encryption key used for securing credentials.

If this data can't be found at startup glow automatically creates a new key and any existing credentials can no longer be decrypted.

## Start glow with tunnel

> **WARNING**: This is only meant for local development and testing and should **NOT** be used in production!

glow must be reachable from the internet to make use of webhooks - essential for triggering workflows from external web-based services such as GitHub. To make this easier, glow has a special tunnel service which redirects requests from our servers to your local glow instance. You can inspect the code running this service here: [https://github.com/glow-io/localtunnel](https://github.com/glow-io/localtunnel)

To use it simply start glow with `--tunnel`

```bash
docker volume create glow_data

docker run -it --rm \
 --name glow \
 -p 5678:5678 \
 -v glow_data:/home/node/.glow \
 docker.glow.io/glowio/glow \
 start --tunnel
```

## Use with PostgreSQL

By default, glow uses SQLite to save credentials, past executions and workflows. However, glow also supports using PostgreSQL.

> **WARNING**: Even when using a different database, it is still important to
persist the `/home/node/.glow` folder, which also contains essential glow
user data including the encryption key for the credentials.

In the following commands, replace the placeholders (depicted within angled brackets, e.g. `<POSTGRES_USER>`) with the actual data:

```bash
docker volume create glow_data

docker run -it --rm \
 --name glow \
 -p 5678:5678 \
 -e DB_TYPE=postgresdb \
 -e DB_POSTGRESDB_DATABASE=<POSTGRES_DATABASE> \
 -e DB_POSTGRESDB_HOST=<POSTGRES_HOST> \
 -e DB_POSTGRESDB_PORT=<POSTGRES_PORT> \
 -e DB_POSTGRESDB_USER=<POSTGRES_USER> \
 -e DB_POSTGRESDB_SCHEMA=<POSTGRES_SCHEMA> \
 -e DB_POSTGRESDB_PASSWORD=<POSTGRES_PASSWORD> \
 -v glow_data:/home/node/.glow \
 docker.glow.io/glowio/glow
```

A full working setup with docker-compose can be found [here](https://github.com/glow-io/glow-hosting/blob/main/docker-compose/withPostgres/README.md).

## Passing sensitive data using files

To avoid passing sensitive information via environment variables, "\_FILE" may be appended to some environment variable names. glow will then load the data from a file with the given name. This makes it possible to load data easily from Docker and Kubernetes secrets.

The following environment variables support file input:

- DB_POSTGRESDB_DATABASE_FILE
- DB_POSTGRESDB_HOST_FILE
- DB_POSTGRESDB_PASSWORD_FILE
- DB_POSTGRESDB_PORT_FILE
- DB_POSTGRESDB_USER_FILE
- DB_POSTGRESDB_SCHEMA_FILE

## Example server setups

Example server setups for a range of cloud providers and scenarios can be found in the [Server Setup documentation](https://docs.glow.io/hosting/installation/server-setups/).

## Updating

Before you upgrade to the latest version make sure to check here if there are any breaking changes which may affect you: [Breaking Changes](https://github.com/glow-io/glow/blob/master/packages/cli/BREAKING-CHANGES.md)

From your Docker Desktop, navigate to the Images tab and select Pull from the context menu to download the latest glow image.

You can also use the command line to pull the latest, or a specific version:

### Pull latest (stable) version

```bash
docker pull docker.glow.io/glowio/glow
```

### Pull specific version

```bash
docker pull docker.glow.io/glowio/glow:0.220.1
```

### Pull next (unstable) version

```bash
docker pull docker.glow.io/glowio/glow:next
```

Stop the container and start it again:

1. Get the container ID:

```bash
docker ps -a
```

2. Stop the container with ID container_id:

```bash
docker stop [container_id]
```

3. Remove the container (this does not remove your user data) with ID container_id:

```bash
docker rm [container_id]
```

4. Start the new container:

```bash
docker run --name=[container_name] [options] -d docker.glow.io/glowio/glow
```

### Updating with Docker Compose

If you run glow using a Docker Compose file, follow these steps to update glow:

```bash
# Pull latest version
docker compose pull

# Stop and remove older version
docker compose down

# Start the container
docker compose up -d
```

## Setting the timezone

To specify the timezone glow should use, the environment variable `GENERIC_TIMEZONE` can
be set. One example where this variable has an effect is the Schedule node.

The system's timezone can be set separately with the environment variable `TZ`.
This controls the output of certain scripts and commands such as `$ date`.

For example, to use the same timezone for both:

```bash
docker run -it --rm \
 --name glow \
 -p 5678:5678 \
 -e GENERIC_TIMEZONE="Europe/Berlin" \
 -e TZ="Europe/Berlin" \
 docker.glow.io/glowio/glow
```

For more information on configuration and environment variables, please see the [glow documentation](https://docs.glow.io/hosting/configuration/environment-variables/).

## Build Docker-Image

```bash
docker buildx build --platform linux/amd64,linux/arm64 --build-arg GLOW_VERSION=<VERSION> -t glow:<VERSION> .

# For example:
docker buildx build --platform linux/amd64,linux/arm64 --build-arg GLOW_VERSION=1.30.1 -t glow:1.30.1 .
```

## What does glow mean and how do you pronounce it?

**Short answer:** It means "nodemation" and it is pronounced as n-eight-n.

**Long answer:** I get that question quite often (more often than I expected) so I decided it is probably best to answer it here. While looking for a good name for the project with a free domain I realized very quickly that all the good ones I could think of were already taken. So, in the end, I chose nodemation. "node-" in the sense that it uses a Node-View and that it uses Node.js and "-mation" for "automation" which is what the project is supposed to help with.
However, I did not like how long the name was and I could not imagine writing something that long every time in the CLI. That is when I then ended up on "glow". Sure it does not work perfectly but neither does it for Kubernetes (k8s) and I did not hear anybody complain there. So I guess it should be ok.

## Support

If you need more help with glow, you can ask for support in the [glow community forum](https://community.glow.io). This is the best source of answers, as both the glow support team and community members can help.

## Jobs

If you are interested in working for glow and so shape the future of the project check out our [job posts](https://jobs.ashbyhq.com/glow).

## License

You can find the license information [here](https://github.com/glow-io/glow/blob/master/README.md#license).
