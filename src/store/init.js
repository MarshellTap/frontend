export default {
    namespaced: true,
    state: {
        player_register: {
            avatar: null
        },
        default_avatar: null,
    },
    mutations: {
        SET_INIT_PLAYER_REGISTER_AVATAR: (state, payload) => {
            state.player_register.avatar = payload
        },
        SET_INIT_DEFAULT_AVATAR : (state, payload) => {
            state.default_avatar = payload
        }
    },
    actions: {
        setInitPlayerRegisterAvatar: ({ commit }, payload) => {
            commit('SET_INIT_PLAYER_REGISTER_AVATAR', payload)
        },
        setInitDefaultAvatar: ({ commit }, payload) => {
            commit('SET_INIT_DEFAULT_AVATAR', payload)
        }
    },
}
