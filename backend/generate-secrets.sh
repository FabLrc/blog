#!/bin/bash
set -e

# Script to generate Strapi secrets automatically if not provided
# This ensures secrets are generated on first run without manual input

# Function to generate a random secret
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Generate APP_KEYS if not set (comma-separated list of keys)
if [ -z "$APP_KEYS" ]; then
    export APP_KEYS="$(generate_secret),$(generate_secret)"
    echo "Generated APP_KEYS: $APP_KEYS"
fi

# Generate API_TOKEN_SALT if not set
if [ -z "$API_TOKEN_SALT" ]; then
    export API_TOKEN_SALT="$(generate_secret)"
    echo "Generated API_TOKEN_SALT: $API_TOKEN_SALT"
fi

# Generate ADMIN_JWT_SECRET if not set
if [ -z "$ADMIN_JWT_SECRET" ]; then
    export ADMIN_JWT_SECRET="$(generate_secret)"
    echo "Generated ADMIN_JWT_SECRET: $ADMIN_JWT_SECRET"
fi

# Generate TRANSFER_TOKEN_SALT if not set
if [ -z "$TRANSFER_TOKEN_SALT" ]; then
    export TRANSFER_TOKEN_SALT="$(generate_secret)"
    echo "Generated TRANSFER_TOKEN_SALT: $TRANSFER_TOKEN_SALT"
fi

# Generate JWT_SECRET if not set
if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET="$(generate_secret)"
    echo "Generated JWT_SECRET: $JWT_SECRET"
fi

# Generate ENCRYPTION_KEY if not set (32 chars)
if [ -z "$ENCRYPTION_KEY" ]; then
    export ENCRYPTION_KEY="$(openssl rand -hex 16)"
    echo "Generated ENCRYPTION_KEY: $ENCRYPTION_KEY"
fi

# Set defaults for HOST and PORT if not set
export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-1337}"
export NODE_ENV="${NODE_ENV:-production}"

# Execute the main command (Strapi)
exec "$@"