<template>
    <div class="login">
        <MoveLine></MoveLine>
        <div class="cover-title" >
            <van-nav-bar >
                <template #left>
                    <div @click="toHome">
                        <i class="head-img" >
                            <!-- <img src="../assets/images/myLogo2.png" alt=""> -->
                        </i>
                        <span class="head-text">Home</span>
                    </div>
                </template>
            </van-nav-bar>
        </div>

        <div class="welcome-box">
            <div class="wc-box">
                <div class="oblique_line">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <span>Welcome</span>
                </div>
                <img src="../assets/images/login/bg3.svg">
            </div>
        </div>

        <!-- 登录框 -->
        <div class="login-box">
            <form>
                <van-field 
                    left-icon="phone-circle-o" 
                    label="手机号：" 
                    placeholder="请输入手机号" 
                    v-model="userLogin.phone" 
                />
                <van-field 
                    left-icon="bulb-o" 
                    label="密　码：" 
                    placeholder="请输入密码" 
                    v-model="userLogin.password"
                    autocomplete="off"
                    :type="isText ? 'text' : 'password' " 
                    :right-icon="isText ? 'eye-o' : 'closed-eye' " 
                    @click-right-icon="toggleText"
                />
            </form>

            <div class="forget" @click="toFindPassword"><span>忘记密码?</span></div>

            <div class="login-btn">
                <van-button 
                    hairline color="#000" 
                    block round 
                    class="vanbt"
                    @click="login">登　录
                </van-button>
                <van-button 
                    plain hairline 
                    color="#000" 
                    block round 
                    @click="openPopup">注　册
                </van-button>
            </div>

        </div>
        <!-- 注册框 -->
        <van-popup v-model="isOpen" round position="bottom" closeable class="regist-box">
            <div class="login-box">
                <form>
                    <van-field 
                        left-icon="smile-o" 
                        label="昵　称：" 
                        placeholder="请输入昵称" 
                        v-model="userRegist.nickName" 
                    />
                    <van-field 
                        left-icon="phone-circle-o" 
                        label="手机号：" 
                        placeholder="请输入手机号(11位)" 
                        v-model="userRegist.phone" 
                    />
                    <van-field 
                        left-icon="bulb-o" 
                        label="密　码：" 
                        placeholder="请输入密码(6-11位)"
                        autocomplete="off"
                        v-model="userRegist.password"
                        :type="isEyes ? 'text' : 'password' " 
                        :right-icon="isEyes ? 'eye-o' : 'closed-eye' " 
                        @click-right-icon="toggleEyes"
                    />
                </form>
                

            <div class="login-btn">
                <van-button hairline color="#000" block round class="vanbt" @click="regist">注　册</van-button>
            </div>
            </div>
        </van-popup>

        <div class="menu" @click="menuBtn">
            <i class="close iconfont icon-searchclose animate__animated animate__backInRight"></i>
        </div>
    </div>
</template>

<script>
// 导入 css文件
// import "../assets/less/login.less"
import "../assets/less/login.less"
import "../assets/less/cover.less"
import MoveLine from "../components/MoveLine.vue"


// 导入 utils工具库 ，因为是有名导出 所以在导入时必须解构
import {utils} from "../assets/js/utils.js"
    export default {
        name: "Login",
        components:{
            MoveLine
        },
        data(){
            return {
                // 用户登录信息
                userLogin:{
                    phone:"",
                    password:""
                },
                // 用户注册信息
                userRegist:{
                    phone:"",
                    password:"",
                    nickName:""
                },
                // 弹出框
                isOpen: false,
                // eye图标
                isText: false,
                isEyes: false
            }
        },
        methods:{
            // 点击注册 打开弹出框
            openPopup(){
                this.isOpen=true;
            },
            // 点击eye图标
            toggleText(){
                this.isText = !this.isText;
            },
            toggleEyes(){
                this.isEyes = !this.isEyes;
            },
            // 注册信息
            regist(){
                // this.isOpen=false;
                let registVal={
                    phone:{
                        value: this.userRegist.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMag: "请输入正确的手机号格式"
                    },
                    password:{
                        value: this.userRegist.password,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMag: "密码必须是6-14位并且以字母开头",
                    },
                    nickName:{
                        value: this.userRegist.nickName,
                        reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
                        errorMag: "昵称支持汉字字母数字组合"
                    },
                };

                // 调用 utils的表单验证 进行验证
                // 如果表单验证失败 拦截注册
                if(!utils.formCheck(registVal)){
                    return;
                }
                // 否则 发起注册请求
                // 加载提示
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration:0, //如果响应失败不能关闭加载提示
                });
                // 发起 注册请求
                this.axios({
                    method: 'POST', // 请求方式
                    url: this.baseUrl+'register',
                    // 如果时post请求 ，参数需要挂载 在 data中，但是不可以直接传，需要对参数进行处理 为 a=1&b=2&c=3 格式————用拦截器进行处理（在main.js(入口函数)中如果通过 发送请求，否则不发送）
                    data:{
                        appkey: this.appkey,
                        nickName: this.userRegist.nickName,
                        phone: this.userRegist.phone,
                        password: this.userRegist.password,
                    }
                }).then(res=>{
                    // 关闭加载框
                    this.$toast.clear();
                    if(res.data.code==100){
                        this.$toast({
                            message: '你已成功注册~快来登录吧！',
                            forbidClick: true,
                            duration: 800
                        });
                        // 请求成功 关闭弹出框
                        this.isOpen=false;
                        // 清空用户信息
                        for(let i in this.userRegist){
                            this.userRegist[key] = ""
                        }
                        this.$router.push({name: "Login"})
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 2000,
                        })
                    }
                }).catch(error=>{// 捕获报错
                    // 关闭加载框
                    // this.$toast.clear();
                    console.log(error)
                })

            },
            // 登录信息
            login(){
                let loginVal={
                    phone:{
                        value: this.userLogin.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMag: "请输入正确的手机号格式"
                    },
                    password:{
                        value: this.userLogin.password,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMag: "密码必须是6-14位并且以字母开头",
                    }
                };

                // 调用 utils的表单验证 进行验证
                // 如果表单验证失败 拦截注册
                if(!utils.formCheck(loginVal)){
                    return;
                }
                // 否则 发起登录请求
                // 加载提示
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration:0, //如果响应失败不能关闭加载提示
                });
                // 发起 登录请求
                this.axios({
                    method: 'POST', // 请求方式
                    url: this.baseUrl+'login',
                    // 如果时post请求 ，参数需要挂载
                    data:{
                        appkey: this.appkey,
                        phone: this.userLogin.phone,
                        password: this.userLogin.password,
                    },
                }).then(res=>{
                    // 关闭加载框
                    this.$toast.clear();
                    // console.log(res.data)
                    if(res.data.code==200){
                        // 存储token：用于下次访问 有关用户信息界面 的登录标记
                        // this.$cookies.set("tokenString",res.data.token,"1d")
                        
                        // 使用 本地 存储
                        localStorage.setItem('tokenString',res.data.token)
                        // 跳转到 首页
                        this.$router.push({name: "Home"});
                        // this.$router.push({path: "/home"});
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 2000,
                        })
                    }
                }).catch(error=>{// 捕获报错
                    // 关闭加载框
                    this.$toast.clear();
                    console.log(error)
                })
            },

            menuBtn(){
                this.$router.push({path:"/"})
            },
            toHome(){
                this.$router.push({path:"/home"})
            },
            toFindPassword(){
                this.$router.push({path:"/findPassword"})
            }
        }
    }


</script>
<style>
    .menu{
        top: 25px;
        right: 20px;
    }
</style>