module.exports={
    publicPath: process.env.NODE_ENV === "production" ? "./" :"/",

    //重写webpack配置
    // 代理配置 解决 请求数据中的跨域问题
    // configureWebpack:{
    //     // 设置开发服务器
    //     devServer:{
    //         // 配置代理
    //         proxy:{
    //             // 请求路径
    //             '/top/playlist/highquality':{
    //                 // 真实的请求路径
    //                 target:"http://musicapi.leanapp.cn",
    //                 // 是否跨域
    //                 changeOrigin: true
    //             }
    //         }
    //     }
    // }
}