<template>
	<el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :close-on-click-modal="false" width="396px" :before-close="handleClose">
		<div class="bglogin">
			<div class="formcontent">
				<div style="margin-bottom: 20px;margin-left: 15px;">
					<span :class="isLogin ? 'logintitle logintitle-active' : 'logintitle'" @click="isLogin = true">登录</span>
					<span :class="isLogin ? 'logintitle' : 'logintitle logintitle-active'" @click="isLogin = false">注册</span>
				</div>
				<div v-show="isLogin">
					<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm" hide-required-asterisk>
						<!-- <div style="margin-left: 60px;text-align: center;margin-bottom: 60px;font-weight: bold;">登录</div> -->
						<el-form-item prop="phoneNumber">
							<el-input placeholder="请输入手机号码" v-model="ruleForm.phoneNumber"><i slot="prefix" class="iconfont iconwo"></i></el-input>
						</el-form-item>
						<el-form-item prop="pass">
							<el-input
								v-on:keyup.native.enter="submitForm('ruleForm', 1)"
								:type="pwdType1?'password':'text'"
								placeholder="请输入密码"
								v-model="ruleForm.pass"
								autocomplete="off"
								maxlength="16"
							>
								<i slot="prefix" class="iconfont iconmima"></i>
								<i slot="suffix" :class="pwdType1?'iconfont iconicon-test':'iconfont iconxianshimima'" style="color: #999;" @click="pwdType1=!pwdType1"></i>
							</el-input>
						</el-form-item>
						<el-form-item><el-checkbox v-model="savepw">记住密码</el-checkbox></el-form-item>
						<el-form-item><el-button class="submitBtn" type="primary" @click="submitForm('ruleForm', 1)">登录</el-button></el-form-item>
						<div>
							<span class="littletip" @click="findPsd">找回密码</span>
							<span style="font-size: 12px;color: #666666;">| 还没有注册账号？</span>
							<span @click="isLogin = !isLogin" class="littletip">立即注册</span>
						</div>
					</el-form>
				</div>
				<div v-show="!isLogin">
					<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm2" class="demo-ruleForm" hide-required-asterisk>
						<!-- <div style="margin-left: 60px;text-align: center;margin-bottom: 60px;font-weight: bold;">注册</div> -->
						<el-form-item prop="regPhone">
							<el-input type="text" placeholder="请输入手机号码" v-model="ruleForm.regPhone" clearable><i slot="prefix" class="iconfont iconwo"></i></el-input>
						</el-form-item>
						<el-form-item prop="regCode">
							<el-col :span="12"><el-input placeholder="请输入短信验证码" type="text" v-model="ruleForm.regCode" maxlength="6" clearable></el-input></el-col>
							<el-col :span="11" :offset="1">
								<el-button ref="getcode" class="codebtn" @click.native="getCode()">{{ codeWord }}</el-button>
							</el-col>
						</el-form-item>
						<!-- <el-form-item label="验证码" prop="regCode"><el-input type="text" v-model="ruleForm.regCode" clearable></el-input></el-form-item> -->
						<!-- <el-form-item prop="username"><el-input type="text" v-model="ruleForm.username" clearable><i slot="prefix" class="iconfont iconwo"></i></el-input></el-form-item> -->
						<el-form-item prop="regPass">
							<el-input :type="pwdType2?'password':'test'" placeholder="请输入密码" v-model="ruleForm.regPass" autocomplete="off" maxlength="16">
								<i slot="prefix" class="iconfont iconmima"></i>
								<i slot="suffix" :class="pwdType2?'iconfont iconicon-test':'iconfont iconxianshimima'" style="color: #999;" @click="pwdType2=!pwdType2"></i>
							</el-input>
						</el-form-item>
						<!-- <el-form-item prop="checkRegPass">
							<el-input type="password" placeholder="请再次输入密码" v-model="ruleForm.checkRegPass" autocomplete="off" clearable><i slot="prefix" class="iconfont iconmima"></i></el-input>
						</el-form-item> -->

						<el-form-item>
							<el-col :span="12">
								<el-select v-model="ruleForm.provinceCode" placeholder="请选择省份">
									<el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code"></el-option>
								</el-select>
							</el-col>
							<el-col :span="11" :offset="1">
								<el-select v-model="ruleForm.cityCode" placeholder="请选择城市">
									<el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
								</el-select>
							</el-col>
						</el-form-item>
						<el-form-item>
							<el-select style="width: 100%;" v-model="ruleForm.districtCode" placeholder="请选择区域">
								<el-option v-for="item in districtList" :key="item.code" :label="item.name" :value="item.code"></el-option>
							</el-select>
						</el-form-item>

						<!-- <el-form-item prop="regAddr"><el-cascader v-model="ruleForm.regAddr" :props="props" clearable></el-cascader></el-form-item> -->
						<el-form-item><el-button class="submitBtn" type="primary" @click="submitForm('ruleForm2', 0)">免费创建账户</el-button></el-form-item>
						<!-- <div>
							<span>已有账号？</span>
							<span @click="isLogin = !isLogin" style="color: red;cursor: pointer;">去登录</span>
						</div> -->
					</el-form>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script>
import Vue from 'vue';
import { mapMutations } from 'vuex';
import { getCode, getProvince, getCity, getDistrict, register, login } from '../service/getData';
import { setStore, getStore } from '../config/mUtils';
import md5 from 'js-md5';
export default {
	// props:["dialogVisible"]
	data() {
		var checkPhone = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入手机号码'));
			} else {
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
					callback(new Error('请输入有效的手机号码'));
				} else {
					callback();
				}
			}
		};
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (value.length >= 6 && value.length <= 16) {
					if (this.ruleForm.checkRegPass !== '') {
						this.$refs.ruleForm.validateField('checkRegPass');
					}
					callback();
				} else {
					callback(new Error('长度在 6 到 16 个字符'));
				}
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm.regPass) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		var regAddr = (rule, value, callback) => {
			// console.log(value);
			if (value === '') {
				callback(new Error('请选择地址'));
			} else {
				callback();
			}
		};

		return {
			pwdType1:true,//登录密码眼睛
			pwdType2:true,//注册密码眼睛
			savepw: true,
			dialogVisible: false,
			countdown: 60,
			isLogin: true,
			codeWord: '获取短信验证码',
			path: '', //即将要跳转的路由；
			provinceList: [],
			cityList: [],
			districtList: [],
			timer: null,
			urlParams: null,
			ruleForm: {
				phoneNumber: '',
				pass: '',
				username: '',
				regPass: '',
				checkRegPass: '',
				regPhone: '',
				regCode: '',
				provinceCode: '',
				cityCode: '',
				districtCode: '',

				// regAddr: ''
			},
			companyId:'',
			storeId:'',
			hzlyId:'',
			hzlyCity:'',
			domain:'',
			rules: {
				pass: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }],
				phoneNumber: [{ validator: checkPhone, trigger: 'blur' }],
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				regPass: [{ validator: validatePass, trigger: 'blur' }],
				checkRegPass: [{ validator: validatePass2, trigger: 'blur' }],
				regPhone: [{ validator: checkPhone, trigger: 'blur' }],
				regCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
				regAddr: [{ validator: regAddr, trigger: 'blur' }]
			}
		};
	},
	watch: {
		'ruleForm.provinceCode'(newValue, oldValue) {
			getCity({ provinceCode: newValue }).then(res => {
				// console.log(res.data);
				if (res.success) {
					this.districtList = [];
					this.cityList = [];
					this.ruleForm.cityCode = '';
					this.ruleForm.districtCode = '';
					this.cityList = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		'ruleForm.cityCode'(newValue, oldValue) {
			getDistrict({ cityCode: newValue }).then(res => {
				// console.log(res.data);
				if (res.success) {
					this.ruleForm.districtCode = '';
					this.districtList = [];
					this.districtList = res.data;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		isLogin(newValue, oldValue) {
			this.resetForm('ruleForm2');
			this.resetForm('ruleForm');
			// console.log('111');
		},
		dialogVisible(newValue, oldValue) {
			this.isLogin = true;
			this.ruleForm.phoneNumber = '';
			this.ruleForm.pass = '';
		},
		$route(to, from) {
			// console.log(to, '******');
		}
	},
	created() {
		// // console.log("\\\\\\\\");
		// // 监听组件；
		// this.$bus.$on('islogin', (params) => {
		//   this.dialogVisible = params.islogin;
		//   // this.path = params.path;
		// });
		// 获取省份列表；

		// 获取跨平台的连接数据
		if(getStore('cross')){
			this.urlParams = JSON.parse(getStore('cross'));
			this.companyId = this.urlParams.companyId;
			this.storeId = this.urlParams.storeId;
			this.hzlyId = this.urlParams.userId;
			this.domain = this.urlParams.domain;
			this.hzlyCity = this.urlParams.city;
			
		}else{
			this.urlParams = {};
		}

		// // console.log(JSON.parse(getStore('cross')),"0022");

		getProvince().then(res => {
			// console.log(res.data);
			if (res.success) {
				this.provinceList = res.data;
			} else {
				this.$message.error(res.msg);
			}
		});
	},
	mounted() {
		// console.log('\\\\\\\\45324534');
		// 监听组件；
		this.$bus.$on('islogin', params => {
			this.dialogVisible = params.islogin;
			// this.path = params.path;
		});
		// this.RECORD_USERINFO(JSON.parse(getStore("userkey")));
	},

	// 清除组件监听；
	beforeDestroy() {
		// console.log('off');
		this.$bus.$off('islogin');
	},

	methods: {
		...mapMutations(['RECORD_USERINFO']),
		// 找回密码
		findPsd() {
			this.$router.push({ name: 'forgetPsd' });
		},
		handleClose(done) {
			// this.$confirm('确认关闭？')
			// .then(_ => {
			done();
			// })
			// .catch(_ => {});
		},
		submitForm(formName, n) {
			this.$refs[formName].validate((bool, valid) => {
				if (bool) {
					// 注册
					if (n == 0) {
						let params = {
							username: this.ruleForm.username,
							mobile: this.ruleForm.regPhone,
							code: this.ruleForm.regCode,
							password: md5(this.ruleForm.regPass).toString().toUpperCase(),
							provinceCode: this.ruleForm.provinceCode,
							cityCode: this.ruleForm.cityCode,
							districtCode: this.ruleForm.districtCode,
							companyId:this.companyId,
							storeId:this.storeId,
							hzlyId:this.hzlyId,
							domain:this.domain,
							hzlyCity:this.hzlyCity
						};
						// this.$axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
						register(params).then(res => {
							// console.log(res);
							if (res.success) {
								this.$message.success(res.msg);
								// this.resetForm('ruleForm2');
								this.isLogin = !this.isLogin;
							} else {
								this.$message.error(res.msg);
							}
						});
						// 登录
					} else {
						// this.$axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
						let params = {
							mobile: this.ruleForm.phoneNumber,
							password: md5(this.ruleForm.pass).toString().toUpperCase(),
							loginType: 2,
							companyId:this.companyId,
							storeId:this.storeId,
							hzlyId:this.hzlyId,
						};
						login(params).then(res => {
							// console.log(res.data);
							if (res.success) {
								// console.log(res);
								setStore('userkey', res.data);
								// this.RECORD_USERINFO(res.data);
								// if(this.path != ""){
								// 	// console.log(this.path);
								// 	this.$router.push({path:this.path});
								// 	this.path = "";
								// };
								this.$router.push({ path: '/yuncaiji/chushou', query: this.urlParams });
								this.dialogVisible = false;
								// location.reload();
								setTimeout(function() {
									location.reload();
								}, 0);
								// this.$router.push({ name: 'chushou' });
								// 登录成功，可以影藏弹窗；
							} else {
								this.$message.error(res.msg);
							}
						});
					}
				} else {
					// console.log('error submit!!');
					return false;
				}
			});
		},

		getCode() {
			this.$refs.ruleForm2.validateField('regPhone', error => {
				// console.log(error);
				if (error == '') {
					getCode({ mobile: this.ruleForm.regPhone }).then(res => {
						// console.log(res, 1);
						if (res.success) {
							// console.log(this.countdown);
							this.$refs.getcode.$el.setAttribute('disabled', 'disabled');
							var that = this;
							this.timer = setInterval(function() {
								that.codeWord = that.countdown + 's';
								that.countdown = that.countdown - 1;
								if (that.countdown == 0) {
									Vue.nextTick(function() {
										that.codeWord = '发送验证码';
									});
									that.$refs.getcode.$el.removeAttribute('disabled');
									that.countdown = 60;
									clearInterval(that.timer);
								}
							}, 1000);
						}else{
							this.$message.error(res.msg);
						}
					});
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
};
</script>

<style lang="scss" scoped="scoped">
/deep/ .el-dialog__header {
	padding: 4px;
}
/deep/ .el-dialog__body {
	padding: 0 20px 20px 20px;
}
/deep/ .el-dialog__headerbtn {
	font-size: 26px;
}
/deep/ .el-input--prefix .el-input__inner {
	padding-left: 45px;
}
/deep/ .el-input__prefix {
	left: 15px;
	/deep/ .iconfont {
		font-size: 20px;
		color: #666666;
	}
}
.codebtn.el-button {
	width: 163px;
	font-size: 14px;
	box-sizing: border-box;
	border: #028bff solid 2px;
	height: 40px;
	/deep/ span {
		color: #028bff;
	}
}
.logintitle {
	font-size: 16px;
	font-weight: bold;
	color: #666666;
	margin-right: 50px;
	display: inline-block;
	height: 48px;
	line-height: 50px;
	cursor: pointer;
}
.logintitle-active {
	border-bottom: solid 4px #518eeb;
	color: #518eeb;
}
.littletip {
	font-size: 12px;
	color: #518eeb;
	cursor: pointer;
}

.bglogin {
	// background: url(../../imgs/login.jpg) repeat;
	width: 100%;
	min-height: 380px;
	.formcontent {
		width: 100%;
		margin: 0 auto;
		padding-top: 20px;
	}
	.submitBtn {
		width: 100%;
		& /deep/ span {
			color: #ffffff;
		}
	}
	.el-cascader {
		width: 100%;
	}
}
</style>
