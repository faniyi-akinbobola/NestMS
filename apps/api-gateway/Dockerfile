# 1. Base image
FROM node:20-alpine AS development

# 2. Set working directory to monorepo root
WORKDIR /usr/src/app

# 3. Copy root package files and config for dependency install
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
# COPY .env ./
COPY ./apps ./apps
COPY ./libs ./libs

# 4. Install dependencies
RUN npm install

# 5. Start the API Gateway
CMD ["npm", "run", "start:dev", "api-gateway"]