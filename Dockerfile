# Use an official Python runtime as a parent image
FROM python:3.9

# Set environment variables
ENV AWS_DEFAULT_REGION=us-east-1
ENV AWS_ACCESS_KEY_ID=test
ENV AWS_SECRET_ACCESS_KEY=test

# Install necessary tools
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install AWS CLI and AWS SAM CLI
RUN pip install --no-cache-dir awscli aws-sam-cli

# Install development dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set up working directory
WORKDIR /app/sour

# Copy your Sour application code
COPY . .

# Expose port for the application
EXPOSE 3000

# Start your Sour application
CMD ["sam", "local", "start-api", "--host", "0.0.0.0", "--docker-network", "sour-network"]
