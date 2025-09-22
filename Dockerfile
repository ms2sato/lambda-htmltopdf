# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

FROM public.ecr.aws/lambda/nodejs:${NODE_VERSION} AS build-stage

ENV NODE_ENV=production

RUN --mount=type=cache,id=dnf-cache-build,target=/var/cache/dnf \
    microdnf update -y && \
    microdnf install -y \
        nss nss-softokn nss-util nspr \
        at-spi2-atk \
        cups-libs \
        libdrm \
        libxkbcommon \
        libXcomposite \
        libXdamage \
        libXrandr \
        mesa-libgbm \
        pango \
        alsa-lib && \
    microdnf clean all

WORKDIR ${LAMBDA_TASK_ROOT}
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci --omit=dev

FROM public.ecr.aws/lambda/nodejs:${NODE_VERSION}

ENV NODE_ENV=production

RUN --mount=type=cache,id=dnf-cache,target=/var/cache/dnf \
    microdnf update -y && \
    microdnf install -y \
        nss nss-softokn nss-util nspr \
        at-spi2-atk \
        cups-libs \
        libdrm \
        libxkbcommon \
        libXcomposite \
        libXdamage \
        libXrandr \
        mesa-libgbm \
        pango \
        alsa-lib \
        ipa-gothic-fonts \
        ipa-mincho-fonts && \
    microdnf clean all

WORKDIR ${LAMBDA_TASK_ROOT}
COPY package.json package-lock.json .puppeteerrc.cjs *.js ./
COPY --from=build-stage ${LAMBDA_TASK_ROOT}/node_modules ./node_modules

CMD ["index.handler"]
