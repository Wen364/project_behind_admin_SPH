// 将四个模块请求的接口函数统一暴露
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'
import * as tradeMark from './product/tradeMark'

//引入权限相关的接口文件
import * as user from './acl/user';
import role from './acl/role';
import permission from './acl/permission'

// 对外暴露
export default {
    attr,
    sku,
    spu,
    tradeMark,
    user,
    role,
    permission
}

