<template>
    <div class="mydata">
        <van-nav-bar left-arrow fixed @click-left="goback">
            <template #title>
                <van-icon name="home-o"/>
                个人资料
            </template>
        </van-nav-bar>
        <div class="mydata-box">
            <div class="my myData">头像
                <div class="img">
                    <van-image
                        round
                        width="50px"
                        height="50px"
                        :src="myData.userImg"
                    />
                    <van-uploader :after-read="changeImg" />
                </div>
            </div>
            <div class="my userId">用户ID
                <span>{{myData.userId}}</span>
            </div>
            <div class="my nickname">昵称
                <span @click="showPopup">{{myData.nickName}}</span>
                <van-popup v-model="isShow">
                    <div class="update">
                        <i>修改昵称</i>
                        <input class="inp" type="text" @blur="updateNick">
                    </div>
                </van-popup>
            </div>
            <div class="my myAddress">简介
                <textarea rows="6" v-model="myData.desc" maxlength="150" @blur="updateIntroduce"/>
            </div>
        </div>
    </div>
</template>

<script>
import "../assets/less/myData.less";
//  reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
export default {
    name: "MyData",
    data() {
        return {
            myData:{},
            isShow: false,
        }
    },
    created(){
        this.getMy();
    }, 

    methods: {
        goback(){
            this.$router.go(-1);
        },
        // 弹出框
        showPopup(){
            this.isShow = true
        },
    
        // 获取我的
        getMy(){
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

            this.axios({
                method: "GET",
                url: this.baseUrl + "findAccountInfo",
                params:{
                    appkey: this.appkey,
                    tokenString: tokenString,
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.code == "B001"){
                    if(res.data.result[0].desc == ""){
                        res.data.result[0].desc="这个人很懒，什么都没有留下~";
                    }
                    this.myData = res.data.result[0];
                }else{
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    });
                }
            }).catch(error=>{
                console.log(error)
            });
        },

        // 更换头像
        changeImg(file) {
            // 此时可以自行将文件上传至服务器
            // console.log(file);

            // 验证token
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
                }
            }).catch(error=>{
                console.log(error)
            });

        },


        updateNick(){
            let tokenString = localStorage.getItem("tokenString")
            if(!tokenString){
                this.$toast({
                    message: "登录失效 请重新登录 ",
                    forbidClick: true,
                    duration: 1000
                })
               return this.$router.push({name: "Login"})
            };

            let val = document.getElementsByClassName("inp")[0].value;
            let reg= /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/;
            if(val ==""){
                return
            }
            var legal = reg.test(val);

            if(!legal){
                this.$toast({
                    message: "昵称仅支持11位汉字字母数字组合",
                    forbidClick: true,
                    duration: 1000
                })
                document.getElementsByClassName("inp")[0].value=""
                return
            }else{
                this.axios({
                    method: "POST",
                    url: this.baseUrl + "updateNickName",
                    data:{
                        appkey: this.appkey,
                        tokenString: tokenString,
                        nickName: val,
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.data.code == "C001"){
                        this.myData.nickName = res.data.nickName;
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 800
                        });
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 800
                        });
                    }
                }).catch(error=>{
                    console.log(error)
                });
            }

        },


        updateIntroduce(){
            let tokenString = localStorage.getItem("tokenString")
            if(!tokenString){
                this.$toast({
                    message: "登录失效 请重新登录 ",
                    forbidClick: true,
                    duration: 1000
                })
                return this.$router.push({name: "Login"})
            };

            let val = document.getElementsByTagName("textarea")[0].value;
            // if(val != "这个人很懒，什么都没有留下~"){
                this.axios({
                    method: "POST",
                    url: this.baseUrl + "updateDesc",
                    data:{
                        appkey: this.appkey,
                        tokenString: tokenString,
                        desc: val,
                    }
                }).then(res=>{
                    if(res.data.code == "D001"){
                        this.myData.desc = val
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 800
                        });
                    }
                }).catch(error=>{
                    console.log(error)
                });
            // }

        }
    },
}
</script>

