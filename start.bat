@echo off

echo Starting Development Server...

start "Backend" cmd /k "cd backend-learnbridge && npm run dev"
start "Frontend" cmd /k "cd frontend-learnbridge && npm run dev"

pause