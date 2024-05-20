# Dockerfile for deploying Quickdraw endpoints on a container
# Authors: Ilan ALIOUCHOUCHE, Ilyes DJERFAF, Nazim KESKES, Romain DELAITRE

FROM nginx:alpine

COPY app/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]