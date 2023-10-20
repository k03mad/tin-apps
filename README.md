# TIN-APPS

## WTF

— HTTP-сервер\
— Отдаёт страницу со ссылками на все Android-приложения Тинькофф\
— Ссылки парсятся [с официального сайта](https://www.tinkoff.ru/apps/)\
— Можно использовать [в Obtainium](https://github.com/ImranR98/Obtainium)

## Запуск

```bash
npm run start --port=3030
open http://localhost:3030/apps
```

## Obtainium

### tinkoff-bank

1. URL-источник: `http://ваш-домен:3030/apps`
2. Фильтр ссылок: `tinkoff-bank-([\d-]+)\.apk`
3. Извлечение версии: `tinkoff-bank-([\d-]+)\.apk`
4. Группа для извлечения версии: `1`
