/* eslint-disable no-plusplus */
import { requestVerifyCode } from 'utils/api/login-api';

const md5 = require('./md5.ts');

// uuid params
let _nodeId;
let _clockseq;
let _lastMSecs = 0;
let _lastNSecs = 0;
const byteToHex: string[] = [];
for (let i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

const CommonFunc = {
    //  common func
    toMd5: (password) => {
        return md5.hexMD5(password);
    },

    getParamsStr: (obj) => {
        if (obj) {
            const paramArr = Object.keys(obj)
                .filter((k, v) => obj[k])
                .map(k => `${k}=${encodeURIComponent(obj[k])}`);
            return paramArr.join('&');
        }
        return '';
    },

    deepCopy: (obj) => {
        const result = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    result[key] = CommonFunc.deepCopy(obj[key]);
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },

    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    },

    serialize: (obj: any) => {
        const str =
            '?' +
            Object.keys(obj)
                .reduce(function (a: any, k) {
                    a.push(k + '=' + encodeURIComponent(obj[k]));
                    return a;
                }, [])
                .join('&');
        return str;
    },

    preDealRes: (res, callback, returnValue = []) => {
        if (!res) return returnValue;
        const dataTemp = res.data.data || res.data.infos;
        if (res.retcode === 0 && dataTemp) {
            const temp = typeof dataTemp === 'string' ? JSON.parse(dataTemp) : dataTemp;
            return callback ? callback(temp) : temp;
        }
        return returnValue;
    },

    getSMSCode: async (phoneNum, isDebug = true) => {
        if (!/^1\d{10}$/.test(phoneNum)) {
            return CommonFunc.commonResult('手机号格式错误');
        }

        if (!isDebug) {
            const res = await requestVerifyCode(phoneNum);
            if (res.retcode === 0) {
                // Vue.$Weui.showToast({
                //     title: '发送成功',
                //     duration: 2000
                // });
                return {
                    retcode: 0,
                    data: ''
                };
            } else {
                return CommonFunc.commonResult(res.retmsg || '发送失败');
            }
        }

        return {
            retcode: 0,
            data: `${Math.random()}`.substring(3, 7)
        };
    },

    findItemByKey: (itemGroup = [], key = '', aimValue = '') => {
        if (!key || !(itemGroup instanceof Array) || !aimValue) return {};

        const len = itemGroup.length;

        for (let i = 0; i < len; i++) {
            if ('' + aimValue === itemGroup[i][key]) {
                return { index: i, item: itemGroup[i] };
            }
        }

        return {};
    },

    bytesToUuid: (buf) => {
        let uuid = '';

        for (let i = 0; i < 16; i++) {
            uuid += byteToHex[buf[i]];
            if ([3, 5, 7, 9].indexOf(i) !== -1) {
                uuid += '-';
            }
        }

        uuid = uuid.substr(0, uuid.length - 1) + 'w'; // mark uuid for wxa

        return uuid;
    },

    uuid: () => {
        let i = 0;
        const b: any = [];
        let node = _nodeId;
        let clockseq = _clockseq;

        if (node == null || clockseq == null) {
            const seedBytes: any = `${Math.random()}`.substr(3, 19);
            if (node == null) {
                node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
            }
            if (clockseq == null) {
                clockseq = _clockseq = ((seedBytes[6] << 8) | seedBytes[7]) & 0x3fff;
            }
        }

        let msecs = new Date().getTime();
        let nsecs = _lastNSecs + 1;
        const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000;
        if (dt < 0) {
            clockseq = (clockseq + 1) & 0x3fff;
        }
        if (dt < 0 || msecs > _lastMSecs) {
            nsecs = 0;
        }
        if (nsecs >= 10000) {
            throw new Error("uuid: Can't create more than 10M uuids/sec");
        }

        _lastMSecs = msecs;
        _lastNSecs = nsecs;
        _clockseq = clockseq;

        msecs += 12219292800000;

        // `time_low`
        const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
        b[i++] = (tl >>> 24) & 0xff;
        b[i++] = (tl >>> 16) & 0xff;
        b[i++] = (tl >>> 8) & 0xff;
        b[i++] = tl & 0xff;

        // `time_mid`
        const tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff;
        b[i++] = (tmh >>> 8) & 0xff;
        b[i++] = tmh & 0xff;

        // `time_high_and_version`
        b[i++] = ((tmh >>> 24) & 0xf) | 0x10; // include version
        b[i++] = (tmh >>> 16) & 0xff;

        // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
        b[i++] = (clockseq >>> 8) | 0x80;
        b[i++] = clockseq & 0xff;
        for (let n = 0; n < 6; ++n) {
            b[i + n] = node[n];
        }

        return CommonFunc.bytesToUuid(b);
    },

    commonResult: (retmsg = '微信发送请求接口失败') => ({
        retcode: -1,
        retmsg
    }),

    debounce: (fn, wait = 500) => {
        let timeout: NodeJS.Timeout | undefined;
        return () => {
            if (!timeout) clearTimeout(timeout);
            timeout = setTimeout(fn, wait);
        };
    },

    // page func

    showFailedTip: (title = '操作失败', duration = 2000) => {
        // wepy.showToast({
        //     image: '/assets/images/common/failure_toast.png',
        //     title,
        //     duration
        // });
    },

    dealHospitalSelectGroup(currentHospitalRegion = [], hospitalSelectGroup = []) {
        let filterHospital: string[] = [];
        // 当前区域没有医院
        if (currentHospitalRegion.length === 0) {
            filterHospital = ['--'];
        } else if (currentHospitalRegion.length === 1) {
            // 当前区域显示全部医院
            filterHospital = hospitalSelectGroup;
        } else {
            // 显示所属当前区域医院
            filterHospital = hospitalSelectGroup.filter(item => currentHospitalRegion.indexOf(item) !== -1);
        }

        return filterHospital;
    }
};

export default CommonFunc;
