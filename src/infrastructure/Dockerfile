# Use Ubuntu as the base image
FROM ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set the working directory
WORKDIR /app/infrastructure

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    python3 \
    python3-pip \
    vim \ 
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install AWS CLI and LocalStack
RUN pip3 install awscli awscli-local

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Copy the rest of your CDK code
COPY . .

#Configuring a custom profile
RUN mkdir /root/.aws && \
  echo "[profile localstack]\nregion=us-west-2\noutput=json\nendpoint_url = http://localstack:4566" > /root/.aws/config && \
  echo "[localstack]\naws_access_key_id=test\naws_secret_access_key=test" > /root/.aws/credentials

RUN chmod +x deploy.sh 

ENTRYPOINT [ "/app/infrastructure/deploy.sh" ]
