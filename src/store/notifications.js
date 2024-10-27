import {findIndex} from "vue3-circle-progress/dist/circle-progress.common.js";

export default {
    namespaced: true,
    state: {
        popup: []
    },
    mutations: {
        ADD_ITEM_TO_NOTIFICATIONS_POPUP: (state, payload) => {
            if (state.popup.length === 2) {
                state.popup.shift()
            }
            const newArr = state.popup;
            const findMessage = newArr.findIndex(arr => arr.message === payload.message);
            if (findMessage !== -1) {
                newArr.splice(findIndex, 1);
            }
            newArr.push(payload)
            state.popup = newArr.reverse()
        },
        DELETE_ITEM_FROM_NOTIFICATIONS_POPUP: (state, payload) => {
            state.popup = state.popup.filter(item => item.id !== payload)
        },
    },
    actions: {
        addItemNotificationsPopup: ({ commit }, payload) => {
            commit('ADD_ITEM_TO_NOTIFICATIONS_POPUP', payload)
        },
        deleteItemNotificationsPopup: ({ commit }, payload) => {
            commit('DELETE_ITEM_FROM_NOTIFICATIONS_POPUP', payload)
        }
    },
}
