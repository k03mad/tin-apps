import env from './env.js';

const WWW_FOLDER = './app/www';

export const SERVER = {
    url: `http://localhost:${env.server.port}`,
    static: `${WWW_FOLDER}/static`,
};

export const HANDLEBARS = {
    views: `${WWW_FOLDER}/views`,
    ext: '.hbs',
};

export const TINKOFF = {
    request: {
        url: 'https://www.tinkoff.ru/apps/',
        cache: {
            seconds: 5 * 60,
        },

        ua: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) '
          + 'AppleWebKit/537.36 (KHTML, like Gecko) '
          + 'Chrome/90.0.4430.91 Mobile Safari/537.36',
    },

    response: {
        element: '#__TRAMVAI_STATE__',
        re: /[^"]+apk/g,
    },
};

export const PAGE = {
    timestamps: 10,
    ua: 100,
};
