// 品牌管理数据模块
// 引入axios（axios的二次封装）
import request from '@/utils/request'


// 获取品牌列表   /admin/product/baseTrademark/{page}/{limit}    get请求 
export const reqTradeMarkList = (page,limit) => {
    return request({
        method:'get',
        url:`/admin/product/baseTrademark/${page}/${limit}`
    })
}

// 添加品牌  /admin/product/baseTrademark/save    post请求 
// 参数：  因为是新增产品，服务器那边会自动生成id，所以不需要id 只需要 url地址和名字
// {
//     "id": 0,
//     "logoUrl": "string",
//     "tmName": "string"
//   }
export const reqAddTradeMark = (banner) => {
    return request({
        method:'post',
        url:'/admin/product/baseTrademark/save',
        data:banner
    })
}

// 修改品牌产品  /admin/product/baseTrademark/update   put请求 
// 参数   这个已经是新增完成的了，所以需要id
// {
//     "id": 0,
//     "logoUrl": "string",
//     "tmName": "string"
//   }
export const updateTradeMark = (baseTrademark) => {
    return request({
        method:'put',
        url:'/admin/product/baseTrademark/update',
        data:baseTrademark
    })
}

// 删除品牌信息 /admin/product/baseTrademark/remove/{id}   delete请求  参数 id
export const deleteTradeMark = (id) => {
    return request({
        method:'delete',
        url:`/admin/product/baseTrademark/remove/${id}`
    })
}