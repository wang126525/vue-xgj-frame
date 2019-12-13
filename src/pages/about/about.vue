<template>
	<div class="main-content">
		about{{pagedefault}}
	</div>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				pagedefault: this.$route.path,
			}
		},
		methods: {

		},
		watch: {
			$route() {
				if (this.$route.path) {
					this.pagedefault = this.$route.path;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/*@import '../../style/common.scss';*/
	@import '../../style/mixin.scss';

	.main-content {
		background-color: #f5f5f5;
	}

	.content {
		width: 80%;
		@include fj();
		align-items: top;
		margin: 0 auto;
		/*padding:0 20px;*/
		margin-top: 20px;

		.left-content {
			width: 300px;
			min-height: 650px;
			background: #FFFFFF;

		}

		.right-content {
			width: 100%;
			margin-left: 20px;
			background: #FFFFFF;
			min-height: 650px;

		}
	}

	.el-menu-item.is-active span {
		color: #409EFF;
	}

	.router-fade-enter-active,
	.router-fade-leave-active {
		transition: opacity .3s;
	}

	.router-fade-enter,
	.router-fade-leave-active {
		opacity: 0;
	}
</style>
