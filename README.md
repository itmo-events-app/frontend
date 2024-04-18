# events-app-frontend

## Docker compose

Edit `public/config.js` to pass urls to backends or mount file as a volume.

### Build

```sh
docker compose [--profile frontend] build
```

### Deploy

```sh
docker compose [--profile frontend] up [-d]
```

Default port: `5573`

### Down

```sh
docker compose [--profile frontend] down [--volumes]
```

