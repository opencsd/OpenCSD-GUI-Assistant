FROM registry.access.redhat.com/ubi7/ubi-minimal:latest

ENV OPERATOR=/usr/local/bin/gui-assistant-apiserver \
    USER_UID=root \
    USER_NAME=gui-assistant-apiserver

COPY _output/bin/gui-assistant-apiserver ${OPERATOR}

COPY bin /usr/local/bin
RUN  /usr/local/bin/user_setup
RUN mkdir /root/.kube
RUN mkdir /mnt/instance-deploy

ENTRYPOINT ["/usr/local/bin/entrypoint"]

USER ${USER_UID}
