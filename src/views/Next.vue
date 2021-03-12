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
                    label="手机号：" 
                    placeholder="手机号" 
                    v-model="userInfo.phone" 
                />
                <div class="van-box">
                    <van-field  
                        label="密　码：" 
                        placeholder="密码必须以字母开头" 
                        v-model="userInfo.password"
                        autocomplete="off"
                        :type="isText ? 'text' : 'password' " 
                        :right-icon="isText ? 'eye-o' : 'closed-eye' " 
                        @click-right-icon="toggleText"
                    />
                </div>
            </form>

            <div class="forget" @click="toLogin"><span>已有账号？立即登录</span></div>

            <div class="login-btn">
                <van-button 
                    hairline color="#000" 
                    block round 
                    class="vanbt"
                    @click="submitInfo">提交
                </van-button>
                <van-button 
                    hairline color="#000" 
                    block round 
                    class="vanbt"
                    @click="prev">返回
                </van-button>
            </div>

        </div>

        <div class="menu" @click="menuBtn">
            <i class="close iconfont icon-searchclose animate__animated animate__backInRight"></i>
        </div>
    </div>
</template>

<script>
// 导入 css文件
// import "../assets/less/login.less"
import "../assets/less/findPassword.less"
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
                userInfo:{
                    phone:"",
                    password:"", //验证码
                },
                // 弹出框
                isOpen: false,
                // eye图标
                isText: false,
                isEyes: false
            }
        },
        methods:{
            // 点击eye图标
            toggleText(){
                this.isText = !this.isText;
            },
            toggleEyes(){
                this.isEyes = !this.isEyes;
            },
            
            // 提交
            submitInfo(){
                if(this.userInfo.phone == ""){
                    return this.$toast({
                        message: "请输入手机号",
                        forbidClick: true,
                        duration: 2000,
                    })
                }
                if(this.userInfo.password == ""){
                    return this.$toast({
                        message: "请输入一个新密码",
                        forbidClick: true,
                        duration: 2000,
                    })
                }
                let userVal={
                    phone:{
                        value: this.userInfo.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMag: "请输入正确的手机号格式"
                    },
                    password:{
                        value: this.userInfo.password,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMag: "密码必须是6-14位并且以字母开头",
                    }
                };

                // 调用 utils的表单验证 进行验证
                // 如果表单验证失败 拦截注册
                if(!utils.formCheck(userVal)){
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
                    url: this.baseUrl+'retrievePassword',
                    // 如果时post请求 ，参数需要挂载
                    data:{
                        appkey: this.appkey,
                        phone: this.userInfo.phone,
                        password: this.userInfo.password
                    },
                }).then(res=>{
                    // 关闭加载框
                    this.$toast.clear();
                    console.log(res.data)

                    if(res.data.code !="L001"){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 2000,
                        })                        
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 2000,
                        })
                        this.$router.push({path:"/login"})
                    }
                }).catch(error=>{// 捕获报错
                    // 关闭加载框
                    this.$toast.clear();
                    console.log(error)
                })
            },
            // 返回
            prev(){
                this.$router.go(-1);
            },


            // 跳转
            menuBtn(){
                this.$router.push({path:"/"})
            },
            toLogin(){
                this.$router.push({path:"/login"})
            },
            toHome(){
                this.$router.push({path:"/home"})
            },

        }
    }


</script>
<style>
    .menu{
        top: 25px;
        right: 20px;
    }
</style>