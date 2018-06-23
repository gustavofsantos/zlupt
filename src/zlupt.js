const zz = require('zilez');

const feed = require('./feed');
const logger = require('./logger');
const webt = require('./webtorrent');

feed.init('/home/gustavo/workspace/zlupt/feed_test', key => {
    console.log(logger.info(`Key: ${key}`));
    feed.discoverable((peer, info) => {
        console.log(logger.success('New peer.'));
        peer.on('close', () => {
            console.log(logger.warning('Peer disconected'));
        })
    });
    feed.listen(d => {
        console.log(logger.text(d));
    });

    zz.observe('/home/gustavo/workspace/zlupt/feed_test', p => {
        console.log(logger.success(p));
        feed.send(JSON.stringify(p));
    });
});