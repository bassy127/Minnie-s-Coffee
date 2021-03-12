<template>
    <div class="newAddress">
        <van-nav-bar left-arrow fixed
        :title="aid ? '编辑地址': '新增地址' " 
        @click-left="goback" />

        <van-address-edit
            :area-list="area"
            show-postal
            :show-delete = "!!aid"
            show-set-default
            show-search-result
            detail-maxlength="50"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            :address-info="initEditData"
            @save="onSave"
            @delete="onDelete"
            @edit="getAddressDataByAid"
        />
    </div>
</template>

<script>
import "../assets/less/newAddress.less"
import area from "../assets/js/area.js"
export default {
    name: "NewAddress",
    data() {
        return {
            area,
            searchResult: [],
            aid: '', // 存放路由的id

            // 编辑地址初始值
            initEditData:{}
        };
    },
    created(){
        // 截取路由的id
        if(this.$route.params.aid){
            this.aid = this.$route.params.aid
        }

        this.getAddressDataByAid();
        // 如果存在aid
        // if(this.aid){
        //     this.getAddressDataByAid();
        // }
    },
    methods: {
        // 返回上一级
        goback(){
            this.$router.go(-1)
        },
        // 新增
        add(value) {
            // token验证
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

            // 复制数据 再处理数据
            let data = {...value, tokenString,appkey:this.appkey}; 
            //===>Object.assign({tokenString,appkey: this.appkey},value);

            // 因为接口的数据只接受 0/1 所以需要转换一下
            data.isDefault = Number(data.isDefault);

            delete data.country; // 删除 多余的数据

            this.axios({
                method: "POST",
                url: this.baseUrl+ "addAddress",
                data
            }).then(res=>{
                if(res.data.code ==9000){
                    this.$router.go(-1)
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
        },
        edit(value){

            let isEdit = false;

            // 遍历 初始数据 判断 是被被编辑过
            for(let i in this.initEditData){
                if(this.initEditData[i] !== value[i]){
                    // 只要有一个数据不一样 就是被编辑过
                    isEdit = true;
                    break;
                }
            }

            // 发起编辑 请求
            if(isEdit){
                // token验证
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

                // 复制 一份value 数据
                let editValue = {}
                editValue.aid = this.aid;
                editValue.name = value.name;
                editValue.tel = value.tel;
                editValue.province = value.province;
                editValue.city = value.city;
                editValue.county = value.county;
                editValue.addressDetail = value.addressDetail;
                editValue.areaCode = value.areaCode;
                editValue.postalCode = value.postalCode;
                editValue.isDefault = Number(value.isDefault);

                this.axios({
                    method: "POST",
                    url: this.baseUrl+ "editAddress",
                    data:{
                        appkey: this.appkey,
                        tokenString: tokenString,
                        ...editValue
                    }
                }).then(res=>{
                    // console.log(res);
                    if(res.data.code == 30000){
                        this.$router.push({name: "AddressList"})
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

            }else{
                this.$router.push({name: "AddressList"})
            }
        },
        // 保存
        onSave(value){
            if(this.aid){
                this.edit(value)
            }else{
                this.add(value)
            }
        },

        // 删除
        onDelete() {
            let tokenString = localStorage.getItem("tokenString")
            if(!tokenString){
                this.$toast({
                    message: "登录了才可以查看~~",
                    forbidClick: true,
                    duration: 1000
                })
                return
            };
            this.axios({
                method: "POST",
                url: this.baseUrl + "deleteAddress",
                data:{
                    appkey : this.appkey,
                    tokenString: tokenString,
                    aid: this.aid
                }
            }).then(res=>{

                if(res.data.code == 10000){
                    this.$router.push({name: "AddressList"})
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
        },
        // 编辑地址-根据aid获取地址数据
        getAddressDataByAid(){
            if(!this.$route.params.aid){
                return
            }

            // token验证
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
            // 将 isDefault 转为布尔值
            this.axios({
                method: "GET",
                url: this.baseUrl+ "findAddressByAid",
                params:{
                    appkey: this.appkey,
                    tokenString: tokenString,
                    aid: this.aid
                }
            }).then(res=>{
                if(res.data.code == 40000){
                    let data=  res.data.result[0]
                    // data.isDefault = !!isDefault
                    data.isDefault = Boolean(data.isDefault)
                    this.initEditData = data
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
        },

    },
}
</script>
