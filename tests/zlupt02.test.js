const zz = require('zilez');

const feed = require('../src/feed');
const logger = require('../src/logger');
const webt = require('../src/webtorrent');

feed.restore('ee4f44663386a236dd12651d94d243cf815c7d70ecaca32e60148bbfdaddc923', 
    '/home/gustavo/workspace/zlupt/feed_test/zlupt02', 
    key => {
        console.log(logger.info(`Key: ${key}`));
        feed.discoverable((peer, info) => {
            console.log(logger.success(' [PEER] New peer.'));
            peer.on('close', () => {
                console.log(logger.warning(' [PEER] Peer disconected'));
            })
        });
        feed.listen(d => {
            console.log(' [FEED] ' + logger.text(d));
        });

        zz.observe('/home/gustavo/workspace/zlupt/feed_test/zlupt02', p => {
            console.log(' [ ZZ ] ' + logger.success(JSON.stringify(p)));
            feed.send(JSON.stringify(p));
        });
    }
);