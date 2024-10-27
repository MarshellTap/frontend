import { createStore } from 'vuex'
import user from "~/store/user.js";
import modal from "~/store/modal.js";
import error from "~/store/error.js";
import preloader from "~/store/preloader.js";
import init from "~/store/init.js";
import notifications from "~/store/notifications.js";
import tasks from "~/store/tasks.js";

const store = createStore({
	state: {
		components: {
			header: {
				visible: true,
			},
			menu: {
				visible: true,
			}
		},
		drop_game: {
			started: false
		}
	},
	modules: {
		user: user,
		modal: modal,
		error: error,
		preloader: preloader,
		notifications: notifications,
		init: init,
		tasks: tasks
	},
	mutations: {
		SET_COMPONENTS_HEADER_VISIBLE(state, payload) {
			state.components.header.visible = payload
		},
		SET_COMPONENTS_MENU_VISIBLE(state, payload) {
			state.components.menu.visible = payload
		},
		SET_DROP_GAME_STARTED(state, payload) {
			state.drop_game.started = payload
		}
	},
	actions: {
		setComponentsHeaderVisible: ({ commit }, payload) => {
			commit('SET_COMPONENTS_HEADER_VISIBLE', payload)
		},
		setComponentsMenuVisible: ({ commit }, payload) => {
			commit('SET_COMPONENTS_MENU_VISIBLE', payload)
		},
		setDropGameStarted: ({ commit }, payload) => {
			commit('SET_DROP_GAME_STARTED', payload)
		}
	},
})

export default store
