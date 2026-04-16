# Stage 1: Build the Vite App
FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package.json ./ 
RUN npm install

COPY frontend/ .

ENV VITE_API_URL=http://localhost:8000
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
