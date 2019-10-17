import wx from 'weixin-js-sdk';
let hasRight = false;

function isIPhone() {
    return !!navigator.userAgent.match(/(iPhone)/);
}
const isIPhoneX = () => {
    return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
};

export default function ({ $axios }, inject) {
    inject('IsIPhone', isIPhone);
    inject('IsIPhoneX', isIPhoneX);
    inject('initWxConfig', async () => {
        if (hasRight) {
            return wx;
        }
        const url = location.href.split('#')[0];
        const params = {
            url
        };
        const result = await $axios.$get('/com/open/getWxConfig', {
            params
        });
        if (wx && result.retcode === 0) {
            const data = result.data;
            wx.config({
                debug: false,
                beta: true,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'onVoicePlayEnd',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getLocalImgData',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            });
            await new Promise((resolve, reject) => {
                wx.ready((res) => {
                    if (isIPhone()) {
                        hasRight = true;
                    }
                    resolve(res);
                });
                wx.error((res) => {
                    console.error('wx', res);
                    reject(res);
                });
            });
        }

        return wx || {};
    });
}
