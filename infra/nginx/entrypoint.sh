#!/bin/sh
set -e

# 환경변수 치환 (직접 nginx.conf에 적용)
envsubst '${API_HOST} ${API_PORT} ${NGINX_PORT}' \
  < /etc/nginx/nginx.conf \
  > /etc/nginx/nginx.conf.tmp

mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf

# Nginx 실행 (foreground)
exec nginx -g "daemon off;"