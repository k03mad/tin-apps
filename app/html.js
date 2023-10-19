import {
    parseLinks,
    REQUEST_APPS_URL,
    timestamps,
    updateInfo,
    useragents,
} from './helpers/site.js';

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

    return `
        <head>
            <title>Tin Apps</title>
            <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png">
            <link rel="manifest" href="/manifest/site.webmanifest">
            <link rel="stylesheet" href="/css/main.css">
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
};
