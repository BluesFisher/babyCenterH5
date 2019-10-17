import MtaH5 from 'mta-h5-analysis';

interface ITrconf {
    url: string | null
    proj: string | null
}

// 初始化
const TRCONf: ITrconf = process.env.timeReport as unknown as ITrconf || { url: '', proj: ''};
const __TIMESTART = {};
MtaH5.init(process.env.mta);

export default ({ req, app: { router } }, inject) => {
    router.afterEach((to: any, from: any) => {
        let st = 0;
        if (from.name || !performance.timing.domainLookupStart) {
            st = Date.now();
        } else {
            st = performance.timing.domainLookupStart;
        }
        __TIMESTART[to.path] = st;
    });
    /**
     * 常用的工具会预先注入，添加需考虑
     */
    inject('MtaH5', MtaH5);
    /**
     * 统计接口，暂时添加在mta，后续优化
     * */
    inject('TimeReport', () => {
        const st = __TIMESTART[location.pathname] || '';
        if (!st) {
            return;
        }
        const et = Date.now();
        const uri = `${location.protocol}//${location.host}${location.pathname}`;
        const t = et - st;
        const b = new Image();
        b.src = `${TRCONf.url}?proj=${TRCONf.proj}&uri=${uri}&action=initPage&ispage=1&time=${t}&start=${st}&endtime=${et}`;
    });
};
