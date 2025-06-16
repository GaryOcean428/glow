ARG NODE_VERSION=22
ARG GLOW_VERSION=snapshot

# 1. Create an image to build glow
FROM --platform=linux/amd64 glowio/base:${NODE_VERSION} AS builder

# Build the application from source
WORKDIR /src
COPY . /src
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store --mount=type=cache,id=pnpm-metadata,target=/root/.cache/pnpm/metadata DOCKER_BUILD=true pnpm install --frozen-lockfile
RUN pnpm build

# Delete all dev dependencies
RUN jq 'del(.pnpm.patchedDependencies)' package.json > package.json.tmp; mv package.json.tmp package.json
RUN node .github/scripts/trim-fe-packageJson.js

# Delete any source code or typings
RUN find . -type f -name "*.ts" -o -name "*.vue" -o -name "tsconfig.json" -o -name "*.tsbuildinfo" | xargs rm -rf

# Deploy the `glow` package into /compiled
RUN mkdir /compiled
RUN NODE_ENV=production DOCKER_BUILD=true pnpm --filter=glow --prod --no-optional --legacy deploy /compiled

# 2. Start with a new clean image with just the code that is needed to run glow
FROM glowio/base:${NODE_VERSION}
ENV NODE_ENV=production

ARG GLOW_RELEASE_TYPE=dev
ENV GLOW_RELEASE_TYPE=${GLOW_RELEASE_TYPE}

LABEL org.opencontainers.image.title="glow"
LABEL org.opencontainers.image.description="Workflow Automation Tool"
LABEL org.opencontainers.image.source="https://github.com/glow-io/glow"
LABEL org.opencontainers.image.url="https://glow.io"
LABEL org.opencontainers.image.version=${GLOW_VERSION}

WORKDIR /home/node
COPY --from=builder /compiled /usr/local/lib/node_modules/glow
COPY docker/images/glow/docker-entrypoint.sh /

# Setup the Task Runner Launcher
ARG TARGETPLATFORM
ARG LAUNCHER_VERSION=1.1.2
COPY docker/images/glow/glow-task-runners.json /etc/glow-task-runners.json
# Download, verify, then extract the launcher binary
RUN \
	if [[ "$TARGETPLATFORM" = "linux/amd64" ]]; then export ARCH_NAME="amd64"; \
	elif [[ "$TARGETPLATFORM" = "linux/arm64" ]]; then export ARCH_NAME="arm64"; fi; \
	mkdir /launcher-temp && \
	cd /launcher-temp && \
	wget https://github.com/glow-io/task-runner-launcher/releases/download/${LAUNCHER_VERSION}/task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz && \
	wget https://github.com/glow-io/task-runner-launcher/releases/download/${LAUNCHER_VERSION}/task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz.sha256 && \
	# The .sha256 does not contain the filename --> Form the correct checksum file
	echo "$(cat task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz.sha256) task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz" > checksum.sha256 && \
	sha256sum -c checksum.sha256 && \
	tar xvf task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz --directory=/usr/local/bin && \
	cd - && \
	rm -r /launcher-temp

RUN \
	cd /usr/local/lib/node_modules/glow && \
	npm rebuild sqlite3 && \
	cd - && \
	ln -s /usr/local/lib/node_modules/glow/bin/glow /usr/local/bin/glow && \
	mkdir .glow && \
	chown node:node .glow

# Install npm 11.4.1 to fix the vulnerable cross-spawn dependency
RUN npm install -g npm@11.4.1
RUN apk --purge del apk-tools

ENV SHELL /bin/sh
USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]
