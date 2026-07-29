# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Empty base URL → browser calls same-origin /api/... (proxied by nginx)
ARG VITE_HEALTH_API_BASE_URL=
ENV VITE_HEALTH_API_BASE_URL=$VITE_HEALTH_API_BASE_URL

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
