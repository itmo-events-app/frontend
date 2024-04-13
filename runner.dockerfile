FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# in foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]
