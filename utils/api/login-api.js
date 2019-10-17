import ApiFunc from './api-func';
import CommonFunc from 'utils/common-func';
import { openPlatFormApi } from './api-group';

export const login = async (phone = '', password = '', isPwdLogin = true) => {
    const loginApi =
        // eslint-disable-next-line standard/computed-property-even-spacing
        openPlatFormApi[
            isPwdLogin ? 'loginWithPassword' : 'loginWithVerifyCode'
        ];

    const params = isPwdLogin
        ? {
            phone,
            password: CommonFunc.toMd5(password)
        }
        : {
            phone,
            verifyCode: password
        };

    try {
        const res = await ApiFunc.post(loginApi, params);
        return res;
    } catch (error) {
        return CommonFunc.commonResult('登录失败');
    }
};

export const requestVerifyCode = async (phone = '') => {
    try {
        const res = await ApiFunc.post(openPlatFormApi.requestVerifyCode, {
            phone
        });

        return res;
    } catch (error) {
        return CommonFunc.commonResult();
    }
};

export const wxLogin = async () => {
    try {
        const { res } = await CommonFunc.wepyFunc('login');
        console.log(res);

        if (res.code) {
            const resLog = await ApiFunc.post(openPlatFormApi.getWxAuthInfo, {
                code: res.code
            });

            return JSON.parse(resLog);
        }
    } catch (e) {
        console.log('登录失败！' + JSON.stringify(e));
        return CommonFunc.commonResult();
    }
};

export const checkOpenIdBindStatus = async (openId = '') => {
    if (!openId) {
        return { retcode: -1, retmsg: 'openId错误' };
    }

    try {
        const res = await ApiFunc.post(openPlatFormApi.checkOpenIdBindStatus, {
            openId,
            phone: ''
        });
        return res;
    } catch (e) {
        return CommonFunc.commonResult();
    }
};

export const bindOpenIdAndPhone = async (
    openId = '',
    phone = '',
    nickName = ''
) => {
    if (!openId || !phone) {
        return { retcode: -1, retmsg: 'openId或账号错误' };
    }

    try {
        const res = await ApiFunc.post(openPlatFormApi.bindOpenIdAndPhone, {
            openId,
            phone,
            nick_name: nickName
        });
        return res;
    } catch (e) {
        return CommonFunc.commonResult();
    }
};

export const unbindOpenIdAndPhoneByOpenId = async (openId = '') => {
    if (!openId) {
        return { retcode: -1, retmsg: 'openId错误' };
    }

    try {
        const res = await ApiFunc.post(
            openPlatFormApi.unbindOpenIdAndPhoneByOpenId,
            { openId }
        );
        return res;
    } catch (e) {
        return CommonFunc.commonResult();
    }
};
