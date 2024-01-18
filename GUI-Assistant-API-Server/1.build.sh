#!/bin/bash
docker_id="ketidevit2"
controller_name="gui-assistant-apiserver"

export GO111MODULE=on
go mod vendor

go build -o build/_output/bin/$controller_name -gcflags all=-trimpath=`pwd` -asmflags all=-trimpath=`pwd` -mod=vendor api-server/src/main && \

docker build -t $docker_id/$controller_name:v0.0.1 build && \
docker push $docker_id/$controller_name:v0.0.1
