import {logPlainError} from '../../helpers/logging.js';

/**
 * @param {Error} err
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
    logPlainError(err.stack);
    res.sendStatus(500);
};
