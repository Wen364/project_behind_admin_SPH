// 平台属性管理数据模块
// 引入axios（axios的二次封装）
import request from '@/utils/request'

// 获取一级分类数据    /admin/product/getCategory1   get请求
export const reqGetFirstCategoryList = () => {
    return request({
        method:'get',
        url:'/admin/product/getCategory1'
    })
}

// 通过一级分类id获取二级分类数据   /admin/product/getCategory2/{category1Id}  get请求
export const reqGetSecondCategoryListByFirst = (category1Id) => {
    return request({
        method:'get',
        url:`/admin/product/getCategory2/${category1Id}`
    })
}
// 通过二级分类id获取三级分类数据    /admin/product/getCategory3/{category2Id}   get请求
export const reqGetThirdCategoryListBySecond = (category2Id) => {
    return request({
        method:'get',
        url:`/admin/product/getCategory3/${category2Id}`
    })
}

// 获取商品分类信息数据  通过id   /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get请求
export const reqAttrInfoList = ({category1Id,category2Id,category3Id}) => {
    return request({
        method:'get',
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    })
}

// 添加或保存属性与属性值   /admin/product/saveAttrInfo   post请求
// 参数    服务器自动生成 id 所以我们不需要写
// {
//     "attrName": "string",  属性名
//     "attrValueList": [     属性名里的属性值，因为可能有多个，所以为数组
//       {
//         "attrId": 0,        属性的 id
//         "valueName": "string"    属性名
//       }
//     ],
//     "categoryId": 0,        category3Id
//     "categoryLevel": 3,      
//   }
export const reqAddOrSaveAttr = (data) => {
    return request({
        method:'post',
        url:'/admin/product/saveAttrInfo',
        data
    })
}

