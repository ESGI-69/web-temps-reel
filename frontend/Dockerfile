FROM node:lts-alpine

ARG VITE_API
ENV VITE_API=$VITE_API
ARG VITE_API_TIMEOUT
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ARG VITE_COOKIE_TOKEN_NAME
ENV VITE_COOKIE_TOKEN_NAME=$VITE_COOKIE_TOKEN_NAME
ARG VITE_LAST_COMMIT
ENV VITE_LAST_COMMIT=$VITE_LAST_COMMIT
ARG VITE_SOCKET
ENV VITE_SOCKET=$VITE_SOCKET

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build app
RUN npm run build

# Expose port and start application
EXPOSE 8080

CMD ["npm", "run", "preview"]
