import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

export default defineConfig({
	plugins: [vue(),],
	server: {
		open: false,
		// port: 443,
		// host: 'marshelltap.com'
		// https: {
		// 	key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
		// 	cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
		// },
	},
	build: {
		logLevel: 'info',
		rollupOptions: {
			output: {
				chunkFileNames: 'static/js/[name].[hash].js',
				entryFileNames: 'static/js/[name].[hash].js',
				assetFileNames: ({ name }) => {
					if (name.endsWith('.js')) {
						return `static/js/[name].[hash].js`
					} else if (name.endsWith('.css')) {
						return 'static/css/[name].[hash].css'
					} else if (name.endsWith('.png')) {
						return 'static/images/[name].[hash].[ext]'
					} else if (name.endsWith('woff')) {
						return 'static/fonts/[name].[hash].[ext]'
					} else {
						return 'static/[name].[hash].[ext]'
					}
				},
				manualChunks(id) {
					const chunks = [
						{name: 'ton', data: ['ton-ui-vue', '@tonconnect/ui']},
						{name: 'telegram', data: ['vue-tg']},
						{name: 'lodash-debounce', data: ['lodash.debounce']},
						{name: 'socket-io', data: ['socket.io-client']},
						{name: 'apollo', data: ['@apollo/client', '@vue/apollo-composable', '@vue/apollo-util']},
						{name: 'howler', data: ['howler']},
						{name: 'moment', data: ['moment', 'moment-timezone']},
						{name: 'stable', data: ['vue-uuid', 'vue3-circle-progress', 'vue-number-animation']},
					]
					if (id.includes('/node_modules/')) {
						for (const chunkData of chunks) {
							if (chunkData.data.some(chunk => id.includes(chunk))) {
								return chunkData.name
							}
						}
					}
				},
			},
		}
	},
	resolve: {
		alias: {
			'~': resolve(__dirname, './src'),
		},
	},
})
