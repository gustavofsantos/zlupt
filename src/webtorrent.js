const WebTorrent = require('webtorrent-hybrid');
const fs = require('fs');
const ppf = require('./pretty-path-formatter');

let wtorrent, db;

/**
 * initialize variables if not initialized yet
 */
function initIfNotInitializedYet() {
    if (!wtorrent) wtorrent = new WebTorrent();
    if (!db) db = new Map();
}

/**
 * Seed a file
 * @param {string} path
 * @param {function} handler
 */
function seedFile(path, handler) {
    initIfNotInitializedYet();
    if (!db.get(path)) {
        wtorrent.seed(path, torrent => {
            db.set(path, torrent.magnetURI)
            handler(torrent);
        });
    }
}

/**
 * Download files from a magnetURI
 * @param {string} magnetURI
 * @param {function} handler
 */
function downloadFile(magnetURI, handler) {
    initIfNotInitializedYet();
    wtorrent.add(magnetURI, torrent => {
        const files = torrent.files;
        let length = files.length;
        files.forEach(file => {
            const source = file.createReadStream();
            const destination = fs.createWriteStream(file.name);
            source.on('end', () => {
                if (!--length) {
                    handler();
                    return;
                }
            }).pipe(destination);
        })
    })
}

/**
 * Destroy the webtorrent
 * @param done
 * @param error
 */
function terminate(done, error) {
    wtorrent.destroy(e => {
        if (e) error(e);
        else done();
    })
}


module.exports = {
    seedFile,
    downloadFile,
    terminate
};