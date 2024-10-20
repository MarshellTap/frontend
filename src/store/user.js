export default {
    namespaced: true,
    state: {
        telegram_id: null,
        avatar: null,
        name: null,
        bandName: null,
        balance: 0,
        band: {
            code: null,
            available: null
        },
        auth_token: null,
        temporary_auth_token: null,
        available_daily_rewards: {
            status: false,
            amount: 0
        }
    },
    mutations: {
        SET_USER(state, payload) {
            state.telegram_id = payload.telegram_id;
            state.avatar = payload.avatar;
            state.name = payload.name;
            state.bandName = payload.bandName;
            state.balance = payload.balance;
            state.band.code = payload.band.code;
            state.band.available = payload.band.available;
            state.auth_token = payload.token;
            if (state.temporary_auth_token) {
                state.temporary_auth_token = null;
            }
            if (payload.available_daily_rewards) {
                state.available_daily_rewards.status = payload.available_daily_rewards.status;
                if (payload.available_daily_rewards.amount) {
                    state.available_daily_rewards.amount = payload.available_daily_rewards.amount;
                }
            }
        },
        SET_USER_BALANCE(state, payload) {
            state.balance = payload
        },
        SET_TEMPORARY_AUTH_TOKEN(state, payload) {
            state.temporary_auth_token = payload
        },
        SET_USER_AVAILABLE_DAILY_REWARDS(state, payload) {
            if (payload.status) state.available_daily_rewards.status = payload.status
            if (payload.amount)state.available_daily_rewards.amount = payload.amount
        },
        SET_USER_BAND_AVAILABLE(state, payload) {
            state.band.available = payload;
        }
    },
    actions: {
        setTemporaryAuthToken({ commit }, payload) {
            commit('SET_TEMPORARY_AUTH_TOKEN', payload);
        },
        setUser({ commit }, payload) {
            commit('SET_USER', payload);
        },
        setUserBalance({ commit }, payload) {
            commit('SET_USER_BALANCE', payload);
        },
        setUserAvailableDailyRewards({ commit }, payload) {
            commit('SET_USER_AVAILABLE_DAILY_REWARDS', payload)
        },
        setUserBandAvailable({ commit }, payload) {
            commit('SET_USER_BAND_AVAILABLE', payload)
        }
    },
    getters: {
        isAuth (state) {
            return state.auth_token !== null;
        }
    }
}
