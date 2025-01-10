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

## Copy package.json from infrastructure directory
COPY ./package*.json ./

RUN npm install && \
    npm install -g aws-cdk && \
    npm install -g aws-cdk-local && \
    # Set NODE_PATH to include global modules
    echo "export NODE_PATH=$(npm root -g)" >> /root/.bashrc

# Setup AWS configuration
RUN mkdir -p /root/.aws
COPY .aws/* /root/.aws/

# Copy infrastructure directory content
COPY . ./

RUN chmod +x deploy.sh 


# Compile TypeScript to JavaScript
RUN npm run build


#Configuring a custom profile
#RUN mkdir /root/.aws && \
#  echo "[profile localstack]\nregion=us-west-2\noutput=json\nendpoint_url = http://localstack:4566" > /root/.aws/config && \
#  echo "[localstack]\naws_access_key_id=test\naws_secret_access_key=test" > /root/.aws/credentials

# runs the container as an executable 
#CMD [ "/bin/bash" ]
ENTRYPOINT [ "/app/infrastructure/deploy.sh" ]

