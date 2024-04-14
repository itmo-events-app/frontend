# events-app-frontend

## Docker compose

Edit `public/config.js` to pass urls to backends or mount file as a volume.

### Build

```sh
docker compose build
```

### Deploy

```sh
docker compose up [-d]
```

Default port: `5573`

### Down

```sh
docker compose down [--volumes]
```

