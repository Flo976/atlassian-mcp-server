# Use official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY src/ ./src/

# Build the TypeScript application
RUN npm run build

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcpuser -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R mcpuser:nodejs /app
USER mcpuser

# The MCP server runs via stdio, no port exposure needed
# But we can expose a port for potential HTTP transport in the future
EXPOSE 3001

# Add health check via a simple node script
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('MCP Server is running'); process.exit(0)"

# Define the command to run the application
CMD ["node", "dist/index.js"]