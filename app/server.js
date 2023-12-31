import compression from 'compression';
import express from 'express';
import {engine} from 'express-handlebars';
import {rateLimit} from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import {HANDLEBARS, SERVER} from '../config.js';
import env from '../env.js';
import {nameText, numText} from './helpers/colors.js';
import {getRoutePath} from './helpers/express.js';
import {log} from './helpers/logging.js';
import {packageJson} from './helpers/parse.js';
import routes from './routes/_index.js';

const app = express();

env.debug && app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.static(SERVER.static));

app.engine(HANDLEBARS.ext, engine({extname: HANDLEBARS.ext}));
app.set('view engine', HANDLEBARS.ext);
app.set('views', HANDLEBARS.views);

routes.forEach(route => {
    const path = getRoutePath(route);
    path && app.use(path, rateLimit(SERVER.rates));

    app.use(route);
});

app.listen(env.server.port, () => log([
    `[${new Date().toLocaleString()}] ${nameText(packageJson.name)} started`,
    ...routes
        .map(elem => getRoutePath(elem))
        .filter(elem => Boolean(elem) && elem !== '*')
        .map(elem => numText(SERVER.url + elem)),
]));
