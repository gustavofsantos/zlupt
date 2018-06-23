const chalk = require('chalk');

const config = {
    showDate: true,
    showTime: true,
    marks: {
        text: ' ',
        info: '*',
        success: '+',
        warning: '!',
        error: '-'
    },
    colors: {
        dateTime: '',
        normal: '',
        info: '',
        success: '',
        error: '',
        warning: ''
    }
}

function setConfig(cfg) {
    config.showDate = cfg.showDate || config.showDate;
    config.showTime = cfg.showDate || config.showTime;
    config.marks.text = cfg.marks.text || config.marks.text;
}

function prefixed() {
    let line = '';
    const now = new Date();
    if (config.showDate) line += ` ${now.toDateString()} `;
    if (config.showTime) line += ` ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} `;
    return line;
}

function buildLog(type, message) {
    let line = prefixed();
    line += ` [${config.marks[type]}] `;
    line += message;
    return line;
}

function text(message) {
    return buildLog('text', message);
}

function info(message) {
    return buildLog('info', message);
}

function success(message) {
    return buildLog('success', message);
}

function warning(message) {
    return buildLog('warning', message);
}

function error(message) {
    return buildLog('error', message);
}

module.exports = {
    text,
    info,
    warning,
    success,
    error,
    setConfig
}