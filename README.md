# ACN UI

React + Vite frontend for the ACN demo dashboard.

The app renders the presentation UI, supports a runtime-configurable backend endpoint, and can be shipped as a static Docker image served by nginx.

## Stack

- React 19
- Vite 8
- TypeScript
- React Flow
- nginx for container runtime

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production bundle locally:

```bash
npm run preview
```

## Backend Endpoint Configuration

The frontend reads the backend base URL at runtime instead of baking it into the build.

Resolution order:

1. Browser override saved in `localStorage`
2. `window.__APP_CONFIG__.backendEndpoint` from `runtime-config.js`
3. Fallback default: `http://<current-host>:18081`

Notes:

- The in-app settings panel writes the browser override to `localStorage`.
- Clearing that saved value returns the app to the container-provided runtime value.
- This lets the same built image point to different backends without rebuilding.

## Docker

Build the image:

```bash
docker build -t acn-ui:local .
```

Run with the default container bind address and port:

```bash
docker run --rm -p 8081:8081 \
  -e BACKEND_ENDPOINT=http://host.docker.internal:18081 \
  acn-ui:local
```

Default runtime values:

- `APP_HOST=0.0.0.0`
- `PORT=8081`
- `BACKEND_ENDPOINT=` empty, which falls back in the browser to `http://<current-host>:18081`

Override the listen address or port at container start:

```bash
docker run --rm -p 9090:9090 \
  -e APP_HOST=0.0.0.0 \
  -e PORT=9090 \
  -e BACKEND_ENDPOINT=http://host.docker.internal:18081 \
  acn-ui:local
```

The container generates `runtime-config.js` on startup, so backend changes do not require a new image build.

## GitHub Actions And Publishing

The repository includes a workflow at `.github/workflows/docker-publish.yml`.

Behavior:

- Pull requests build the Docker image to verify the container path.
- Pushes to `main` build and publish the image to `ghcr.io/acore2026/acn_ui`.
- Tags matching `v*` also publish tagged images.
- Tag builds attach a downloadable `acn-ui-<tag>.tar.gz` image archive to the GitHub Release assets section.
- The default branch also receives the `latest` tag.

The workflow uses GitHub Container Registry with the built-in `GITHUB_TOKEN`. GitHub Actions must have permission to write packages for publishing to succeed.

## Image Naming

Published image:

```text
ghcr.io/acore2026/acn_ui
```

Typical pull command:

```bash
docker pull ghcr.io/acore2026/acn_ui:latest
```
