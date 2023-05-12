// 品牌管理数据模块
// 引入axios（axios的二次封装）
import request from '@/utils/request'

// 获取 sku 数据 /admin/product/list/{page}/{limit}  get请求
export const reqSkuList = (page,limit) => request({method:'get',url:`/admin/product/list/${page}/${limit}`})

//  sku 商品下架   /admin/product/cancelSale/{skuId}   get请求
export const cancelSale = (skuId) => request({method:'get',url:`/admin/product/cancelSale/${skuId}`})   

// sku 商品上架  /admin/product/onSale/{skuId}   get请求
export const onSale = (skuId) => request({method:'get',url:`/admin/product/onSale/${skuId}`})

//  通过 skuId 来获取 当前 sku 数据 /admin/product/getSkuById/{skuId}  get请求
export const reqGetSkuById = (skuId) => request({method:'get',url:`/admin/product/getSkuById/${skuId}`})