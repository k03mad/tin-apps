import * as cheerio from 'cheerio';

/**
 * @param {string} body
 * @param {string} selector
 * @returns {string}
 */
export const getSelectorText = (body, selector) => {
    const $ = cheerio.load(body);
    return $(selector).text();
};
