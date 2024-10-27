export default {
    namespaced: true,
    state: {
        status: false,
        title: null,
        description: null,
        button: {
            name: null,
            type: null,
            function: null,
        }
    },
    mutations: {
        SET_ERROR: (state, payload) => {
            if (payload.status) state.status = payload.status
            if (payload.description) state.description = payload.description
            if (payload.title) state.title = payload.title
            if (payload.button) {
                if (payload.button.function) state.button.function = payload.button.function
                if (payload.button.name) state.button.name = payload.button.name
                if (payload.button.type) state.button.type = payload.button.type
            }
        },
    },
    actions: {
        setError: ({ commit }, payload) => {
            commit('SET_ERROR', payload)
        },
    },
}
