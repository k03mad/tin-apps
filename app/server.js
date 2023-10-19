import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import env from '../env.js';
import {nameText, numText} from './helpers/colors.js';
import {log, logPlainError} from './helpers/logging.js';
import {packageJson} from './helpers/parse.js';
import generateHTML from './html.js';

const APPS_ROUTE = '/apps';

const app = express();

if (env.debug) {
    app.use(morgan('combined'));
}

app.use(helmet());
app.use(compression());
app.use(express.static('app/static'));

app.get(APPS_ROUTE, async (req, res) => {
    try {
        const html = await generateHTML(req);
        res.send(html);
    } catch (err) {
        logPlainError(err);
        res.sendStatus(500);
    }
});

// not send anything => connectionfailure at browser
// eslint-disable-next-line no-empty-function
app.get('*', () => {});

app.listen(env.server.port, () => log([
    `[${new Date().toLocaleString()}]`,
    nameText(packageJson.name),
    'started',
    numText(`http://localhost:${env.server.port}${APPS_ROUTE}`),
].join(' ')));
