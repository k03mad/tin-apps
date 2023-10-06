# Tinkoff apps for Obtainium

## WTF

— Simple HTTP server\
— Contains all Tinkoff Android apks list\
— Parsed from [official site](https://www.tinkoff.ru/apps/)\
— For using in [Obtainium](https://github.com/ImranR98/Obtainium)

## How to start

```bash
npm run start --port=3030
open http://localhost:3030/apps
```

## How to use in Obtainium

### Bank app

1. Add Source URL: `http://your-domain:3030/apps`
2. Custom APK Link Filter: `tinkoff-bank.+apk`
3. Version Extraction RegEx: `-([\d.-]+)\.apk`
4. Match Group To Use: `1`

### Mobile app

1. Add Source URL: `http://your-domain:3030/apps`
2. Custom APK Link Filter: `Tinkoff_Mobile.+apk`
3. Version Extraction RegEx: `_([\d._]+)\.apk`
4. Match Group To Use: `1`
