export const state = () => ({
    userInfo: null
});

export const mutations = {
    SET_USER_INFO: function (state, userInfo) {
        state.userInfo = userInfo;
    }
};

export const actions = {
    async getUserInfo({ commit, state }, params = {}) {
        if (state.userInfo) {
            return [null, state.userInfo];
        }
    },
    async updateUserInfo({ commit, state }, userInfo) {
        // const res = await this.$axios.$post('/h5/open/updateUserInfo', userInfo)
        // if (res.retcode === 0) {
        //     commit('SET_USER_INFO', userInfo)
        //     return [null, userInfo]
        // }
        // return [res]
    }
};
