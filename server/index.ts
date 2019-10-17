const Koa = require('koa');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');

const app = new Koa();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.ts');
config.dev = !(app.env === 'production');

async function start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config);

    const { host = process.env.HOST || '127.0.0.1', port = process.env.PORT || 3001 } = nuxt.options.server;

    // Build in development
    if (config.dev) {
        const builder = new Builder(nuxt);
        await builder.build();
    } else {
        const session = require('koa-session2');
        const Store = require('./utils/session');
        app.use(
            session({
                maxAge: 2 * 60 * 60 * 1000, // cookie有效时长
                store: new Store()
            })
        );
        app.use(async (ctx, next) => {
            if (ctx.session) {
                ctx.req.session = ctx.session;
            }
            await next();
        });
        // await nuxt.ready();
    }

    app.use((ctx) => {
        ctx.status = 200;
        ctx.respond = false; // Bypass Koa's built-in response handling
        ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
        nuxt.render(ctx.req, ctx.res);
    });

    app.listen(port, host);
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    });
}

start();
