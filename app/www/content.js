import {requestCache} from '@k03mad/request';

import {PAGE, TINKOFF} from '../../config.js';
import {getSelectorText} from '../helpers/html.js';

const timestamps = [];
const useragents = new Set();

/**
 * @returns {Promise<Set<string>>}
 */
const parseAppsLinks = async () => {
    const {body} = await requestCache(TINKOFF.request.url, {
        headers: {'user-agent': TINKOFF.request.ua},
    }, {expire: TINKOFF.request.cacheSeconds});

    const text = getSelectorText(body, TINKOFF.response.element);
    const hrefs = text.match(TINKOFF.response.re);

    if (hrefs?.length > 0) {
        return new Set(hrefs);
    }

    throw new Error([
        'Не удалось распарсить ссылки на приложения',
        `url: ${TINKOFF.request.url}`,
        `selector: ${TINKOFF.response.element}`,
        `re: ${TINKOFF.response.re}`,
    ].join('\n'));
};

/**
 * @param {object} opts
 * @param {object} opts.req
 * @returns {Promise<{
 *      links: {main: string, apps: Array<string>},
 *      visitors: {timestamps: Array<string>, useragents: Array<string>}
 * }>}
 */
export default async ({req}) => {
    const now = Date.now();
    const parsedAppsLinks = await parseAppsLinks();
    const timings = Date.now() - now;

    const ua = req.headers?.['user-agent'];

    if (ua) {
        useragents.add(ua);
    }

    timestamps.push(`${new Date().toISOString()} ${String(timings).padStart(4, ' ')} ms`);

    if (timestamps.length > PAGE.timestamps) {
        timestamps.splice(0, 1);
    }

    if (useragents.size > PAGE.ua) {
        useragents.delete([...useragents][0]);
    }

    return {
        links: {
            main: TINKOFF.request.url,
            apps: parsedAppsLinks,
        },
        visitors: {
            timestamps: [...timestamps].reverse(),
            useragents: [...useragents].sort(),
        },
    };
};
