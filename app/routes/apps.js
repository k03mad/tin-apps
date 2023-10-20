import express from 'express';

import getContentData from '../www/content.js';

const router = new express.Router();

export default router.get(
    '/apps', async (req, res, next) => {
        try {
            const data = await getContentData({req});
            res.render('apps', data);
        } catch (err) {
            next(err);
        }
    },
);
