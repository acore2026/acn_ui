#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-acn-ui:local}"
CONTAINER_NAME="${CONTAINER_NAME:-acn-ui-8085}"
HOST_PORT="${HOST_PORT:-8085}"
CONTAINER_PORT="${CONTAINER_PORT:-8085}"
APP_HOST="${APP_HOST:-0.0.0.0}"
BACKEND_ENDPOINT="${BACKEND_ENDPOINT:-}"

echo "Building frontend..."
npm run build

echo "Building Docker image: ${IMAGE_NAME}"
docker build -t "${IMAGE_NAME}" .

echo "Stopping existing acn_ui containers..."
mapfile -t existing_containers < <(docker ps -aq --filter "name=^/acn-ui")
if ((${#existing_containers[@]})); then
  docker stop "${existing_containers[@]}"
  docker rm "${existing_containers[@]}" >/dev/null
fi

echo "Starting ${CONTAINER_NAME} on ${APP_HOST}:${HOST_PORT}"
run_args=(
  -d
  --name "${CONTAINER_NAME}"
  -p "${HOST_PORT}:${CONTAINER_PORT}"
  -e "APP_HOST=${APP_HOST}"
  -e "PORT=${CONTAINER_PORT}"
)

if [[ -n "${BACKEND_ENDPOINT}" ]]; then
  run_args+=(-e "BACKEND_ENDPOINT=${BACKEND_ENDPOINT}")
fi

docker run "${run_args[@]}" "${IMAGE_NAME}"

echo "Done."
