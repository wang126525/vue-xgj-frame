import axios from 'axios'
import qs from 'qs'
import {getStore, removeStore,} from './mUtils'
import vue from '../main'

// let that = this;
// axios.defaults.timeout = 10000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = process.env.BASE_URL;   //配置接口地址
// axios.defaults.headers.common['authorization'] = token;//外层配置默认token
// console.log(process.env);
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //判断是否携带token
	if(getStore("userkey")){
		const token = JSON.parse(getStore("userkey")).token;
		config.headers['authorization'] = token;
	}
	// post请求序列化参数
    if(config.method  === 'post'){
        config.data = JSON.stringify(config.data);
    }else{
		
	}
	
	if (window._czc) {
	      // window._czc.push(["_setAutoPageview", false]);
	      let location = window.location;//路由变化
	      // let contentUrl = location.pathname + location.hash;//自定义当前url，可带上路由以此区分每个页面
	      // // console.log(config);
		  let contentUrl;
		  if(config.params){
			let keys = Object.keys(config.params);
			let strArr = [];
			for(var i=0;i<keys.length;i++){
				strArr.push(keys[i]+"="+config.params[keys[i]]);
			};
			let str = strArr.join("&");
			contentUrl = config.url+"?"+str;
		  }else{
			  contentUrl = config.url;
		  }
	      let refererUrl = location.href;
	      window._czc.push(["_setAutoPageview", false]);
	      window._czc.push(["_trackPageview", contentUrl, refererUrl])
	}
	
	
    return config;
},(error) =>{
    // console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    if(!res.data.success){
		if(res.data.code == "SYS_USER_LOGIN_EXPIRE_ERROR"){
			removeStore('userkey');
			// location.reload();
			vue.$router.push({name:'loselogin'});
		}else{
			return Promise.resolve(res);
		}
        
    }else{
		return res;
	}
}, (error) => {
    // console.log('网络异常')
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params,{headers: {'Content-Type': 'application/json;charset=UTF-8'}})
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: param})
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export default {
    fetchPost,
    fetchGet,
}