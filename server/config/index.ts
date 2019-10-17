const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const Config = (() => {
    console.log('config file loading.....');
    let config = {};
    fs.readdirSync(__dirname)
        .filter(f => f.endsWith('.js'))
        .forEach((f) => {
            const _config = require(__dirname + '/' + f);
            config = Object.assign({}, config, _config);
        });

    const env = process.env.NODE_ENV || 'testing'; // 临时之举，tars测试环境设置不了私有模版
    let fpath = path.normalize(__dirname + '/env/' + env + '.js');
    if (fs.existsSync(fpath)) {
        const _config = require(fpath);
        config = _.merge({}, config, _config);
    }

    fpath = path.normalize(__dirname + '/env/' + env);

    fs.existsSync(fpath) &&
        fs
            .readdirSync(fpath)
            .filter(f => f.endsWith('.js'))
            .forEach((f) => {
                const _config = require(fpath + '/' + f);
                config = _.merge({}, config, _config);
            });
    return config;
})();

module.exports = Config;
