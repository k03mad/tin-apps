import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import env from '../env.js';
import {nameText, numText} from './helpers/colors.js';
import {log, logPlainError} from './helpers/logging.js';
import {packageJson} from './helpers/parse.js';
import parse from './tin-apps.js';

const app = express();

if (env.debug) {
    app.use(morgan('combined'));
}

app.use(helmet());
app.use(compression());

app.get('/apps', async (req, res) => {
    try {
        const apks = await parse();

        const hrefs = [...apks]
            .map(elem => `<p><a href="${elem}">${elem}</a></p>`)
            .join('\n');

        res.send(`<body>${hrefs}</body>`);
    } catch (err) {
        logPlainError(err);
        res.sendStatus(500);
    }
});

app.listen(env.server.port, () => log([
    `[${new Date().toLocaleString()}]`,
    nameText(packageJson.name),
    'started on port',
    numText(env.server.port),
].join(' ')));
