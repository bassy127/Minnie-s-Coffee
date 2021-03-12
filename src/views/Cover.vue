<template>
    <div>
        <div class="cover">
            <div class="cover-title">
                <i class="shopName">Minnie's Coffee</i><i>/源于美味</i>
            </div>
            <div>
                <p>心情惬意，来杯咖啡吧☕</p>
                <img src="../assets/images/login/login-2.jpg">
                <div class="dot">
                    <div>
                        <i></i>
                        <i></i>
                        <i></i>
                    </div>
                </div>
            </div>
            <div class="cover_nav">
                <div class="cover_about">About</div>
                <div class="oblique_line">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
            </div>
            <div class="content">
                <div class="content-title">
                    <h2>Sweet, rich and a bit of magic</h2>
                    <div class="content-line"></div>
                    <div class="content-card" v-for="(key,i) in cardItems" :key="i">
                        <img class="title-bg" :src="key.img">
                        <span :class="key.className">{{key.title}}</span>
                        <img class="div-line" src="../assets/images/login/divide.svg">
                        <div class="p">{{key.desc1}}</div>
                        <div class="p">{{key.desc2}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="menu" @click="menuBtn">
            <div class="menu-box animate__animated animate__backInRight">
                <div class="line l-top"></div>
                <span>Login</span>
                <div class="line l-bottom"></div>
            </div>
            <!-- <i class="close iconfont icon-searchclose animate__animated animate__backInRight" v-show="!isShow"></i> -->
        </div>
    </div>
</template>

<script>
// 导入 css文件
import "../assets/less/cover.less"
    export default {
        name:"Cover",
        data(){
            return{
                cardItems:[
                    {
                        className:"t-1",
                        img:require("../assets/images/login/tea.jpg"),
                        title:"Raw Material",
                        desc1:"全球精选好茶",
                        desc2:"原叶鲜萃茶场"
                    },
                    {
                        className:"t-2",
                        img:require("../assets/images/login/login-1.jpg"),
                        title:"Selling Point",
                        desc1:"优选上等阿拉比豆",
                        desc2:"新鲜烘焙 新鲜现磨"
                    },
                    {
                        className:"t-3",
                        img:require("../assets/images/login/login-3.jpg"),
                        title:"Advantage",
                        desc1:"共享全球优质供应链",
                        desc2:"稳定新鲜卫生"
                    }
                ],
            }
        },
        methods:{
            menuBtn(){
                // 判断是否登录 
                // let tokenString =  this.$cookies.get("tokenString");
                let tokenString = localStorage.getItem("tokenString")
                if (tokenString) {
                    this.$toast({
                        message: "欢迎回来",
                        forbidClick: true,
                        duration: 800,
                    });
                    return this.$router.push({name: "Home"})
                }
                this.$router.push({ path: '/login' })
            }
        }
    }
</script>