import Vue from 'vue';
import Cookie from 'cookie';
import JSCookie from 'js-cookie';

// Called only on client-side
export const getCookies = (str) => {
    return Cookie.parse(str || '');
};

export default ({ req }, inject) => {
    // Inject `cookies` key
    // -> app.$cookies
    // -> this.$cookies in vue components
    // -> this.$cookies in store actions/mutations
    inject(
        'cookies',
        new Vue({
            data: () => ({
                cookies: getCookies(process.server ? req.headers.cookie : document.cookie)
            }),
            methods: {
                set(name: string, value: string | object, options?: JSCookie.CookieAttributes | undefined) {
                    JSCookie.set(name, value, options);
                    this.cookies = getCookies(document.cookie);
                },
                remove(name: string, options?: JSCookie.CookieAttributes | undefined) {
                    JSCookie.remove(name, options);
                    this.cookies = getCookies(document.cookie);
                }
            }
        })
    );
};
