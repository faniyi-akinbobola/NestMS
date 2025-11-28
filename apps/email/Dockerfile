FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy root configs
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies once
RUN npm install

# Copy only the email service + shared libs
COPY apps/email ./apps/email
COPY libs ./libs

# Start only the email service
CMD ["npm", "run", "start:dev:email"]
