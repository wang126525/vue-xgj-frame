// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import App from './App'
// import router from './router'

// Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
// el: '#app',
// router,
// components: { App },
// template: '<App/>'
// })
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import {
	getStore
} from './config/mUtils'

// 兼容promise
import 'babel-polyfill'
// 安装插件
import installer from './components/installer.js'
Vue.use(installer)
// 预览图片
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview, {
	fullscreenEl: false,
	bgOpacity: 0.9
})
// 引入axios，并加到原型链中
import axios from 'axios';
Vue.prototype.$axios = axios;
// 自动匹配请求格式
import qs from 'qs';
Vue.prototype.$qs = qs;
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 集中事件中间件
var eventBus = {
	install(Vue, options) {
		Vue.prototype.$bus = new Vue();
	}
};
Vue.use(eventBus);




Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
	// if(to.meta.authority){
	// 	// console.log("检测权限");
	// 	//登陆了就让其通过，否则重定向到login
	// 	if(getStore("userkey")){
	// 		// let userkey = JSON.parse(getStore("userkey")).token;
	// 		// // console.log(userkey);
	// 		next();
	// 	}else{
	// 		next({path:'/yuncaiji/chushou'});
	// 	}
	// }else{
	// 	// console.log("001122");
	// 	next();
	// }

	// if(to.meta.title){
	// 	document.title = to.meta.title;
	// }
	next();

});

router.afterEach((to, from) => {
	// 添加统计:
	// _czc.push(["_trackPageview", from.fullPath,to.fullPath]);
	if (window._czc) {
		// window._czc.push(["_setAutoPageview", false]);
		let location = window.location; //路由变化
		let contentUrl = "/#" + to.fullPath; //自定义当前url，可带上路由以此区分每个页面
		let refererUrl = location.protocol + "//" + location.host + "/#" + from.fullPath;
		window._czc.push(["_setAutoPageview", false]);
		window._czc.push(["_trackPageview", contentUrl, refererUrl])
	}
});


var vue = new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
})

export default vue
