import NuxtConfiguration from '@nuxt/config';
const lru = require('lru-cache');
const { mta, timeReport, common } = require('./server/config');

const config: NuxtConfiguration = {
    mode: 'universal',
    dev: process.env.NODE_ENV === 'development',
    env: {
        mta,
        timeReport,
        common
    },
    server: {
        port: 3002, // default: 3000
        host: 'localhost' // default: localhost,
    },
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'apple-mobile-web-app-capable',
                content: 'yes'
            },
            {
                name: 'apple-touch-fullscreen',
                content: 'yes'
            },
            {
                name: 'format-detection',
                content: 'telephone=no,email=no'
            },
            {
                name: 'viewport',
                content: 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            {
                rel: 'stylesheet',
                type: 'text/css',
                href: '//res.wx.qq.com/open/libs/weui/2.0.0/weui.min.css'
            }
        ],
        script: [
            {
                src: '//res.wx.qq.com/open/js/jweixin-1.4.0.js',
                type: 'text/javascript'
            },
            {
                src: '//res.wx.qq.com/open/libs/weuijs/1.1.3/weui.min.js',
                type: 'text/javascript'
            },
            {
                src: 'https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver',
                type: 'text/javascript',
                body: true
            }
        ]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#48CC87' },
    /*
     ** Global CSS
     */
    css: ['~/assets/styles/index.less'],
    styleResources: {
        less: ['~/assets/styles/variables/_variables.less', '~/assets/styles/mixins/index.less']
    },
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '~/plugins/axios',
        '~/plugins/cookies',
        // '~plugins/cos.client',
        '~plugins/wx.client.ts',
        '~plugins/weui.client.ts',
        '~plugins/mta.client.ts',
        '~plugins/sentry.client.ts',
        '~plugins/vconsole.client.ts'
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        '@nuxtjs/eslint-module'
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: (() => {
        const axios = {
            retry: {
                retries: 0
            },
            debug: process.env._ENV !== 'production',
            timeout: 5000,
            withCredentials: true,
            baseURL: 'https://healtht.tengmed.com'
        };
        if (process.env.NODE_ENV === 'production') {
            axios.baseURL = `https://health.tengmed.com`;
        } else {
            axios.baseURL = `https://healtht.tengmed.com`;
        }
        return axios;
    })(),
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        crossorigin: 'anonymous',
        postcss: {
            plugins: {
                'postcss-import': {},
                'postcss-url': {},
                'postcss-preset-env': {},
                cssnano: {
                    preset: 'default'
                },
                'postcss-cssnext': {
                    browsers: ['> 1%', 'iOS >= 8', 'Android >= 4.1']
                },
                'postcss-px-to-viewport': {
                    viewportWidth: 750,
                    viewportHeight: 1334,
                    unitPrecision: 3,
                    viewportUnit: 'vw',
                    selectorBlackList: ['.skipvw'],
                    minPixelValue: 1,
                    mediaQuery: false
                },
                'postcss-viewport-units': {}
            }
        },

        extend(config: any, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push(
                    {
                        enforce: 'pre',
                        test: /\.(js|vue)$/,
                        loader: 'eslint-loader',
                        exclude: /(node_modules)/
                    },
                    {
                        test: /\.ts$/,
                        exclude: [/node_modules/, /vendor/, /\.nuxt/],
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true
                        }
                    }
                );
            }
            config.externals = {
                'weixin-js-sdk': 'wx',
                'weui.js': 'weui'
            };
        }
    },
    render: {
        bundleRenderer: {
            cache: new lru({
                max: 10000,
                maxAge: 1000 * 60 * 15
            }),
            shouldPreload: (file, type) => {
                return ['script', 'style', 'font'].includes(type);
            }
        },
        static: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        },
        http2: {
            push: true
        }
    }
};

module.exports = config;
