# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired

FROM FROM oven/bun:latest


# Set production environment
ENV NODE_ENV="production"

COPY . .

RUN bun install

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "index.js" ]
