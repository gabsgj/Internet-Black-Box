#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Running Backend Verification Script ==="

# 1. Start the backend if not already running on port 8080
PORT=8080
trap 'FINAL_PID=$(lsof -t -i:$PORT || true); if [ -n "$FINAL_PID" ]; then kill -15 "$FINAL_PID" 2>/dev/null || true; fi' EXIT INT TERM
PID=$(lsof -t -i:$PORT || true)

if [ -z "$PID" ]; then
    echo "Backend is not running on port $PORT. Starting backend..."
    cd backend
    mvn spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    echo "Backend started with PID $BACKEND_PID. Waiting for port $PORT to open..."
    # Wait for the backend to start up
    for i in {1..30}; do
        if lsof -i :$PORT >/dev/null 2>&1; then
            echo "Backend successfully bound to port $PORT."
            break
        fi
        sleep 2
    done
    if ! lsof -i :$PORT >/dev/null 2>&1; then
        echo "Error: Backend failed to start on port $PORT."
        exit 1
    fi
else
    echo "Backend is already running on port $PORT (PID: $PID)."
fi

# 2. Hit mock Sentry webhook
echo "Sending mock Sentry webhook..."
SENTRY_PAYLOAD='{
  "message": "Database connection timeout under heavy checkout load",
  "level": "fatal",
  "project_name": "checkout-service",
  "project": "checkout-service"
}'

RESPONSE_WEBHOOK=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$SENTRY_PAYLOAD" \
  http://localhost:8080/api/webhooks/sentry)

WEBHOOK_STATUS=$(echo "$RESPONSE_WEBHOOK" | tail -n 1)
echo "Sentry Webhook response HTTP status: $WEBHOOK_STATUS"

if [ "$WEBHOOK_STATUS" -ne 200 ]; then
    echo "Error: Webhook POST failed with status $WEBHOOK_STATUS"
    exit 1
fi

# Give the async webhook processing and Neo4j writing some time
echo "Waiting 3 seconds for asynchronous webhook processing..."
sleep 3

# 3. Retrieve incidents list
echo "Retrieving incidents list..."
INCIDENTS_JSON=$(curl -s http://localhost:8080/api/incidents)

echo "Raw Incidents List JSON:"
echo "$INCIDENTS_JSON" | jq .

# Validate JSON format
if ! echo "$INCIDENTS_JSON" | jq -e . >/dev/null 2>&1; then
    echo "Error: Invalid JSON returned from /api/incidents"
    exit 1
fi

# Validate created incident exists in the returned list
# Sentry critical webhook auto-creates an incident with status 'OPEN', severity 'P1', triggeredBy 'auto-anomaly'
# and title containing the Sentry message.
MATCHING_INCIDENT=$(echo "$INCIDENTS_JSON" | jq -e '.[] | select(.triggeredBy == "auto-anomaly" and (.title | contains("Database connection timeout")))')

if [ -z "$MATCHING_INCIDENT" ]; then
    echo "Error: Could not find the auto-anomaly triggered incident in the incidents list."
    exit 1
else
    echo "Success: Found matching auto-triggered incident in database!"
    echo "$MATCHING_INCIDENT" | jq .
fi

# 4. Graceful shutdown
echo "Shutting down backend on port $PORT..."
FINAL_PID=$(lsof -t -i:$PORT || true)
if [ -n "$FINAL_PID" ]; then
    echo "Sending SIGTERM to process $FINAL_PID..."
    kill -15 "$FINAL_PID"
    
    # Wait for process to terminate
    for i in {1..15}; do
        if ! lsof -i :$PORT >/dev/null 2>&1; then
            echo "Backend shut down successfully."
            break
        fi
        sleep 1
    done
    
    if lsof -i :$PORT >/dev/null 2>&1; then
        echo "Warning: Backend did not shut down gracefully. Sending SIGKILL..."
        kill -9 "$FINAL_PID"
    fi
else
    echo "No process running on port $PORT."
fi

echo "=== Backend Verification Script Completed ==="
