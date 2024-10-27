export default {
    namespaced: true,
    state: {
        own: [],
        other: []
    },
    mutations: {
        SET_TASKS_OWN_LIST: (state, payload) => {
            state.own = payload
        },
        SET_TASKS_OTHER_LIST: (state, payload) => {
            state.other = payload
        }
    },
    actions: {
        setTasksOwnList: ({ commit }, payload) => {
            commit('SET_TASKS_OWN_LIST', payload)
        },
        setTasksOtherList: ({ commit }, payload) => {
            commit('SET_TASKS_OTHER_LIST', payload)
        },
    },
}
