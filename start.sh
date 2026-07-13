#!/usr/bin/env bash

# ==============================================================================
# Internet Black Box — Hackathon Startup Orchestrator
# ==============================================================================

# Text Color Variables
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "======================================================================"
echo "    __  ______  __  __   ____  _        _    ____ _  __   ____   _____  "
# Escape backslashes for bash compliance
echo "   / / / / __ \/ / / /  / __ )| |      / \  / ___| |/ /  | __ ) / _ \ \ "
echo "  / /_/ / / / / / / /  / __  | |     / _ \ | |   | ' /   |  _ \/ / / / |"
echo " / __  / /_/ / /_/ /  / /_/ /| |___ / ___ \| |___| . \   | |_) / /_/ / /"
echo "/_/ /_/\____/\____/  /_____/ |_____/_/   \_\\____|_|\_\  |____/\____/_/ "
echo "======================================================================"
echo -e "${NC}"
echo -e "${CYAN}Launching Internet Black Box ecosystem...${NC}\n"

# Cleanup function to kill background processes on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all services...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
        echo -e "${RED}- Stopped Ingestion Backend${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
        echo -e "${RED}- Stopped Web Dashboard${NC}"
    fi
    if [ ! -z "$MOBILE_PID" ]; then
        kill "$MOBILE_PID" 2>/dev/null
        echo -e "${RED}- Stopped Mobile On-Call App${NC}"
    fi
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# 1. Start Spring Boot Backend
echo -e "${GREEN}[1/3] Starting Spring Boot Ingestion Backend...${NC}"
cd backend || exit
mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "      Backend PID: $BACKEND_PID (Logs: backend.log)"

# Wait briefly for backend port
sleep 3

# 2. Start React Frontend Dashboard
echo -e "${GREEN}[2/3] Starting Web Dashboard (React + Vite)...${NC}"
cd web-dashboard || exit
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "      Frontend PID: $FRONTEND_PID (Logs: frontend.log)"

# 3. Start Expo Mobile App
echo -e "${GREEN}[3/3] Starting Mobile App (Expo)...${NC}"
cd mobile-app || exit
npm run web > ../mobile.log 2>&1 &
MOBILE_PID=$!
cd ..
echo -e "      Mobile App PID: $MOBILE_PID (Logs: mobile.log)"

echo -e "\n${GREEN}✔ All services started successfully!${NC}"
echo -e "--------------------------------------------------------"
echo -e "${CYAN}Ingestion API:      ${NC}http://localhost:8080"
echo -e "${CYAN}Web Dashboard:      ${NC}http://localhost:5173"
echo -e "${CYAN}Expo Mobile Client: ${NC}http://localhost:8081"
echo -e "--------------------------------------------------------"
echo -e "${YELLOW}Press [Ctrl+C] to stop all background services safely.${NC}\n"

# Tail logs to keep terminal active
tail -f backend.log frontend.log mobile.log
