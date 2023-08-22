FROM public.ecr.aws/lambda/nodejs:18

RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras install -y epel
RUN yum install -y chromium ipa-gothic-fonts ipa-mincho-fonts ipa-pgothic-fonts ipa-pmincho-fonts

WORKDIR ${LAMBDA_TASK_ROOT}
COPY . ./
RUN npm install

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]