# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy the rest of the source code
COPY . .

# Build the React app
RUN npm run build

# Expose the port on which the React app will run (e.g., 3000)
EXPOSE 3000

# Start the React app
CMD [ "npm", "start" ]
