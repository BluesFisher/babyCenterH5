/* eslint-disable camelcase */
import ApiFunc from './api-func';
import CommonFunc from 'utils/common-func';
import { openPlatFormApi } from './api-group';

export const getLast7DaysData = async () => {
    let dateList = [];
    let valueList = {
        建卡量: [],
        领卡量: [],
        用卡人数: [],
        用卡次数: []
    };
    try {
        const res = await ApiFunc.post(openPlatFormApi.getLast7DaysData);
        return res.retcode === 0 ? res.data : { dateList, valueList };
    } catch (error) {
        return { dateList, valueList };
    }
};

export const getHospitalDetail = async () => {
    try {
        const res = await ApiFunc.post(openPlatFormApi.getHospitalDetail);
        return res.retcode === 0 ? res.data : [];
    } catch (error) {
        return [];
    }
};

export const getIncreaseData = async () => {
    try {
        const res = await ApiFunc.post(openPlatFormApi.getIncreaseData);
        return res.retcode === 0 ? res.data : [];
    } catch (error) {
        return [];
    }
};

export const getUserDailyData = async () => {
    try {
        const res = await ApiFunc.post(openPlatFormApi.getUserDailyData);

        return res.retcode === 0 ? res.data : {};
    } catch (error) {
        return {};
    }
};

export const getCardUseData = async (date = '') => {
    try {
        const res = await ApiFunc.post(openPlatFormApi.getCardUseData, {
            statisticDate: date
        });

        return res.retcode === 0 ? res.data : [];
    } catch (error) {
        return [];
    }
};

export const getCardAnalysisData = async (
    type = 'carduse_portrait_gender',
    paramsIn = {}
) => {
    try {
        const res = await ApiFunc.post(openPlatFormApi.getCardAnalysisData, {
            type,
            paramsIn
        });

        return res.retcode === 0 ? res.data : [];
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const getRegionInfo = async () => {
    const defaultRes = {
        provinceArry: ['全国'],
        cityObj: {},
        hospitalRegion: {},
        hospitalIdToName: {}
    };
    try {
        const res = await ApiFunc.post(openPlatFormApi.getRegionInfo);
        return res.data || defaultRes;
    } catch (error) {
        return defaultRes;
    }
};
