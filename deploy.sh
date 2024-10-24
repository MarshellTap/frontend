#!/bin/bash

cd /var/www/frontend

echo "Pulling latest changes from GitHub..."
git pull origin main

echo "Forcing local state to match remote..."
git fetch origin main
git reset --hard origin/main

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Restarting marshell-frontend with PM2..."
pm2 restart marshell-frontend || pm2 start npm --name "marshell-frontend" -- run preview

pm2 save

echo "Update, build, and restart completed!"
