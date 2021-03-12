<template>
    <div class="my-box">
        <div class="bg"
            :style="{ backgroundImage : `url(${myData.userBg})`}"
        >
            <van-uploader :after-read="changeBg" />
        </div>
        <div class="user-box">
            <div class="userInfo">
                <img class="head" :src="myData.userImg"
                    @touchstart.stop.prevent="star" 
                    @touchend.stop.prevent="end(myData.userImg,0)">
                <van-popup v-model="show">
                   <van-uploader :after-read="changeImg" />
                </van-popup>
                <div class="user">
                    <div class="name">{{myData.nickName}}</div>
                    <div class="introduce"><textarea rows="4" v-model="myData.desc" /></div>
                </div>
            </div>
            <div class="moreData">
                <!-- <router-link> -->
                    <div class="my myData iconfont icon-gerenziliao1"
                        @click="toMyData">
                        个人资料
                        <van-icon name="arrow" />
                    </div>
                <!-- </router-link> -->
                <div class="my myorder iconfont icon-dingdan-" @click="toMyOrder">
                    我的订单<van-icon name="arrow" />
                </div>
                <div class="my myLike iconfont icon-shoucang1" @click="toMyLike">
                    我的收藏<van-icon name="arrow" />
                    </div>
                <div class="my myAddress iconfont icon-dizhi" 
                    @click="toAddress">
                    地址管理<van-icon name="arrow" />
                </div>
                <div class="my mySave iconfont icon-anquanzhongxin" 
                @click="toSave">
                    安全中心<van-icon name="arrow" />
                </div>
                <div class="my" v-show="token" @click="logout">
                    <span></span><span class="quit">退出登录</span>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import "../assets/less/my.less"
import { ImagePreview } from 'vant';
export default {
    name:"My",
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component,
    },
    data(){
        return{
            myData:{
                nickName: "未登录",
                desc: "",
                userImg:require("../assets/images/default.png"),
                userBg:require("../assets/images/default_bg.jpg"),
                vip: 0
            },

            dataTitle:[
                { title: "个人资料", icon: "myData iconfont icon-gerenziliao1" },
                { title: "我的订单", icon: "myorder iconfont icon-dingdan-" },
                { title: "我的收藏", icon: "myLike iconfont icon-shoucang1" },
                { title: "地址管理", icon: "myAddress iconfont icon-dizhi" },
                { title: "安全中心", icon: "mySave iconfont icon-anquanzhongxin" },
            ],

            show:false,

            // 定时器变量
            timer:null,


            token:"",
        }
    },
    created(){
        this.getMy();
    }, 
    methods:{
        getMy(){
            // 用于是否显示退出
            this.token = localStorage.getItem("tokenString");
            
            let tokenString = localStorage.getItem("tokenString")
            // let tokenString =  this.$cookies.get("tokenString");
            // 验证token值
            if(!tokenString){
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                return this.$router.push({name: "Login"})
            };


            this.axios({
                method: "GET",
                url: this.baseUrl + "findMy",
                params:{
                    appkey: this.appkey,
                    tokenString: tokenString,
                }
            }).then(res=>{
                if(res.data.code == "A001"){
                    if(res.data.result[0].desc == ""){
                        res.data.result[0].desc="这个人很懒，什么都没有留下~";
                    }
                    this.myData = res.data.result[0];
                    // console.log(this.myData)
                }else{
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    });
                    return this.$router.push({name: "Login"})

                }
            }).catch(error=>{
                console.log(error)
            });
        },

        // 点击预览            
        previewImg(item,index){
            ImagePreview({
                images: [item],
                startPosition: index,
            });
        },

        // 长按
        star(){
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            // 验证token值
            if(!tokenString){
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                return this.$router.push({name: "Login"})
            };

            clearTimeout(this.timer); //再次清空定时器，防止重复注册定时器
            this.timer = setTimeout(() => {
                this.show = true
            },1000);
        },
        end(item,index){
            if(!this.show){
                this.previewImg(item,index)
            }
            clearTimeout(this.timer); // 清空定时器，防止重复注册定时器
        },


        // 更换头像
        changeImg(file) {
            // 此时可以自行将文件上传至服务器
            // console.log(file);

            // 验证token
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            // 验证token值
            if(!tokenString){
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                return this.$router.push({name: "Login"})
            };


            let imgName = file.file.name;
            // 判断是否是照片格式
            if( !(imgName.endsWith(".jpg") || imgName.endsWith(".png") || imgName.endsWith(".gif") || imgName.endsWith(".jpeg") )){
                alert("格式错误，请重新选择");
                return;
            }

            // 获取图片类型
            let imgType = file.file.type.split("/")[1];
            // console.log( imageType);
            // console.log(file.content)

            // 正则 匹配data:image/jpeg|png|gif|jpg;base64,
            let reg = /^data:image\/(jpeg|png|gif|jpg);base64,/g;
            // 切割
            let text = file.content.split(reg)
            // 获取 图片base64码
            let serverBase64Img = text[2];

            // 发起请求
            this.axios({
                method: "POST",
                url: this.baseUrl + "updateAvatar",
                data:{
                    appkey: this.appkey,
                    tokenString: tokenString,
                    imgType,
                    serverBase64Img,
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.code == "H001"){
                    this.myData.userImg = res.data.userImg;
                    this.show = false;
                }else{
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    });
                    this.$router.push({name: "Login"})
                }
            }).catch(error=>{
                console.log(error)
            });

        },

        // 更换背景
        changeBg(file) {
            // 验证token
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            // 验证token值
            if(!tokenString){
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                this.$router.push({name: "Login"})
                return this.$router.push({name: "Login"})
            };


            let imgName = file.file.name;
            // 判断是否是照片格式
            if( !(imgName.endsWith(".jpg") || imgName.endsWith(".png") || imgName.endsWith(".gif") || imgName.endsWith(".jpeg") )){
                alert("格式错误，请重新选择");
                return;
            }

            // 获取图片类型
            let imgType = file.file.type.split("/")[1];

            // 正则 匹配data:image/jpeg|png|gif|jpg;base64,
            let reg = /^data:image\/(jpeg|png|gif|jpg);base64,/g;
            // 切割
            let text = file.content.split(reg)
            // 获取 图片base64码
            let serverBase64Img = text[2];

            // 发起请求
            this.axios({
                method: "POST",
                url: this.baseUrl + "updateUserBg",
                data:{
                    appkey: this.appkey,
                    tokenString: tokenString,
                    imgType,
                    serverBase64Img,
                }
            }).then(res=>{
                if(res.data.code == "I001"){
                    this.myData.userBg = res.data.userBg;
                }else{
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    });
                    this.$router.push({name: "Login"})
                }
            }).catch(error=>{
                console.log(error)
            });

        },

        // 地址管理
        toAddress(){
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            // 验证token值
            if(!tokenString){
                this.$router.push({name: "Login"})
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                return this.$router.push({name: "Login"})
            }
            this.$router.push({name: "AddressList"})
        },

        // 显示头像

        // Mydata
        toMyData(){
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            // 验证token值
            if(!tokenString){
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                return this.$router.push({name: "Login"})
            };
            this.$router.push({name: "MyData"})
        },

        toMyOrder(){
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            if (!tokenString) {
                console.log("浏览器token不存在");
                return this.$router.push({ name: "Login" });
            }

            this.$router.push({ name: "MyOrder" })
        },


        toMyLike(){
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            if (!tokenString) {
                console.log("浏览器token不存在");
                return this.$router.push({ name: "Login" });
            }

            this.$router.push({ name: "MyLike" })
        },


        toSave(){
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            if (!tokenString) {
                console.log("浏览器token不存在");
                return this.$router.push({ name: "Login" });
            }

            this.$router.push({ name: "MySave" })
        },

        // 退出登录
        logout() {
            // let tokenString =  this.$cookies.get("tokenString");
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
                    // 移出token
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
