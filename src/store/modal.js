export default {
    namespaced: true,
    state: {
        active: false,
        closeAnimation: false,
        selected: null,
        props: {},
        render: false
    },
    mutations: {
        SET_MODAL_RENDER: (state, payload) => {
            state.render = payload
        },
        SET_MODAL_PROPS: (state, payload) => {
            state.props = payload
        },
        SET_MODAL_ACTIVE: (state, payload) => {
            if (!payload) {
                state.active = false
                state.selected = null
                state.props = {}
            } else {
                state.selected = payload
                state.active = true
            }
        },
        SET_MODAL_CLOSE_ANIMATION: (state, payload) => {
            state.closeAnimation = payload
        }
    },
    actions: {
        setModalRender: ({ commit }, payload) => {
            commit('SET_MODAL_RENDER', payload)
        },
        setModalProps: ({ commit }, payload) => {
            commit('SET_MODAL_PROPS', payload)
        },
        setModalActive: ({ commit }, payload) => {
            commit('SET_MODAL_ACTIVE', payload)
        },
        setModalCloseAnimation: ({ commit }, payload) => {
            commit('SET_MODAL_CLOSE_ANIMATION', payload)
        },
    },
}
