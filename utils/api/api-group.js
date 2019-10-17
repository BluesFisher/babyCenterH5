export const openPlatFormApi = {
    // login
    loginWithPassword: '/account/loginAuthWithPassword',
    loginWithVerifyCode: '/account/loginAuthWithVerifyCode',
    requestVerifyCode: '/account/requestVerifyCode',
    getWxAuthInfo: '/account/getWxAuthInfo',
    checkOpenIdBindStatus: '/account/checkOpenIdBindStatus',
    unbindOpenIdAndPhoneByOpenId: '/account/unbindOpenIdAndPhoneByOpenId',
    bindOpenIdAndPhone: '/account/bindOpenIdAndPhone',

    // data
    statisticData: '/datacenter/getStatisticsData',
    getLast7DaysData: '/datacenter/getLast7DaysData',
    getIncreaseData: '/datacenter/getIncreaseData',
    getCardUseData: '/datacenter/getCardUseData',
    getCardAnalysisData: '/datacenter/getCardAnalysisData',
    getHospitalDetail: '/datacenter/getHospitalDetail',
    getRegionInfo: '/datacenter/getRegionInfo',
    getUserDailyData: '/datacenter/getUserDailyData'
};
