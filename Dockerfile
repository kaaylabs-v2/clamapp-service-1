# Use Node.js 22 base image
FROM node:22.0.0

# Set working directory
WORKDIR /opt/

# Print Node.js and npm versions for debug
RUN node --version && npm --version

# Copy package files first (leverages Docker layer caching)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
#RUN npm run build

# List files for verification
RUN ls -ltr

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]