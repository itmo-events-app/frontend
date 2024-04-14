FROM node:21.1.0-slim as builder

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build.nolint


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# in foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]
