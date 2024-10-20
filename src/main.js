import {createApp, provide, h, watch, ref} from 'vue'
import './assets/css/default.css'
import store from './store/index.js'
import router from './routes.js'
import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
} from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { VueTelegramPlugin } from 'vue-tg'
import App from './app.vue'
import {setContext} from "@apollo/client/link/context/index.js";
import {
	createTonConnectUIProvider,
	TonConnectUIContext,
	TonConnectUIOptionsContext
} from 'ton-ui-vue';
import { io } from 'socket.io-client';

const { tonConnectUI, setOptions } = createTonConnectUIProvider({
	manifestUrl: import.meta.env.VITE_TONCONNECT_MANIFEST
});

export const socketEnabled = ref({auth: false, temporary: false})
export const socketMultiDevices = ref(false)

const graphqlRequestHeader = (state) => {
	return setContext((_, { headers }) => {
		const token = state.user.auth_token;
		return {
			headers: {
				...headers,
				token: token,
			}
		};
	});
}

const graphqlLink = graphqlRequestHeader(store.state).concat(
	createHttpLink({
		uri: import.meta.env.VITE_GRAPHQL_URL
	})
);

const defaultGraphQLClient = new ApolloClient({
	link: graphqlLink,
	cache: new InMemoryCache(),
})

const app = createApp({
	setup() {
		provide(DefaultApolloClient, defaultGraphQLClient)
	},
	render: () => h(App),
})

app.use(store)
app.use(router)
app.use(VueTelegramPlugin)

const socketClient = io(import.meta.env.VITE_SOCKET, {
	autoConnect: false,
	transports: ['websocket'],
	reconnection: true,
	reconnectionDelay: 3 * 1000,
	auth: {
		token: null
	}
})

socketClient.on("connect_error", async () => {
	await store.dispatch('error/setError', {
		status: true,
		title: "Error",
		description: "There was an error on our server side",
		button: {type: "success", name: "Refresh app", function: "reloadApp"}
	})
})
socketClient.on("game_error", async (data) => {
	if (!data.status) {
		data.status = true
	}
	await store.dispatch('error/setError', data)
	if (
		data.is_multi &&
		!socketMultiDevices.value
	) {
		socketMultiDevices.value = true
	}
	if (
		data.connection_type &&
		socketEnabled.value[data.connection_type]
	) {
		socketEnabled.value[data.connection_type] = false;
	}
})
socketClient.on("notification", async (data) => {
	await store.dispatch('notifications/addItemNotificationsPopup', data)
})

watch(() => store.state.user.auth_token || store.state.user.temporary_auth_token, (token) => {
	const TEMPORARY_TOKEN_TYPE = token === store.state.user.temporary_auth_token;
	if (!TEMPORARY_TOKEN_TYPE && !socketEnabled.value.auth) {
		if (socketClient.connected) {
			socketClient.disconnect()
		}
		socketClient.auth = {token: token}
		socketClient.connect()
		socketEnabled.value.auth = true
	} else if (TEMPORARY_TOKEN_TYPE && !socketEnabled.value.temporary) {
		if (socketClient.connected) {
			socketClient.disconnect()
		}
		socketClient.auth = {token: token}
		socketClient.connect()
		socketEnabled.value.temporary = true
	}
})

app.provide(TonConnectUIContext, tonConnectUI);
app.provide(TonConnectUIOptionsContext, setOptions);
app.provide('socket-client', socketClient);

app.mount('#app');