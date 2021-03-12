<template>
    <div class="save">
        <van-nav-bar left-arrow fixed @click-left="goback">
            <template #title> 安全中心</template>
        </van-nav-bar>


        <div class="saveData">
            <div class="my myData" @click="openPopup">
                修改密码
                <van-icon name="arrow" />
            </div>
            <div class="my myorder" @click="logOff">
                注销账号<van-icon name="arrow" />
            </div>
            <div class="my myorder" @click="loginOut">
                退出登录<van-icon name="arrow" />
            </div>
        </div>

        <van-popup v-model="isOpen" round position="bottom" closeable class="regist-box">
            <div class="psw-box">
                <form class="form">
                    <p class="p-title">修改密码</p>
                    <van-field 
                        left-icon="bulb-o"
                        
                        label="旧密码：" 
                        placeholder=""
                        autocomplete="旧密码"
                        v-model="oldpsw"
                        :type="isText ? 'text' : 'password' " 
                        :right-icon="isText ? 'eye-o' : 'closed-eye' " 
                        @click-right-icon="toggleText"
                    />
                    <van-field class="new"
                        left-icon="bulb-o" 
                        label="新密码：" 
                        placeholder=""
                        autocomplete="新密码(必须以字母开头)"
                        v-model="newpsw"
                        :type="isEyes ? 'text' : 'password' " 
                        :right-icon="isEyes ? 'eye-o' : 'closed-eye' " 
                        @click-right-icon="toggleEyes"
                    />
                </form>
                

            <div class="login-btn">
                <van-button hairline color="#000" block round class="vanbt" @click="changePassword">提交</van-button>
            </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import "../assets/less/mySave.less"
import { Dialog } from 'vant';

// 导入 utils工具库 ，因为是有名导出 所以在导入时必须解构
import {utils} from "../assets/js/utils.js"

export default {
    name: "mySave",
    data(){
        return{
            
            userRegist:{
                phone:"",
                password:"",
                nickName:""
            },

            newpsw:"",
            oldpsw:"",
            // eye图标
            isText: false,
            isEyes: false,
            // 弹出框
            isOpen:false
        }
    },
    components:{
        [Dialog.Component.name]: Dialog.Component,
    },
    methods:{
        goback() {
            this.$router.go(-1);
        },


        // 注销账号
        logOff(){
            
            Dialog.confirm({
                title: '是否退出',
            }).then(() => {
                // 获取token
                let tokenString = localStorage.getItem("tokenString")
                if (!tokenString) {
                    return this.$toast({
                        message: "浏览器token不存在",
                        forbidClick: true,
                        duration: 800,
                    });
                }

                this.$toast.loading({
                    message: "正在注销...",
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                //请求方式
                    method: "POST",
                    url: this.baseUrl + "destroyAccount",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                    },
                }).then((res) => {
                    console.log("res", res);
                    this.$toast.clear();
                    
                    if (res.data.code == "G001") {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                        return this.$router.push({ name: "Login" });
                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000,
                    });
                }).catch((err) => {
                    this.$toast.clear();
                    console.log("err ==> ", err);
                });

            })
        },
        // 点击修改密码 打开弹出框
        openPopup(){
            this.isOpen=true;
        },
        // 修改密码
        changePassword(){
            let newPassword = {
                password:{
                    value: this.newpsw,
                    reg: /^[A-Za-z]\w{5,15}$/,
                    errorMag: "密码必须是6-14位并且以字母开头",
                },
            }
            // 调用 utils的表单验证 进行验证
            // 如果表单验证失败 拦截注册
            if(!utils.formCheck(newPassword)){
                return;
            }
            
            // 否则 发起 更改请求
            // 获取token
            let tokenString = localStorage.getItem("tokenString")
            if (!tokenString) {
                console.log("浏览器token不存在");
                return;
            }
            // 加载提示
            this.$toast.loading({
                message: '修改中...',
                forbidClick: true,
                duration:0, //如果响应失败不能关闭加载提示
            });

            // 发起请求
            this.axios({
                //请求方式
                method: "POST",
                url: this.baseUrl + "updatePassword",
                data: {
                    appkey: this.appkey,
                    tokenString,
                    password: this.newpsw,
                    oldPassword: this.oldpsw
                },
            }).then((res) => {
                // console.log("res", res);
                this.$toast.clear();
                this.isOpen=false;
                
                if (res.data.code == "E001") {
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000,
                    });
                    return this.$router.push({ name: "Login" });
                }
                this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 1000,
                });
            }).catch((err) => {
                this.$toast.clear();
                console.log("err ==> ", err);
            });




        },

        // 点击eye图标
        toggleText(){
            this.isText = !this.isText;
        },
        toggleEyes(){
            this.isEyes = !this.isEyes;
        },

        // 退出登录
        loginOut() {
            let tokenString = localStorage.getItem("tokenString")

            if (!tokenString) {
                console.log("浏览器token不存在");
                return this.$router.push({ name: "Login" });
            }

            this.$toast.loading({
                message: "正在退出...",
                forbidClick: true,
                duration: 0,
            });

            this.axios({
                //请求方式
                method: "POST",
                url: this.baseUrl + "logout",
                data: {
                    appkey: this.appkey,
                    tokenString,
                },
            }).then((res) => {
                // console.log("res", res);
                this.$toast.clear();
                
                if (res.data.code == "F001") {
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000,
                    });
                    localStorage.removeItem("tokenString")
                    return this.$router.push({ name: "Login" });
                }
                this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 1000,
                });
            }).catch((err) => {
                this.$toast.clear();
                console.log("err ==> ", err);
            });
        }
    }
}
</script>
