# Развёртывание статической сборки на Ubuntu 22.04 с Caddy

Ниже описан процесс, как локально собрать проект, перенести статические файлы на сервер с Ubuntu 22.04 и настроить веб-сервер Caddy для их отдачи по HTTPS.

## 1. Локальная подготовка

1. Установите зависимости (используйте менеджер пакетов, который применяете в проекте):
   ```bash
   pnpm install --frozen-lockfile
   ```
   > Для `npm`: `npm ci`

2. Выполните production-сборку Next.js (режим `output: "export"` уже настроен в `next.config.mjs`, поэтому статический сайт появится автоматически):
   ```bash
   pnpm build
   ```
   > Для `npm`: `npm run build`

   После сборки в корне проекта появится директория `out/` — это и есть итоговые статические файлы, готовые к публикации.

## 2. Копирование файлов на сервер

1. Подключитесь к серверу по SSH и создайте директорию для сайта, например:
   ```bash
   sudo mkdir -p /var/www/toolbox
   sudo chown $USER:$USER /var/www/toolbox
   ```

2. Скопируйте содержимое папки `out/` на сервер (пример с `rsync`):
   ```bash
   rsync -avz out/ user@server:/var/www/toolbox/
   ```
   Замените `user@server` на свои SSH-данные. Путь `/var/www/toolbox/` должен совпадать с тем, что указали выше.

## 3. Установка и настройка Caddy на Ubuntu 22.04

1. Установите Caddy из официального репозитория:
   ```bash
   sudo apt update
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-stable.asc
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install -y caddy
   ```

2. Создайте или отредактируйте `/etc/caddy/Caddyfile`. Пример конфигурации для `example.com`:
   ```
   example.com {
       root * /var/www/toolbox
       file_server
   }
   ```
   - `root` указывает на каталог, куда вы загрузили содержимое `out/`.
   - `file_server` включает отдачу статических файлов.

3. Примените конфигурацию:
   ```bash
   sudo caddy reload
   ```

4. Убедитесь, что DNS-запись домена (`A`/`AAAA`) указывает на IP вашего сервера. При первом запросе Caddy автоматически выпустит TLS-сертификат Let’s Encrypt.

## 4. Проверка

1. Проверьте логи Caddy, если нужно:
   ```bash
   sudo journalctl -u caddy -f
   ```
2. Откройте в браузере `https://example.com` — сайт должен загрузиться по HTTPS.

## Полезные заметки

- При обновлении сайта достаточно заново выполнить `pnpm build` (или `npm run build`) и синхронизировать обновлённую директорию `out/` на сервер.
- Если нужно поддерживать несколько окружений (стейдж, прод), создайте отдельные каталоги и блоки в `Caddyfile`.
- Caddy автоматически продлевает сертификаты, поэтому дополнительной настройки cron не требуется.
