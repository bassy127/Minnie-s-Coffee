<template>
  <div id="app">
    <!-- 一级路由插座 -->
    <router-view/>
  </div>
</template>
<script>

export default {
  components:{
  }
}
</script>

<style lang="less">
*{
    font-size: 16px;
}
i,em,b,span{
    font-style: normal;
    display: inline-block;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body{
  margin: 0 auto;
}
.van-toast--html, .van-toast--text{
  color: #fff;
}
.van-goods-action{
  padding: 8px 0px;
}
// 商品详情 样式
.van-nav-bar .van-icon{
    color: #000;
    font-size: 20px;
}
.van-nav-bar{
  border-bottom: 1px solid #000;
}


// 加减按钮
.van-stepper--round .van-stepper__minus{
    color: #000;
    background-color: #fff;
    border: 0.02667rem solid #000;
}
.van-stepper--round .van-stepper__plus {
    color: #fff;
    background-color: #000;
}

// 默认 样式
.van-address-item__tag{
    padding: 0px 8px;
    background-color: #fff;
    color: #333;
    border: 1px solid #000;
}

</style>

