#!/bin/sh
set -e

# Ensure dist templates directory exists
mkdir -p /usr/src/app/dist/apps/email/templates

# Copy templates into dist at container startup
cp -r /templates-src/* /usr/src/app/dist/apps/email/templates/

# Start the email service in dev mode
exec npm run start:dev:email
