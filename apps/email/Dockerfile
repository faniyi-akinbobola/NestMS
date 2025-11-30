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


# Build the app (this creates the dist directory)
RUN npm run build email

# Add entrypoint script to copy templates at container startup
COPY apps/email/src/templates /templates-src
COPY apps/email/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Start with entrypoint script
ENTRYPOINT ["/entrypoint.sh"]

# Start only the email service
CMD ["npm", "run", "start:dev:email"]
