/* eslint-disable camelcase */
import ApiFunc from './api-func';
import CommonFunc from 'utils/common-func';
import dayjs from 'dayjs';
import { openPlatFormApi } from './api-group';

const TYPE_CODE = {
    second_level_carduse_tag_statistics: {
        key: 'level1TagName',
        value1: 'tagUseNmu',
        value2: 'tagUseUser',
        id: 'hospitalId',
        name: 'hospitalName'
    },
    carduse_portrait_gender: {
        key: 'f_gender',
        value1: 'f_user_num',
        id: 'f_hospital_id',
        name: 'f_hospital_name'
    },
    carduse_portrait_age: {
        key: 'f_age_merge',
        value1: 'f_user_num',
        id: 'f_hospital_id',
        name: 'f_hospital_name'
    },
    carduse_portrait_time: {
        key: 'f_time',
        value1: 'f_user_num',
        id: 'f_hospital_id',
        name: 'f_hospital_name'
    }
};

const dealCardUseData = (itemGroup = [], key = '', aimValue = '') => {
    const find = CommonFunc.findItemByKey(itemGroup, key, aimValue);

    if (typeof find.index !== 'undefined') {
        itemGroup.splice(find.index, 1);
    }

    return find;
};

const dealCardAnalysisItem = (dealAim, item, type) => {
    const { key, value1, value2 } = TYPE_CODE[type];
    const label = item[key];
    const num1 = item[value1];
    const num2 = value2 ? item[value2] : undefined;

    const userCardNum = dealAim['用卡次数'];
    const userCardUser = dealAim['用卡人数'];
    userCardNum[label] = +num1 + (+userCardNum[label] || 0);
    userCardNum['total'] = +num1 + (+userCardNum['total'] || 0);

    userCardUser[label] = +(num2 || num1) + (+userCardUser[label] || 0);
    userCardUser['total'] = +(num2 || num1) + (+userCardUser['total'] || 0);
};

const dealCardAnalysisData = (tempIn, type) => {
    const hospitalList = {};
    let hospitalSelectGroup = ['全部医院'];
    const useCardLinkTotal = {
        用卡次数: {},
        用卡人数: {}
    };

    tempIn.map(item => {
        const { id, name } = TYPE_CODE[type];
        const hospitalId = item[id];
        const hospitalName = item[name];
        if (Object.keys(hospitalList).indexOf(hospitalId) === -1) {
            hospitalList[hospitalId] = {
                hospitalId,
                hospitalName: hospitalName,
                用卡次数: {},
                用卡人数: {}
            };
            hospitalSelectGroup.push(hospitalName);
        }
        dealCardAnalysisItem(hospitalList[hospitalId], item, type);
        dealCardAnalysisItem(useCardLinkTotal, item, type);
    });

    hospitalList['全部医院'] = useCardLinkTotal;
    hospitalSelectGroup = [...new Set(hospitalSelectGroup)];

    return { hospitalList, hospitalSelectGroup };
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

export const getLast7DaysData = async () => {
    let dateList = [];
    let totalValueList = {
        建卡量: [],
        领卡量: [],
        用卡人数: [],
        用卡次数: []
    };
    let valueList = {};

    return Promise.all([
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'create_bind_usenum_useuser_daily'
        }),
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'primary_statistics_param_daily_by_hospital',
            params: JSON.stringify({
                start_date: dayjs()
                    .add(-7, 'day')
                    .format('YYYY-MM-DD'),
                end_date: dayjs()
                    .add(-1, 'day')
                    .format('YYYY-MM-DD')
            })
        })
    ])
        .then(([res1, res2]) => {
            CommonFunc.preDealRes(res1, tempIn => {
                tempIn.map(item => {
                    dateList.push(
                        dayjs(item.statisticDate || '').format('MM.DD')
                    );
                    totalValueList['建卡量'].push(+item.createNum || 0);
                    totalValueList['领卡量'].push(+item.bindNum || 0);
                    totalValueList['用卡人数'].push(+item.useUv || 0);
                    totalValueList['用卡次数'].push(+item.usePv || 0);
                });

                valueList['全部医院'] = totalValueList;
            });

            CommonFunc.preDealRes(res2, tempIn => {
                tempIn.map(item => {
                    if (valueList[item.hospitalId]) {
                        valueList[item.hospitalId]['建卡量'].push(
                            +item.createNum || 0
                        );
                        valueList[item.hospitalId]['领卡量'].push(
                            +item.bindNum || 0
                        );
                        valueList[item.hospitalId]['用卡人数'].push(
                            +item.useUv || 0
                        );
                        valueList[item.hospitalId]['用卡次数'].push(
                            +item.usePv || 0
                        );
                    } else {
                        valueList[item.hospitalId] = {
                            建卡量: [+item.createNum || 0],
                            领卡量: [+item.bindNum || 0],
                            用卡人数: [+item.useUv || 0],
                            用卡次数: [+item.usePv || 0]
                        };
                    }
                });
            });
            // console.log(valueList);

            return { dateList, valueList };
        })
        .catch(e => {
            return { dateList };
        });
};

export const getHospitalDetail = async () => {
    try {
        const res = await ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'recorded_online_hospital_num'
        });

        return CommonFunc.preDealRes(res, tempIn => {
            const temp = tempIn[0];
            if (
                temp.yesterdayOnlineHospNum <= 0 &&
                temp.yesterdayPlugInHospNum <= 0
            ) {
                return [];
            }
            const orgData = [
                [
                    temp.yesterdayOnlineHosps
                        ? temp.yesterdayOnlineHosps.split('|')
                        : ['无'],
                    [`${temp.yesterdayOnlineHospNum}家`],
                    [`${temp.totalOnlineHospNum}家`]
                ],
                [
                    temp.yesterdayPlugInHosps
                        ? temp.yesterdayPlugInHosps.split('|')
                        : ['无'],
                    [`${temp.yesterdayPlugInHospNum}家`],
                    [`${temp.totalPlugInHospNum}家`]
                ]
            ];

            return orgData;
        });
    } catch (error) {
        return [];
    }
};

export const getIncreaseData = async () => {
    let increase = {};

    return Promise.all([
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'primary_params_daily_weekly_monthly_increase'
        }),
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'daily_weekly_monthly_increase'
        }),
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'primary_params_d_w_m_increase_by_hospital'
        })
    ])
        .then(([res1, res2, res3]) => {
            if (
                res1.retcode !== 0 &&
                res2.retcode !== 0 &&
                res3.retcode !== 0
            ) {
                return null;
            }
            CommonFunc.preDealRes(res3, tempIn => {
                tempIn.map(item => {
                    increase[item.hospitalId] = [
                        [
                            item.dailyCreateNumDayIncrease * 100,
                            item.dailyCreateNumWeekIncrease * 100,
                            item.dailyCreateNumMonthIncrease * 100
                        ],
                        [
                            item.dailyBindNumDayIncrease * 100,
                            item.dailyBindNumWeekIncrease * 100,
                            item.dailyBindNumMonthIncrease * 100
                        ],
                        [
                            item.dailyCardUseUserDayIncrease * 100,
                            item.dailyCardUseUserWeekIncrease * 100,
                            item.dailyCardUseUserMonthIncrease * 100
                        ],
                        [
                            item.dailyCardUseNumDayIncrease * 100,
                            item.dailyCardUseNumWeekIncrease * 100,
                            item.dailyCardUseNumMonthIncrease * 100
                        ]
                    ];
                });
            });

            increase['全部医院'] = [
                ...CommonFunc.preDealRes(res1, tempIn => {
                    const temp = tempIn[0];
                    return [
                        [
                            temp.dailyCreateNumDayIncrease * 100,
                            temp.dailyCreateNumWeekIncrease * 100,
                            temp.dailyCreateNumMonthIncrease * 100
                        ],
                        [
                            temp.dailyBindNumDayIncrease * 100,
                            temp.dailyBindNumWeekIncrease * 100,
                            temp.dailyBindNumMonthIncrease * 100
                        ]
                    ];
                }),
                ...CommonFunc.preDealRes(res2, tempIn => {
                    const temp = tempIn[0];
                    return [
                        [
                            temp.daily_dayIncUser * 100,
                            temp.daily_weekIncUser * 100,
                            temp.daily_monthIncUser * 100
                        ],
                        [
                            temp.daily_dayIncNum * 100,
                            temp.daily_weekIncNum * 100,
                            temp.daily_monthIncNum * 100
                        ]
                    ];
                })
            ];

            return increase;
        })
        .catch(e => {
            return null;
        });
};

export const getUserDailyData = async () => {
    const hospitalDailyData = {};

    return Promise.all([
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 't_hospital_basic_stat_general_v2'
        }),
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'hospital_basic_stats_v2'
        })
    ])
        .then(([res1, res2]) => {
            if (res1.retcode !== 0 && res2.retcode !== 0) {
                return null;
            }
            CommonFunc.preDealRes(res1, tempIn => {
                const temp = tempIn[0];
                hospitalDailyData['全部医院'] = [
                    temp ? temp.createNum : '--',
                    temp ? temp.bindNum : '--',
                    temp ? temp.dailyCardUseUser : '--',
                    temp ? temp.dailyCardUseNum : '--'
                ];
            });

            CommonFunc.preDealRes(res2, tempIn => {
                tempIn.map(item => {
                    hospitalDailyData[item.hospitalId] = [
                        item.createNum,
                        item.bindNum,
                        item.dailyCardUseUser,
                        item.dailyCardUseNum
                    ];
                });
            });
            return hospitalDailyData;
        })
        .catch(e => {
            console.log(e);

            return null;
        });
};

export const getCardUseData = async (date = '') => {
    const commonParams = JSON.stringify({
        statisticDate: date
    });

    return Promise.all([
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'create_bind_online_offline_carduse_increase',
            params: commonParams
        }),
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'create_bind_online_offline_carduse_statistic',
            params: commonParams
        }),
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'primary_param_weekly_monthly_increase',
            params: commonParams
        }),
        ApiFunc.post(openPlatFormApi.statisticData, {
            type: 'primary_statistics_param_total_by_hospital',
            params: JSON.stringify({
                start_date: date,
                end_date: date
            })
        })
    ])
        .then(([res1, res2, res3, res4]) => {
            if (
                res1.retcode !== 0 &&
                res2.retcode !== 0 &&
                res3.retcode !== 0 &&
                res4.retcode !== 0
            ) {
                return null;
            }

            const result = [];
            const data1 = JSON.parse(res1.data.data);
            const data2 = JSON.parse(res2.data.data);
            const data3 = JSON.parse(res3.data.data);
            const data4 = JSON.parse(res4.data.data);
            const data1Bak = JSON.parse(res1.data.data);
            const data2Bak = JSON.parse(res2.data.data);
            const data3Bak = JSON.parse(res3.data.data);
            const data4Bak = JSON.parse(res4.data.data);

            const len = Math.max(
                data1.length,
                data2.length,
                data3.length,
                data4.length
            );

            for (let i = 0; i < len; i++) {
                const hospitalId = Math.min(
                    (data1[i] && data1[i].hospitalId) || Infinity,
                    (data2[i] && data2[i].hospitalId) || Infinity,
                    (data3[i] && data3[i].hospitalId) || Infinity,
                    (data4[i] && data4[i].hospitalId) || Infinity
                );

                const find1 = dealCardUseData(
                    data1Bak,
                    'hospitalId',
                    hospitalId
                );

                const find2 = dealCardUseData(
                    data2Bak,
                    'hospitalId',
                    hospitalId
                );
                const find3 = dealCardUseData(
                    data3Bak,
                    'hospitalId',
                    hospitalId
                );
                const find4 = dealCardUseData(
                    data4Bak,
                    'hospitalId',
                    hospitalId
                );

                result.push({
                    ...(find1.item || {}),
                    ...(find2.item || {}),
                    ...(find3.item
                        ? {
                            ...(find3.item || {}),
                            f_hospital_name: (find3.item || {}).hospitalName,
                            f_hospital_grade: (find3.item || {}).hospitalGrade
                        }
                        : {}),
                    ...(find4.item
                        ? {
                            ...(find4.item || {}),
                            f_hospital_name: (find4.item || {}).hospitalName,
                            f_hospital_grade: (find4.item || {}).hospitalGrade
                        }
                        : {})
                });
            }
            // console.log(data1, data2, data3, data4, result);

            return result;
        })
        .catch(e => {
            return null;
        });
};

export const getCardAnalysisData = async (
    type = 'carduse_portrait_gender',
    paramsIn = {}
) => {
    let params = {};

    if (type === 'second_level_carduse_tag_statistics') {
        const { startDate, endDate, tagClass } = paramsIn;
        params = {
            start_date: startDate,
            end_date: endDate,
            tag_class: tagClass
        };
    } else {
        const { timeDim } = paramsIn;
        params = {
            time_dim: timeDim
        };
    }
    try {
        const res = await ApiFunc.post(openPlatFormApi.statisticData, {
            type,
            params: JSON.stringify(params)
        });

        return CommonFunc.preDealRes(
            res,
            tempIn => dealCardAnalysisData(tempIn, type),
            {}
        );
    } catch (error) {
        console.log(error);

        return {};
    }
};
