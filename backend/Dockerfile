FROM node:21-alpine

# install curl for healthcheck
RUN apk add --no-cache curl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code from backend directory
COPY . .

# Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]
