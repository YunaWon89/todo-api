# Todo API

A TypeScript-based Todo REST API with MongoDB, designed to run in development and production environments using Docker.

## Features

* REST API for Todo items
* MongoDB integration with Mongoose
* TypeScript
* Express
* CORS support
* Socket.IO
* Environment-based configuration
* Production-ready multi-stage Docker build
* Non-root Docker user
* Docker health check
* Graceful signal handling with `dumb-init`

## Requirements

For local development:

* Node.js 18+
* npm 8+

For containerized execution:

* Docker

> Docker is not required to edit the project or build the TypeScript application locally.

## Project Structure

```text
todo-api/
├── src/
│   └── server.ts
├── dist/
├── Dockerfile
├── Dockerfile.dev
├── Dockerfile.staging
├── .dockerignore
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Environment Variables

Create a `.env` file for local development.

Example:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

For Docker Compose, the MongoDB service can be referenced by its service name:

```env
MONGODB_URI=mongodb://mongo:27017/todoapp
```

Do not commit `.env` to Git.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The development server uses `ts-node-dev` and runs:

```text
src/server.ts
```

## TypeScript Build

Build the application:

```bash
npm run build
```

The compiled JavaScript files are generated in:

```text
dist/
```

The production entry point is:

```text
dist/server.js
```

## Production

Start the compiled application locally:

```bash
npm start
```

## Docker Production Image

The production Dockerfile uses a multi-stage build.

The stages are:

1. Production dependencies
2. Development dependencies
3. TypeScript build
4. Production runtime

The final image contains the compiled application and production dependencies without development dependencies.

Build the production image:

```bash
docker build -t todo-api:production .
```

Run the production container:

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/todoapp \
  todo-api:production
```

The API will be available at:

```text
http://localhost:3000
```

## Health Check

The application provides:

```text
GET /health
```

Example:

```bash
curl http://localhost:3000/health
```

The Docker image also contains a container health check that requests:

```text
http://localhost:3000/health
```

## Docker Development Image

Build the development image:

```bash
docker build -f Dockerfile.dev -t todo-api:dev .
```

Run it:

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=development \
  todo-api:dev
```

The development container runs:

```bash
npm run dev
```

## Staging

A separate staging Dockerfile is provided:

```text
Dockerfile.staging
```

It is based on the production image and sets:

```text
NODE_ENV=staging
LOG_LEVEL=debug
```

The staging configuration also installs `curl` for debugging and health-check purposes.

## Docker Security

The production image includes several security measures:

* Runs as a non-root `nodejs` user
* Does not copy `.env` files into the image
* Uses production-only dependencies
* Uses `.dockerignore` to reduce the build context
* Uses `dumb-init` for proper process and signal handling

Additional runtime hardening can be applied when starting the container:

```bash
docker run --read-only --cap-drop ALL ...
```

## Build Arguments

The production Dockerfile supports:

```text
NODE_ENV
BUILD_DATE
GIT_COMMIT
```

Example:

```bash
docker build \
  --build-arg NODE_ENV=production \
  --build-arg BUILD_DATE=2026-09-16 \
  --build-arg GIT_COMMIT=abc123 \
  -t todo-api:production .
```

## API Endpoints

### Health

```text
GET /health
```

### Todos

```text
GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
DELETE /api/todos/:id
```

## Docker Compose

Docker Compose configuration will be added in the next lesson to run the Todo API together with MongoDB.

## Current Docker Deliverables

* [x] Production Dockerfile
* [x] Multi-stage Docker build
* [x] Development Dockerfile
* [x] Staging Dockerfile
* [x] `.dockerignore`
* [x] Environment template
* [x] Non-root production user
* [x] Docker health check
* [x] Build arguments
* [ ] `docker-compose.yml` — next lesson
* [ ] Actual Docker image build — requires Docker
* [ ] Container runtime testing — requires Docker
* [ ] Image size verification — requires Docker


