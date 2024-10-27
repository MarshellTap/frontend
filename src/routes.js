import {createMemoryHistory, createRouter} from 'vue-router'

/* Pages */
import Home from './frames/Home/main.vue'
import Tasks from './frames/Tasks/Main/main.vue'
import Band from './frames/Band/Main/main.vue'
import Wallet from './frames/Wallet/main.vue'
import Game from "~/frames/Game/Main/main.vue";

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/tasks',
		name: 'tasks',
		component: Tasks
	},
	{
		path: '/band',
		name: 'band',
		component: Band
	},
	{
		path: '/wallet',
		name: 'wallet',
		component: Wallet
	},
	{
		path: '/game',
		name: 'game',
		component: Game
	},
	{
		path: '/:catchAll(.*)',
		redirect: '/',
	},
]

const router = createRouter({
	history: createMemoryHistory(),
	routes,
	mode: 'history'
})

export default router
