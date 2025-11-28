FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy root configs
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install all dependencies (shared monorepo install)
RUN npm install

# Copy only this service + shared libraries
COPY apps/users ./apps/users
COPY libs ./libs

# Start only the users service
CMD ["npm", "run", "start:dev:users"]
