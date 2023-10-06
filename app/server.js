import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import env from '../env.js';
import {generateHTML, parse} from './apks.js';
import {nameText, numText} from './helpers/colors.js';
import {log, logPlainError} from './helpers/logging.js';
import {packageJson} from './helpers/parse.js';

const app = express();

if (env.debug) {
    app.use(morgan('combined'));
}

app.use(helmet());
app.use(compression());

app.get('/apps', async (req, res) => {
    try {
        const apks = await parse();
        res.send(generateHTML(apks));
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
