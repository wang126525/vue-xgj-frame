<template>
	<div>
		<!-- <transition name="router-fade" mode="out-in">
			<keep-alive><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
		</transition> -->
		<transition name="router-fade" mode="out-in"><router-view v-if="isRouterAlive"></router-view></transition>
		
	</div>
</template>

<script>
export default {
	name: 'App',
	provide () {//注入父级的数据
		return {
		  reload: this.reload
		}
	  },
	data () {
		return {
		  isRouterAlive: true
		}
	},
	methods: {
		reload () {
		  this.isRouterAlive = false
		  this.$nextTick(function () {
			this.isRouterAlive = true
		  })
		}
	}
};
</script>

<style lang="scss">
@import './style/common';
@import './style/mixin';
*{margin: 0;padding: 0;box-sizing: border-box;font-family: "Microsoft Yahei";}
html,body{
    height: 100%;
    width: 100%;
    background-color: #fff;
}
.cont{
	width: 80%;
	margin: 0 auto;
}
.router-fade-enter-active, .router-fade-leave-active {
	transition: opacity .3s;
}
.router-fade-enter, .router-fade-leave-active {
	opacity: 0;
}
.tableloading{
	display: inline-block;
	width: 70px;
	height: 70px;
	animation: rotating 1s linear infinite;
	// background-image: url(./imgs/loading.png);
	// background: url(./imgs/loading.png) no-repeat center;
	background-size: cover;
}
</style>
