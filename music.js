const SqueezeServer = require('squeezenode-lordpengwin');
const _ = require('lodash');
const config = require('./config');

/**
 * A lil library for controlling my squeezebox.
 */
class Squeezebox {
    /**
     * @constructor
     * Creates a new server instance and finds and assigns the appropriate player.
     */
    constructor(playerName = 'squeezeboxtastic') { // todo: add to config; make it easier to customize on instantiation
        this.server = new SqueezeServer(`http://${config.musicHost}`, config.musicPort);  // todo: config file
        this.server.on('register', () => {
            this.setPlayer(playerName);
        });
    }

    /**
     * Returns the player.
     *
     * @returns {Object} Player object.
     */
    getPlayer() {
        return this.player;
    }

    /**
     * Sets the player.
     *
     * @param {string} playerName - The name of the player we want to use.
     */
    setPlayer(playerName) {
        this.findPlayerByName(playerName).then((player) => {
            this.player = player;
        });
    }

    /**
     * Find a player by it's name.
     *
     * @private
     * @param {string} playerName - The name of the player we want to use.
     * @returns {Promise} A promise that resolves with the player object.
     */
    findPlayerByName(playerName) {
        // todo: error handling if player isn't found
        return new Promise((resolve, reject) => {
            this.server.getPlayers((response) => {
                const player = _.find(response.result, (p) => {
                    return p.name === playerName;
                });
                if (_.get(player, 'playerid')) {
                    resolve(this.server.players[player.playerid]);
                } else {
                    reject('Can\'t find player.');
                }
            });
        });
    }

    /**
     * Sends a play command to the player.
     */
    play() {
        this.player.play();
    }

    /**
     * Send a pause command to the player.
     */
    pause() {
        this.player.pause();
    }

    // todo: playing status, find and play by artist, album and genre.
}

module.exports = new Squeezebox(); // singleton, yo.
