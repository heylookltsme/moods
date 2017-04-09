/**
 * Moods Server.
 *
 * Listens for HTTP requests on the `serverPort` specified in config.js.
 *
 * Currently supports the following url patterns:
 * - /scene?scene=<scene name, required>&music=<1 or 0, optional>
 */

const http = require('http');
const url = require('url');
const qs = require('querystring');
const _ = require('lodash');

const lights = require('./lights');
const music = require('./music');
const config = require('./config');

const port = config.serverPort;

/**
 * Responses to a scene request. Sets the scene and optionally plays music.
 *
 * @param {Object} params - The query params.
 */
function handleScene(params) {
    lights.setScene(_.get(params, 'scene'));

    if (_.get(params, 'music') == 1) { // eslint-disable-line eqeqeq
        music.play(); // todo: this currently isn't working right - play and pause just toggle
                      // the current state. need to check status
    } else {
        music.pause();
    }
}

/**
 * Handles the incoming request object.
 *
 * @param {Object} request - The request object.
 */
function handleRequest(request) {
    const parts = url.parse(_.get(request, 'url'));
    const params = qs.parse(_.get(parts, 'query'));

    switch (_.get(parts, 'pathname')) {
        case '/scene':
            handleScene(params);
            break;
        default:
            break;
    }
}

http.createServer(handleRequest).listen(port, () => {
    console.log('Server listening on: http://localhost:%s", port'); // eslint-disable-line no-console
});
