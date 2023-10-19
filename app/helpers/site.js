import {requestCache} from '@k03mad/request';
import * as cheerio from 'cheerio';

const REQUEST_CACHE_SECONDS = 5 * 60;

const REQUEST_UA = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) '
                 + 'AppleWebKit/537.36 (KHTML, like Gecko) '
                 + 'Chrome/90.0.4430.91 Mobile Safari/537.36';

const RESPONSE_HTML_CONFIG_ELEMENT = '#__TRAMVAI_STATE__';
const RESPONSE_HTML_CONFIG_APK_REGEXP = /[^"]+apk/g;

const RENDER_MAX_TIMESTAMPS = 10;
const RENDER_MAX_UA = 100;

export const REQUEST_APPS_URL = 'https://www.tinkoff.ru/apps/';

export const timestamps = [];
export const useragents = new Set();

/**
 * @returns {Promise<Set<string>>}
 */
export const parseLinks = async () => {
    const {body} = await requestCache(REQUEST_APPS_URL, {
        headers: {'user-agent': REQUEST_UA},
    }, {expire: REQUEST_CACHE_SECONDS});

    const $ = cheerio.load(body);

    const config = $(RESPONSE_HTML_CONFIG_ELEMENT).text();
    const hrefs = config.match(RESPONSE_HTML_CONFIG_APK_REGEXP);

    return new Set(hrefs);
};

/**
 * @param {object} opts
 * @param {string} opts.ua
 * @param {number|string} opts.timings
 */
export const updateInfo = ({timings, ua}) => {
    if (ua) {
        useragents.add(ua);
    }

    timestamps.push(`${new Date().toISOString()} ${String(timings).padStart(4, ' ')} ms`);

    if (timestamps.length > RENDER_MAX_TIMESTAMPS) {
        timestamps.splice(0, 1);
    }

    if (useragents.size > RENDER_MAX_UA) {
        useragents.delete([...useragents][0]);
    }
};
