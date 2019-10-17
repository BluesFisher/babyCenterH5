const Redis = require('ioredis');
const Store = require('koa-session2').Store;
const { session } = require('../config');

class RedisStore extends Store {
    redis: any;

    constructor() {
        super();
        this.redis = new Redis(session);
    }

    async get(sid, ctx) {
        const data = await this.redis.get(`SESSION:${sid}`);
        return JSON.parse(data);
    }

    async set(session, { sid = this.getID(24), maxAge = 7200 } = {}, ctx) {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', session.maxAge || maxAge);
        } catch (e) {}
        return sid;
    }

    async destroy(sid, ctx) {
        const result = await this.redis.del(`SESSION:${sid}`);
        return result;
    }
}

module.exports = RedisStore;
