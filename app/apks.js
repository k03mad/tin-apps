import {requestCache} from '@k03mad/request';

const APPS_URL = 'https://www.tinkoff.ru/apps/';
const APK_REGEXP = /[^"]+apk/g;
const CACHE_REQUEST_SECONDS = 5 * 60;

const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) '
                 + 'AppleWebKit/537.36 (KHTML, like Gecko) '
                 + 'Chrome/90.0.4430.91 Mobile Safari/537.36';

/**
 * @returns {Promise<Set<string>>}
 */
export const parse = async () => {
    const {body} = await requestCache(APPS_URL, {
        headers: {'user-agent': ANDROID_UA},
    }, {expire: CACHE_REQUEST_SECONDS});

    const matched = body.matchAll(APK_REGEXP);
    const hrefs = [...matched].map(elem => elem[0]);

    return new Set(hrefs);
};

/**
 * @param {Set<string>} hrefs
 * @returns {string}
 */
export const generateHTML = hrefs => `
    <head>
        <title>Tin Apps</title>
        <style>
            body {
                background: rgb(25, 24, 29);
                font-family: Arial;
                font-size: 100vw;
            }

            a {
                text-decoration: none;
                color: rgb(130,130,255);
            }
        </style>
        </head>
    <body>
        ${[...hrefs].sort().map(elem => `<p><a href="${elem}">${elem}</a>`).join('')}
    </body>
`;
