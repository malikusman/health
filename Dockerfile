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

# Self-signed cert for Cloudflare Full SSL (origin HTTPS on 443)
RUN apk add --no-cache openssl \
  && mkdir -p /etc/nginx/certs \
  && openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/key.pem \
    -out /etc/nginx/certs/cert.pem \
    -subj "/CN=health.dev-scorpiusnetworks.com" \
  && apk del openssl

EXPOSE 80 443
