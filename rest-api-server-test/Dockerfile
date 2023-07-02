# Base image
FROM golang:1.20-alpine

# Set working directory
WORKDIR /app

# Copy go.mod and go.sum
COPY go.mod go.sum ./

# Download Go dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the Go application
RUN go build -o main .

# Expose the port on which the Go app will run (e.g., 8080)
EXPOSE 8080

# Start the Go app
CMD [ "./main" ]
