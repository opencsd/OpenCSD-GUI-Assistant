docker_id="ketidevit2"
controller_name="opencsd-gui-assistant"

docker build -t $docker_id/$controller_name:v0.0.1 . && \
docker push $docker_id/$controller_name:v0.0.1