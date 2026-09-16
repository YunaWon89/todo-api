# Stage 1: Production dependencies
FROM node:18-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force


# Stage 2: Development dependencies
FROM node:18-alpine AS dev-dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


# Stage 3: Build application
FROM dev-dependencies AS build

COPY . .

RUN npm run build


# Stage 4: Production runtime
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Build arguments
ARG NODE_ENV=production
ARG BUILD_DATE
ARG GIT_COMMIT

# Runtime environment variables
ENV NODE_ENV=$NODE_ENV
ENV BUILD_DATE=$BUILD_DATE
ENV GIT_COMMIT=$GIT_COMMIT

# Create non-root user
RUN addgroup -S nodejs && \
    adduser -S nodejs -G nodejs

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy compiled application
COPY --from=build /app/dist ./dist

# Copy package.json
COPY --from=build /app/package.json ./package.json

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/server.js"]