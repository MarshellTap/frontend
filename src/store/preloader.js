export default {
    namespaced: true,
    state: {
        status: true
    },
    mutations: {
        SET_PRELOADER: (state, payload) => {
            state.status = payload
        },
    },
    actions: {
        setPreloader: ({ commit }, payload) => {
            commit('SET_PRELOADER', payload)
        },
    },
}
