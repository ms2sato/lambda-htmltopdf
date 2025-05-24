# syntax=docker/dockerfile:1
ARG NODE_VERSION=18
FROM public.ecr.aws/lambda/nodejs:${NODE_VERSION} AS build-stage

ENV NODE_ENV=production

RUN --mount=type=cache,id=yum-cache-build,target=/var/cache/yum yum update -y \
  && yum install -y amazon-linux-extras \
  && amazon-linux-extras install -y epel \
  && yum install -y \
    at-spi2-atk cups-libs libdrm libxkbcommon libXcomposite libXdamage libXrandr mesa-libgbm pango alsa-lib

WORKDIR ${LAMBDA_TASK_ROOT}
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
  npm ci --omit=dev

FROM public.ecr.aws/lambda/nodejs:${NODE_VERSION}

ENV NODE_ENV=production

RUN --mount=type=cache,id=yum-cache,target=/var/cache/yum  yum update -y \
  && yum install -y amazon-linux-extras \
  && amazon-linux-extras install -y epel \
  && yum install -y \
    at-spi2-atk cups-libs libdrm libxkbcommon libXcomposite libXdamage libXrandr mesa-libgbm pango alsa-lib \
    ipa-gothic-fonts ipa-mincho-fonts \
  && rm -rf /var/cache/yum/* \
  && yum clean all

WORKDIR ${LAMBDA_TASK_ROOT}
COPY package.json package-lock.json .puppeteerrc.cjs *.js ./
COPY --from=build-stage ${LAMBDA_TASK_ROOT}/node_modules ./node_modules
COPY --from=build-stage /root/.cache ./.cache

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]