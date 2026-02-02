# Use Node image
FROM node:20-slim as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use an Nginx server to serve the build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Script to inject Env Vars into JS at runtime (Optional but complex)
# Easiest way for a POC: Just use a simple Express server instead of Nginx