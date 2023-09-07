FROM public.ecr.aws/lambda/nodejs:18

ENV NODE_ENV production

RUN yum update -y \
  && yum install -y amazon-linux-extras \
  && amazon-linux-extras install -y epel \
  && yum install -y \
    at-spi2-atk cups-libs libdrm libxkbcommon libXcomposite libXdamage libXrandr mesa-libgbm pango alsa-lib \
    ipa-gothic-fonts ipa-mincho-fonts ipa-pgothic-fonts ipa-pmincho-fonts \
  && rm -rf /var/cache/yum/* \
  && yum clean all

WORKDIR ${LAMBDA_TASK_ROOT}
COPY . ./
RUN npm ci --omit=dev

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]