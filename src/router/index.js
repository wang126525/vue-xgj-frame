import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'
const index = () => import('@/pages/index/index')
const about = () => import('@/pages/about/about')

Vue.use(Router)

export default new Router({
	// mode:'history',
	routes: [{
			path: "/",
			redirect: "/index"
		},
		{
			name: "index",
			path: "/index",
			component: index,
			meta: {}
		},
		{
			name: "about",
			path: "/about",
			component: about,
			meta: {}
		},
		// {
		// 	path: '*',
		// 	component: losepage,
		// }

	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.documentElement.scrollTop;
			}
			return {
				x: 0,
				y: to.meta.savedPosition || 0
			}
		}
	}
})
