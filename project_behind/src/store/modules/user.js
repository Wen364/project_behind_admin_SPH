import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter ,asyncRoutes,constantRoutes,anyRoutes} from '@/router'
// 引入路由器
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 路由权限
    routes:[],
    // 按钮权限
    buttons:[],
    // 用户角色
    roles:[],
    // 对比之后的要全部显示的路由
    finallyRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    // 合并两个对象
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 存储用户信息
  SET_USERINFO: (state,userInfo)=> {
    // 存储到 state 仓库中
    state.name = userInfo.name
    state.buttons = userInfo.buttons
    state.routes = userInfo.routes
    state.roles = userInfo.roles
    state.avatar = userInfo.avatar
  },
  // 最终计算出来的异步路由
  SET_FINALLYROUTES:(state,asyncRoutes) => {
    // 合并所以的路由，然后把结果放到 state 仓库里面
    let result = constantRoutes.concat(asyncRoutes,anyRoutes)
    // 赋值
    state.finallyRoutes = result
    // 给路由器添加新的路由
    router.addRoutes(result)
  }
}

const actions = {
  // 登陆业务
  async login({ commit }, userInfo) {
    // 解构用户名和密码
    const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    let result = await login({ username: username.trim(), password: password })
    // 当前使用数据是 mock 数据，这里返回的正确的code是20000
    if(result.code == 20000 || result.code == 200){
      // console.log(result);
      const {data} = result
      // 获取token存储到仓库里
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      // console.log(data.token);
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        console.log(data);

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // 
        commit('SET_USERINFO',data)
        // 这里传的参数就是 根据每个人不同而 返回的不同的 routes，
        commit('SET_FINALLYROUTES',computedRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },




  // 退出登录业务
  async logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    let result = await logout(state.token)
    // console.log(result);
    // 判断是否成功
    if(result.code == 200 || result.code == 20000){
      // 成功的话先删除本地存储的token
      removeToken()
      // 重置路由
      resetRouter()
      // 
      commit('RESET_STATE')
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

  // 计算  要 显示的路由 
const computedRoutes = (asyncRoutes,originRoutes) => {
  // 过滤出来当前用户需要展示的路由
  // console.log(asyncRoutes);
  // console.log(originRoutes);
  return asyncRoutes.filter( item => {
    // 如果数组中每页这个元素 则返回 -1  
      if(originRoutes.indexOf(item.name) != -1){
        // 因为 不止一层路由，需要用到递归来解决
        if(item.children && item.children.length){
          item.children = computedRoutes(item.children,originRoutes)
        }
        return true
      }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

