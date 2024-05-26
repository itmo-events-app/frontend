# Репозиторий фронтенда сервиса

## Конфигурация

1. Укажите в `public/config.js` адрес бекенда
1. Создайте файл `.env` заполнив значениями отсюда https://github.com/itmo-events-app/event-app/tree/main/scripts

### Сборка

```sh
docker compose [--profile frontend] build
```

### Разворачивание

```sh
docker compose [--profile frontend] up [-d]
```

Default port: `5573`

### Остановка сервиса

```sh
docker compose [--profile frontend] stop
```

### Остановка с очисткой ресурсов
```sh
docker compose [--profile frontend] down [--volumes]
```
