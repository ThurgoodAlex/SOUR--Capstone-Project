# Use an official Python runtime as the base image
FROM python:alpine3.20

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

ENV PYTHONPATH=/app:$PYTHONPATH

# Install the required packages
RUN pip install -r requirements.txt

RUN echo $PYTHONPATH
# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["uvicorn", "src.app:app", "--reload","--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]
