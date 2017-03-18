/**
 * A library for interacting with your Philips Hue lights. Pretty much just
 * sets a scene for now.
 */

const hue = require('node-hue-api');
const _ = require('lodash');
const config = require('./config');

const lights = new hue.HueApi(config.lightsHost, config.lightsUsername);

/**
 * Normalizes the scene name to a standard lower and kebab case format.
 *
 * @private
 * @param {string} sceneName - The scene name.
 * @returns {string} The normalized scene name.
 */
function normalizeSceneName(sceneName) {
    return _.replace(_.toLower(sceneName), ' ', '-');
}

/**
 * Queries the Hue API for all scenes and finds the one with the corresponding
 * `sceneName`. Note: The Hue allows for multiple scenes with the same name.
 * This function returns the first scene matching the `sceneName`.
 *
 * @private
 * @param {string} sceneName - The scene name.
 * @returns {Object} A scene object.
 */
function findSceneByName(sceneName) {
    return new Promise((resolve, reject) => {
        lights.getScenes()
            .then((scenes) => {
                return _.find(scenes, (scene) => {
                    return (normalizeSceneName(scene.name) === normalizeSceneName(sceneName));
                });
            })
            .done((scene) => {
                resolve(scene);
            });
    });
}

/**
 * Sets the scene!
 *
 * @param {string} sceneName - The scene name.
 */
function setScene(sceneName) {
    findSceneByName(sceneName)
        .then((scene) => {
            lights.activateScene(scene.id);
        });
}

module.exports = {
    setScene: setScene,
}
