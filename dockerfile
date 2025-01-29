# Use Ubuntu as the base image
FROM ubuntu:22.04

# Avoid prompts from apt and set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Set the working directory
WORKDIR /app

# Update and install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    python3 \
    python3-pip \
    python3-venv \
    vim \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install AWS CLI and LocalStack
RUN pip3 install awscli awscli-local

# Create a Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set up AWS configuration
RUN mkdir /root/.aws && \
    echo "[profile localstack]\nregion=us-west-2\noutput=json\nendpoint_url = http://localstack:4566" > /root/.aws/config && \
    echo "[localstack]\naws_access_key_id=test\naws_secret_access_key=test" > /root/.aws/credentials

# Create a Python virtual environment
# Create startup script
# Install global npm packages
RUN npm install -g npm@latest expo-cli

# Copy package files first to leverage Docker cache
COPY src/frontend/package*.json /app/src/frontend/
COPY src/infrastructure/package*.json /app/src/infrastructure/

# Install npm dependencies
RUN cd /app/src/frontend && npm install
RUN cd /app/src/infrastructure && npm install

# Copy Python requirements and install them
COPY src/backend/requirements.txt /app/src/backend/
RUN pip install -r /app/src/backend/requirements.txt

RUN echo '#!/bin/bash\n\
echo "Available commands:"\n\
echo "start-frontend  - Start the frontend application"\n\
echo "start-backend   - Start the backend application"\n\
echo "deploy-infra    - Deploy infrastructure to LocalStack"\n\
' > /usr/local/bin/help && \
    chmod +x /usr/local/bin/help

# Add convenience scripts
RUN echo '#!/bin/bash\ncd /app/src/frontend && npm start' > /usr/local/bin/start-frontend && \
    echo '#!/bin/bash\ncd /app/src/backend && uvicorn app:app --reload --host 0.0.0.0 --port 8000 --log-level debug' > /usr/local/bin/start-backend && \
    echo '#!/bin/bash\ncd /app/src/infrastructure && ./deploy.sh' > /usr/local/bin/deploy-infra && \
    chmod +x /usr/local/bin/start-frontend /usr/local/bin/start-backend /usr/local/bin/deploy-infra

# Expose ports
EXPOSE 8000 19000 19001 19002

# Set default command
CMD ["/bin/bash"]