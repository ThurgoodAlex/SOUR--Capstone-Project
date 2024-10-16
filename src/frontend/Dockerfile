# Use an official Node runtime as the base image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the default React Native port
EXPOSE 8081

# Start the React Native development server
CMD ["npm", "start"]
