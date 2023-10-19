import {requestCache} from '@k03mad/request';
import * as cheerio from 'cheerio';

const REQUEST_APPS_URL = 'https://www.tinkoff.ru/apps/';
const REQUEST_CACHE_SECONDS = 5 * 60;

const REQUEST_UA = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) '
                 + 'AppleWebKit/537.36 (KHTML, like Gecko) '
                 + 'Chrome/90.0.4430.91 Mobile Safari/537.36';

const RESPONSE_HTML_CONFIG_ELEMENT = '#__TRAMVAI_STATE__';
const RESPONSE_HTML_CONFIG_APK_REGEXP = /[^"]+apk/g;

const RENDER_MAX_TIMESTAMPS = 10;
const RENDER_MAX_UA = 100;

const timestamps = [];
const useragents = new Set();

/**
 * @param {string} html
 * @param {string} selector
 * @returns {string}
 */
const getElementText = (html, selector) => {
    const $ = cheerio.load(html);
    return $(selector).text();
};

/**
 * @returns {Promise<Set<string>>}
 */
const parseLinks = async () => {
    const {body} = await requestCache(REQUEST_APPS_URL, {
        headers: {'user-agent': REQUEST_UA},
    }, {expire: REQUEST_CACHE_SECONDS});

    const config = getElementText(body, RESPONSE_HTML_CONFIG_ELEMENT);
    const hrefs = config.match(RESPONSE_HTML_CONFIG_APK_REGEXP);

    return new Set(hrefs);
};

/**
 *
 * @param {object} opts
 * @param {string} opts.ua
 * @param {number|string} opts.timings
 */
const updateInfo = ({timings, ua = 'unknown'}) => {
    useragents.add(ua);
    timestamps.push(`${new Date().toISOString()} ${String(timings).padStart(4, ' ')} ms`);

    if (timestamps.length > RENDER_MAX_TIMESTAMPS) {
        timestamps.splice(0, 1);
    }

    if (useragents.size > RENDER_MAX_UA) {
        useragents.delete([...useragents][0]);
    }
};

/**
 * @param {object} req
 * @returns {Promise<string>}
 */
export default async req => {
    const now = Date.now();
    const hrefs = await parseLinks();

    updateInfo({
        ua: req.headers?.['user-agent'],
        timings: Date.now() - now,
    });

    const html = `
        <head>
            <title>Tin Apps</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css">
            <style>
                body {
                    background: #19181D;
                    font-family: 'Fira Code VF', Arial;
                    font-size: 14px;
                }

                a {
                    text-decoration: none;
                    color: #8282FF;
                }

                .main-link {
                    color: #FF82FF;
                }

                [class$=info] {
                    font-size: 14px;
                    color: #778899;
                }

                [class*=title-info] {
                    font-weight: bold;
                }

                [class*=items-info] {
                    margin-block-start: 0px;
                    margin-block-end: 0px;
                }
            </style>
            </head>
        <body>
            <p><a class="main-link" href=${REQUEST_APPS_URL}>${REQUEST_APPS_URL}</a>
            <hr>
            ${[...hrefs].map(href => `<p><a href="${href}">${href}</a>`).join('')}
            <hr>
            <p class="timestamp-title-info">Updated:
            ${[...timestamps].reverse().map(timestamp => `<p class="timestamp-items-info">— ${timestamp}`).join('')}
            <p class="ua-title-info">Visitors:
            ${[...useragents].sort().map(ua => `<p class="ua-items-info">— ${ua}`).join('')}
        </body>
    `;

    return html;
};
