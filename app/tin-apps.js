import {request} from '@k03mad/request';

/**
 * @returns {Promise<Set<string>>}
 */
export default async () => {
    const {body} = await request('https://www.tinkoff.ru/apps/', {
        headers: {
            'user-agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
        },
    });

    const matched = body.matchAll(/[^"]+apk/g);
    const hrefs = [...matched].map(elem => elem[0]);

    return new Set(hrefs);
};
