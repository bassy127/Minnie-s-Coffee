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
                    label="邮　箱：" 
                    placeholder="邮箱" 
                    v-model="userInfo.email" 
                />
                <div class="van-box">
                    <van-field  
                        label="验证码：" 
                        placeholder="验证码(6个字符)" 
                        v-model="userInfo.code"
                        autocomplete="off"
                    />
                        <!-- :type="isText ? 'text' : 'password' " 
                        :right-icon="isText ? 'eye-o' : 'closed-eye' " 
                        @click-right-icon="toggleText" -->
                </div>
            </form>

            <div class="forget" @click="toLogin"><span>已有账号？立即登录</span></div>

            <div class="login-btn">
                <van-button 
                    hairline color="#000" 
                    block round 
                    class="vanbt"
                    @click="sendCode">发送验证码
                </van-button>
                <van-button 
                    hairline color="#000" 
                    block round 
                    class="vanbt"
                    @click="next">下一步
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
                    email:"",
                    code:"", //验证码
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
            
            // 发送验证码
            sendCode(){
                let userVal={
                    email:{
                        value: this.userInfo.email,
                        reg: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        errorMag: "请输入正确的邮箱"
                    },
                    // code:{
                    //     value: this.userInfo.code,
                    //     reg: /^\d{6}$/,
                    //     errorMag: "请输入正确的验证码",
                    // }
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
                    url: this.baseUrl+'emailValidCode',
                    // 如果时post请求 ，参数需要挂载
                    data:{
                        appkey: this.appkey,
                        email: this.userInfo.email,
                    },
                }).then(res=>{
                    // 关闭加载框
                    this.$toast.clear();
                    console.log(res.data)

                    if(res.data.code !="J001"){
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
            // 验证 验证码
            next(){
                if(this.userInfo.email == ""){
                    return this.$toast({
                        message: "请输入邮箱",
                        forbidClick: true,
                        duration: 2000,
                    });
                }
                let userVal={
                    code:{
                        value: this.userInfo.code,
                        reg: /^\d{6}$/,
                        errorMag: "请输入正确的验证码",
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
                    url: this.baseUrl+'checkValidCode',
                    // 如果时post请求 ，参数需要挂载
                    data:{
                        appkey: this.appkey,
                        validCode: this.userInfo.code,
                    },
                }).then(res=>{
                    // 关闭加载框
                    this.$toast.clear();
                    console.log(res.data)

                    if(res.data.code !="K001"){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 2000,
                        })          
                    }else{
                        this.$router.push({path:"/next"})
                    }
                }).catch(error=>{// 捕获报错
                    // 关闭加载框
                    this.$toast.clear();
                    console.log(error)
                })
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