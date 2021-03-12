<template>
    <div class="address-list">
        <van-nav-bar left-arrow fixed @click-left="goback">
            <template #title>
                <van-icon name="home-o"/>
                我的地址
            </template>
        </van-nav-bar>
        <div>
            
        </div>
        <van-address-list
            :list="list"
            default-tag-text="默认"
            :switchable=false
            @add="onAdd"
            @edit="onEdit"
        />
    </div>
</template>

<script>
import "../assets/less/addressList.less";
export default {
    name: "AddressList",
    data() {
        return {
            // 地址列表数据
            list: [],
        }
    },
    created(){
        this.getAddressListData();
        // this.popo()
    },

    methods: {
        goback(){
            this.$router.go(-1);
        },
        // 弹出框
        // popo(){
        //     if(this.list.length <=0){
        //         this.$toast({
        //             message: "快去添加一个地址吧~~",
        //             forbidClick: true,
        //             duration:1000,
        //         });
        //     }
        // },
        // 跳转到新增地址
        onAdd() {
            this.$router.push({name: "NewAddress"})
        },
        // 编辑地址
        onEdit({aid}) {
            this.$router.push({name:"NewAddress",params: {aid} })
        },

        // 地址数据
        getAddressListData(){
            // token验证
            // let tokenString =  this.$cookies.get("tokenString");
            let tokenString = localStorage.getItem("tokenString")
            // console.log(tokenString)
            if(!tokenString){
                this.$toast({
                    message: "登录了才可以查看~~",
                    forbidClick: true,
                    duration: 1000
                })
                return
            };

            this.axios({
                method: "GET",
                url: this.baseUrl+ "findAddress",
                params:{
                    appkey: this.appkey,
                    tokenString: tokenString
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.code ==20000){
                    res.data.result.forEach(v=>{
                        v.address = `${v.province}${v.county} ${v.addressDetail}`
                        v.isDefault = Boolean(v.isDefault)
                    })
                    this.list = res.data.result
                }else{
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration:1000,
                    });
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    },
}
</script>

