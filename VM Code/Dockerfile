# Use the official Node.js image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies including mysql2
RUN npm install mysql2

# Copy app files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["node", "server.js"]
