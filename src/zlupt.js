const zz = require('zilez');
const argv = require('yargs').argv;

const feed = require('./feed');
const logger = require('./logger');
// const webt = require('./webtorrent');

function cli() {
    function start(key) {
        console.log(logger.info(`Key: ${key}`));
        feed.discoverable((peer, info) => {
            console.log(logger.success('New peer.'));
            peer.on('close', () => {
                console.log(logger.warning('Peer disconected'));
            })
        });
        feed.listen(d => {
            console.log(' [FEED] ' + logger.text(JSON.stringify(d)));
        });

        zz.observe(argv.path, p => {
            console.log(' [ ZZ ] ' + logger.success(p));
            feed.send(JSON.stringify(p), () => {
                console.log('[FEED] Sended.');
            });
        });
    }

    if (argv.key) {
        feed.restore(argv.key, argv.path, start);
    }
    else {
        feed.init(argv.path, start);
    }
}

cli();