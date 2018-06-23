const hypercore = require('hypercore');
const hyperdiscovery = require('hyperdiscovery');
const ram = require('random-access-memory');

let feed, swarm;

function init(path, listener) {
    if (path)
        feed = hypercore(path);
    else 
        feed = hypercore(() => ram());

    feed.on('ready', () => {
        listener(feed.key.toString('hex'));
    });
}
    
function restore(hash, path, listener) {
    if (path)
        feed = hypercore(path, hash);
    else 
        feed = hypercore(() => ram(), hash);
    
    feed.on('ready', () => {
        listener(feed.key.toString('hex'));
    });
}

function discoverable(listener) {
    swarm = hyperdiscovery(feed);
    swarm.on('connection', listener);
}

function send(package, listener) {
    feed.append(package, listener);
}

function listen(listener) {
    feed.on('append', () => {
        feed.head((e, data) => {
            listener(data);
        })
    })
}

module.exports = { 
    init, 
    restore,
    discoverable,
    send,
    listen,
}