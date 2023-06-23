import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://mock.mengxuegu.com/mock/629d727e6163854a32e8307e',
  timeout: 3000,
  // 跨域时候允许携带凭证
  withCredentials: true
})

// 获取用户列表
export const getUserList = (params: any) => {
  return api.post(`/geeker/user/list`, params);
};