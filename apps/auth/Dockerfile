FROM node:20-alpine as development

WORKDIR /usr/src/app

# Copy only root-level metadata
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Copy only the required app and shared libs
COPY apps/auth ./apps/auth
COPY libs ./libs

# Development command
CMD ["npm", "run", "start:dev:auth"]
