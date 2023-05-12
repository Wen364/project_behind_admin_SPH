// 品牌管理数据模块
// 引入axios（axios的二次封装）
import request from '@/utils/request'

// 获取 Spu 数据列表    /admin/product/{page}/{limit}   get请求  参数： page  limit  category3Id
export const reqSpuInfoList = (page, limit, category3Id) => {
    return request({
        method: 'get',
        url: `/admin/product/${page}/${limit}`,
        params: { category3Id }
    })
}

// 获取 对应 Id 的 spu 的信息   /admin/product/getSpuById/{spuId}  get请求
export const reqSpuInfoById = (spuId) => request({ method: 'get', url: `/admin/product/getSpuById/${spuId}` })

// 获取品牌信息   /admin/product/baseTrademark/getTrademarkList  get请求
export const reqBaseTradeMark = () => request({ method: 'get', url: '/admin/product/baseTrademark/getTrademarkList' })

// 获取对应 id 的 spu图片       /admin/product/spuImageList/{spuId}   get请求
export const reqSpuImgList = (spuId) => request({ method: 'get', url: `/admin/product/spuImageList/${spuId} ` })

// 获取平台全部 销售属性 销售属性一共三个  /admin/product/baseSaleAttrList   get
export const reqBaseSaleAttrList = () => request({ method: 'get', url: '/admin/product/baseSaleAttrList' })

// 修改 spu 和 添加 spu   修改spu会有对应的id，而添加则没有id
export const reqAddOrUpdateSpuInfo = (spuInfo) => {
    // 携带的参数是否有id  -- 修改spu
    if(spuInfo.id){
        return request({
            method:'post',
            url:'/admin/product/updateSpuInfo',
            data:spuInfo
        })
    }else{
        // 添加spu
        return request({
            url:'/admin/product/saveSpuInfo',
            method:'post',
            data:spuInfo
        })
    }
}

// 删除 spu  /admin/product/deleteSpu/{spuId}
export const deleteSpuInfoById = (spuId) => request({method:'delete',url:`/admin/product/deleteSpu/${spuId}`})

// 获取图片的接口   /admin/product/spuImageList/{spuId}   get请求
export const reqGetSpuImageList = (spuId) => request({method:'get',url:`/admin/product/spuImageList/${spuId}`})

// 获取销售属性数据  /admin/product/spuSaleAttrList/{spuId}   get请求
export const reqGetSpuSaleAttrList = (spuId) => request({method:'get',url:`/admin/product/spuSaleAttrList/${spuId}`})

// 获取商品基本属性   /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get请求
export const reqGetAttrInfoList = ({category1Id,category2Id,category3Id}) => request({method:'get',url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`})

// 添加 sku  /admin/product/saveSkuInfo    post请求
export const reqSaveSkuInfo = (skuInfo) => request({method:'post',url:'/admin/product/saveSkuInfo',data:skuInfo})

//  查看 sku 信息  /admin/product/findBySpuId/{spuId}   get请求
export const reqSkuInfoBySpuId = (spuId)  => request({method:'get',url:`/admin/product/findBySpuId/${spuId}`})