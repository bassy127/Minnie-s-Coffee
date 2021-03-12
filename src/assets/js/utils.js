// 导入 轻提示
import { Toast } from 'vant';
class Utils{

    // 注册表单验证
    formCheck(o){
        for(let key in o){
            // 如果 正则匹配不成功
            if( !o[key].reg.test(o[key].value)){
                Toast({//提示内容
                    message:o[key].errorMag,
                    overlay: false,
                    // 防止连续点击按钮
                    forbidClick: true
                });
                // 终止代码
                return false
            }
        }
        // 表单验证 通过
        return true;
    }
}

// 导出 模块
export const utils = new Utils();