const WebTorrent = require('webtorrent-hybrid');
const fs = require('fs');
const ppf = require('./pretty-path-formatter');

let wtorrent, db;

function initIfNotInitializedYet() {
    if (!wtorrent) wtorrent = new WebTorrent();
    if (!db) db = new Map();
}

function seedFile(path, handler) {
    initIfNotInitializedYet();
    if (!db.get(path)) {
        wtorrent.seed(path, torrent => {
            db.set(path, torrent.magnetURI)
            handler(torrent);
        });
    }
}

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
}

seedFile('/home/gustavo/workspace/zlupt/package-lock.json', torrent => {
    console.log('uri: ', torrent.magnetURI);
    downloadFile(torrent.magnetURI, () => {
        console.log('arq baixado.');
    })
})