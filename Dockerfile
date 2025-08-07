# Use official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S atlassian -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R atlassian:nodejs /app
USER atlassian

# Expose the port the app runs on
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { \
    if (res.statusCode === 200) { \
      console.log('Health check passed'); \
      process.exit(0); \
    } else { \
      console.log('Health check failed'); \
      process.exit(1); \
    } \
  }).on('error', () => { \
    console.log('Health check error'); \
    process.exit(1); \
  })"

# Define the command to run the application
CMD ["node", "server.js"]